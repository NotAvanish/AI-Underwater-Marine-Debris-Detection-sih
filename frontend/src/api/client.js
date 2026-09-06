const baseUrl = import.meta.env.VITE_API_URL || ''

export async function api(path, options = {}) {
  if (!baseUrl) throw new Error('Backend URL is not configured. Set VITE_API_URL to connect a service.')
  let response
  try { response = await fetch(`${baseUrl}${path}`, options) } catch { throw new Error(`Cannot reach ${baseUrl}. Start the FastAPI backend and verify VITE_API_URL.`) }
  if (!response.ok) throw new Error(`Service responded with ${response.status}`)
  return response.json()
}
