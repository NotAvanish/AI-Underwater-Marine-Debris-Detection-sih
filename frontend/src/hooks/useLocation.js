import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocation() {
  const watchId = useRef(null)
  const [location, setLocation] = useState(null)
  const [track, setTrack] = useState([])
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('Location services have not been started.')
  const start = useCallback(() => {
    if (!navigator.geolocation) { setState('unavailable'); setMessage('This browser does not provide location services.'); return }
    setState('connecting'); setMessage('Requesting location permission…')
    watchId.current = navigator.geolocation.watchPosition(
      ({ coords, timestamp }) => {
        const next = { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy, heading: coords.heading, speed: coords.speed, timestamp }
        setLocation(next)
        setTrack(previous => [...previous.slice(-499), [next.latitude, next.longitude]])
        setState('connected'); setMessage('Location source connected.')
      },
      (error) => { setState('unavailable'); setMessage(error.code === 1 ? 'Location access was denied. Enable it or connect a GPS source.' : 'Location services are unavailable. Check your device or GPS source.') },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  }, [])
  const clearTrack = useCallback(() => setTrack([]), [])
  useEffect(() => () => { if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current) }, [])
  return { location, track, state, message, start, clearTrack }
}
