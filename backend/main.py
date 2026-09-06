from pathlib import Path
import shutil
import uuid

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO


# Project root
ROOT = Path(__file__).resolve().parents[1]

# Your trained model
MODEL_PATH = ROOT / "ml" / "models" / "best.pt"

# Temporary uploads
UPLOAD_DIR = ROOT / "runs" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


app = FastAPI(
    title="Marine Intelligence AI API",
    version="1.0.0",
)


# Allow the Vite frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load model once when backend starts
if not MODEL_PATH.exists():
    raise RuntimeError(f"YOLO model not found: {MODEL_PATH}")

print(f"Loading YOLO model from: {MODEL_PATH}")
model = YOLO(str(MODEL_PATH))
print("YOLO model loaded successfully.")


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Marine Intelligence AI API",
        "model": MODEL_PATH.name,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_ready": True,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    # Create unique temporary filename
    extension = Path(file.filename or ".jpg").suffix or ".jpg"
    filename = f"{uuid.uuid4()}{extension}"
    image_path = UPLOAD_DIR / filename

    try:
        # Save uploaded image
        with image_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run YOLO inference
        results = model.predict(
            source=str(image_path),
            conf=0.25,
            imgsz=640,
            verbose=False,
        )

        detections = []

        for result in results:
            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append({
                    "class_id": class_id,
                    "class_name": model.names[class_id],
                    "confidence": confidence,
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2,
                    },
                })

        top_confidence = max(
            (d["confidence"] for d in detections),
            default=0.0
        )

        return {
            "success": True,
            "filename": file.filename,
            "detections": detections,
            "count": len(detections),
            "top_confidence": top_confidence,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(e)}"
        )

    finally:
        # Remove temporary uploaded image
        if image_path.exists():
            image_path.unlink()