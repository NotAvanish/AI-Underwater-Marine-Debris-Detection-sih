import { api } from './client'

export async function predictSonar(file) {
  const body = new FormData()
  body.append('file', file)
  return api('/predict', { method: 'POST', body })
}
