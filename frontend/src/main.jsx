import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './workspace.css'
import './theme.css'
import App from './AppWorkspace'
import LocationBar from './components/LocationBar'

createRoot(document.getElementById('root')).render(<BrowserRouter><App /><LocationBar /></BrowserRouter>)
