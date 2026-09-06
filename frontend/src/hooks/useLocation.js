import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocation() {
  const watchId = useRef(null)
  const [location, setLocation] = useState(null)
  const [track, setTrack] = useState([])
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('Location services have not been started.')
  const start = useCallback(() => {
    if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current)
    if (!navigator.geolocation) { setState('unavailable'); setMessage('This browser does not provide location services.'); return }
    setState('connecting'); setMessage('Requesting location permission…')
    const onPosition = ({ coords, timestamp }) => {
        const next = { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy, heading: coords.heading, speed: coords.speed, timestamp }
        setLocation(next)
        setTrack(previous => [...previous.slice(-499), [next.latitude, next.longitude]])
        setState('connected'); setMessage('Location source connected.')
      }
    const onError = (error) => { setState('unavailable'); setMessage(error.code === 1 ? 'Location access was denied. Allow location for localhost:5173 in browser settings.' : error.code === 3 ? 'GPS request timed out. Move to an open area or connect an external GPS source.' : 'Location services are unavailable. Check the device location service.') }
    navigator.geolocation.getCurrentPosition(onPosition, onError, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
    watchId.current = navigator.geolocation.watchPosition(onPosition, onError, { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 })
  }, [])
  const stop = useCallback(() => { if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current); watchId.current = null; setState('idle'); setMessage('Location services stopped.') }, [])
  const clearTrack = useCallback(() => setTrack([]), [])
  useEffect(() => () => { if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current) }, [])
  return { location, track, state, message, start, stop, clearTrack }
}
