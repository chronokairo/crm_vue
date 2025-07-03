// import { apiService } from './api' // Commented out for mock implementation
import type { LoginCredentials, LoginResponse, User } from '@/types'

// Mock user data for testing
const MOCK_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@crm.com',
  role: 'admin',
  avatar: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const MOCK_CREDENTIALS = {
  email: 'admin@crm.com',
  password: '123456'
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Mock authentication - remove this when integrating with real backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === MOCK_CREDENTIALS.email && 
            credentials.password === MOCK_CREDENTIALS.password) {
          resolve({
            user: MOCK_USER,
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now()
          })
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1000) // Simulate network delay
    })
    
    // Real API call (commented out for now)
    // return apiService.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    //   .then(response => response.data)
  }

  async logout(): Promise<void> {
    // Mock logout - just resolve immediately
    return Promise.resolve()
    
    // Real API call (commented out for now)
    // return apiService.post('/auth/logout')
  }

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    // Mock refresh token
    return Promise.resolve({
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    })
    
    // Real API call (commented out for now)
    // return apiService.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh')
    //   .then(response => response.data)
  }

  async getCurrentUser(): Promise<User> {
    // Mock current user
    return Promise.resolve(MOCK_USER)
    
    // Real API call (commented out for now)
    // return apiService.get<ApiResponse<User>>('/auth/me')
    //   .then(response => response.data)
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Mock update profile
    return Promise.resolve({ ...MOCK_USER, ...data })
    
    // Real API call (commented out for now)
    // return apiService.put<ApiResponse<User>>('/auth/profile', data)
    //   .then(response => response.data)
  }

  async changePassword(_data: { currentPassword: string; newPassword: string }): Promise<void> {
    // Mock change password
    return Promise.resolve()
    
    // Real API call (commented out for now)
    // return apiService.post('/auth/change-password', data)
  }
}

export const authService = new AuthService()
