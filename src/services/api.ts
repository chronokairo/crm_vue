import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Format error response
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.status || 'NETWORK_ERROR',
      details: error.response?.data
    }

    return Promise.reject(apiError)
  }
)

// Generic API methods
export const apiClient = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> =>
    api.get(url, { params }).then(res => res.data),
    
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.post(url, data).then(res => res.data),
    
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.put(url, data).then(res => res.data),
    
  patch: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.patch(url, data).then(res => res.data),
    
  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    api.delete(url).then(res => res.data),
}

export default api