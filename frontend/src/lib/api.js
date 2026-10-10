import axios from 'axios'

export const API_ORIGIN = import.meta.env.VITE_API_URL || ''
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:5051' : window.location.origin)
export const TOKEN_KEY = 'susira_token'

const api = axios.create({ baseURL: `${API_ORIGIN}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || (err?.request && !err?.response ? 'Unable to reach the server.' : fallback)

export const assetUrl = (path) => (path ? `${API_ORIGIN}${path}` : '')

export default api
