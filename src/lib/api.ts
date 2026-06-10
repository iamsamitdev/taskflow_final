import axios from 'axios'
import { useAuthStore } from '@/features/auth/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

// Request Interceptor — แนบ JWT ทุก request โดยอัตโนมัติ
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor — เจอ 401 ให้ logout (ProtectedRoute จะพาไปหน้า login เอง)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
