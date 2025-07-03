import { apiClient } from './api'
import type { LoginCredentials, AuthResponse, User } from '@/types'

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Even if API call fails, clear local storage
      console.warn('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh')
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}