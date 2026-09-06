import React, { useEffect } from 'react'
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'

function Follow({ point }) { const map = useMap(); useEffect(() => { if (point) map.setView([point.latitude, point.longitude], Math.max(map.getZoom(), 15), { animate: true }) }, [point, map]); return null }
function Focus({ point }) { const map = useMap(); useEffect(() => { if (point) map.flyTo([point.latitude, point.longitude], Math.max(map.getZoom(), 15), { duration: .6 }) }, [point, map]); return null }
export default function MapViewer({ detections = [], selected, onSelect, location, track = [], demo = true }) {
  const center = location ? [location.latitude, location.longitude] : [18.5204, 73.8567]
  const points = track.length > 1 ? track : (location ? [[18.5199, 73.8557], center] : [[18.5200, 73.8550], [18.52025, 73.85605], [18.5204, 73.8567]])
  return <MapContainer center={center} zoom={14} className="map" aria-label="Survey map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Polyline positions={points} pathOptions={{ color: '#39b9d1', weight: 3, dashArray: demo ? '6 6' : undefined }} />{location && <CircleMarker center={center} radius={8} pathOptions={{ color: '#b9f4ff', fillColor: '#167f98', fillOpacity: 1 }}><Tooltip permanent>Current GPS position</Tooltip></CircleMarker>}{detections.filter(d => Number.isFinite(d.latitude) && Number.isFinite(d.longitude)).map(d => <CircleMarker key={d.id} center={[d.latitude, d.longitude]} radius={selected?.id === d.id ? 11 : 7} pathOptions={{ color: d.severity === 'high' ? '#ff8d70' : '#f3c969', fillColor: d.severity === 'high' ? '#cf4d37' : '#b58a20', fillOpacity: 1 }} eventHandlers={{ click: () => onSelect(d) }}><Tooltip>{d.id} · {Math.round(d.confidence * 100)}%</Tooltip></CircleMarker>)}<Follow point={location} /><Focus point={selected?.latitude ? selected : null} /></MapContainer>
}
