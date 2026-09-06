const baseUrl = import.meta.env.VITE_API_URL || ''

export async function api(path, options = {}) {
  if (!baseUrl) throw new Error('Backend URL is not configured. Set VITE_API_URL to connect a service.')
  const response = await fetch(`${baseUrl}${path}`, options)
  if (!response.ok) throw new Error(`Service responded with ${response.status}`)
  return response.json()
}
