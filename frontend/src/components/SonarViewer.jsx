import React, { useState } from 'react'
export default function SonarViewer({ image, detections, selected, onSelect }) {
  const [zoom, setZoom] = useState(1)
  if (!image) return <div className="empty-view"><span>SONAR VIEWER</span><p>Upload a PNG, JPG, JPEG or TIFF sonar image to begin analysis.</p></div>
  return <div className="sonar-wrap"><div className="viewer-tools"><button onClick={() => setZoom(z => Math.min(2.5, z + .2))}>+</button><button onClick={() => setZoom(z => Math.max(.5, z - .2))}>−</button><button onClick={() => setZoom(1)}>Reset</button><span>{Math.round(zoom * 100)}%</span></div><div className="image-stage"><div className="image-canvas" style={{ transform: `scale(${zoom})` }}><img src={image.url} alt="Uploaded sonar scan" />{detections.map(d => <button key={d.id} className={`bbox ${selected?.id === d.id ? 'active' : ''}`} style={{ left: `${d.bbox[0]}%`, top: `${d.bbox[1]}%`, width: `${d.bbox[2]}%`, height: `${d.bbox[3]}%` }} onClick={() => onSelect(d)} aria-label={`Select ${d.id}`}><span>{d.class} {Math.round(d.confidence * 100)}%</span></button>)}</div></div></div>
}
