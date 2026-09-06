import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function LocationBar() {
  const [visible, setVisible] = useState(false)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [saved, setSaved] = useState(false)
  const [target, setTarget] = useState(null)
  useEffect(() => {
    setTarget(document.querySelector('.actionbar > div'))
    const input = document.querySelector('.upload-button input')
    const onChange = () => { setVisible(true); setSaved(false); setLatitude(''); setLongitude(''); localStorage.removeItem('marine-scan-location') }
    input?.addEventListener('change', onChange)
    return () => input?.removeEventListener('change', onChange)
  }, [])
  const save = () => {
    const lat = Number(latitude), lon = Number(longitude)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) return
    localStorage.setItem('marine-scan-location', JSON.stringify({ latitude: lat, longitude: lon }))
    setSaved(true)
  }
  if (!target || !visible) return null
  return createPortal(<div className="inline-location"><span>SCAN LOCATION</span><input aria-label="Scan latitude" type="number" step="any" placeholder="LAT" value={latitude} onChange={e => setLatitude(e.target.value)} /><input aria-label="Scan longitude" type="number" step="any" placeholder="LON" value={longitude} onChange={e => setLongitude(e.target.value)} /><button onClick={save}>{saved ? 'SAVED' : 'SAVE LOCATION'}</button></div>, target)
}
