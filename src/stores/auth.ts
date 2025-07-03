import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(authService.getStoredUser())
  const token = ref<string | null>(authService.getStoredToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const userName = computed(() => user.value?.name)
  const userEmail = computed(() => user.value?.email)

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.login(credentials)
      
      user.value = response.user
      token.value = response.token
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      isLoading.value = true
      await authService.logout()
    } catch (err: any) {
      console.warn('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      isLoading.value = false
      error.value = null
    }
  }

  async function getCurrentUser() {
    try {
      isLoading.value = true
      error.value = null
      
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      
      return currentUser
    } catch (err: any) {
      error.value = err.message || 'Failed to get user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function refreshToken() {
    try {
      const response = await authService.refreshToken()
      user.value = response.user
      token.value = response.token
      return response
    } catch (err: any) {
      // If refresh fails, logout user
      await logout()
      throw err
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state
  function initializeAuth() {
    const storedToken = authService.getStoredToken()
    const storedUser = authService.getStoredUser()
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    userEmail,
    
    // Actions
    login,
    logout,
    getCurrentUser,
    refreshToken,
    clearError,
    initializeAuth
  }
})