import { api } from './client'
export const getHealth = () => api('/health')
