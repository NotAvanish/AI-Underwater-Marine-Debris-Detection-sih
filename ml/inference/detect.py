from ultralytics import YOLO
from pathlib import Path
import argparse


# Project root
ROOT = Path(__file__).resolve().parents[2]

# Trained YOLO model
MODEL_PATH = ROOT / "ml" / "models" / "best.pt"


def main():
    parser = argparse.ArgumentParser(
        description="Run YOLO marine sonar object detection"
    )

    parser.add_argument(
        "--source",
        type=str,
        required=True,
        help="Path to image, folder, or video"
    )

    parser.add_argument(
        "--conf",
        type=float,
        default=0.25,
        help="Confidence threshold"
    )

    args = parser.parse_args()

    # Check model
    if not MODEL_PATH.exists():
        print(f"ERROR: Model not found at:")
        print(MODEL_PATH)
        return

    print("Loading YOLO model...")
    print(f"Model: {MODEL_PATH}")

    model = YOLO(str(MODEL_PATH))

    print("\nRunning detection...")
    print(f"Source: {args.source}")

    results = model.predict(
        source=args.source,
        conf=args.conf,
        imgsz=640,
        save=True,
        save_txt=True,
        save_conf=True,
        project=str(ROOT / "runs" / "detect"),
        name="sonar_test",
        exist_ok=True
    )

    print("\n===================================")
    print("       DETECTION COMPLETE")
    print("===================================")
    print(f"Results saved to:")
    print(ROOT / "runs" / "detect" / "sonar_test")

    for result in results:
        print(f"\nImage: {result.path}")

        if result.boxes is None or len(result.boxes) == 0:
            print("  No objects detected.")
            continue

        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names[class_id]

            print(
                f"  {class_name}: "
                f"{confidence * 100:.2f}%"
            )


if __name__ == "__main__":
    main()