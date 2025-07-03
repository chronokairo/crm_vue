import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const userName = computed(() => user.value?.name)

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      isLoading.value = true
      const response = await authService.login(credentials)
      
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refreshToken
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      refreshToken.value = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  async function refreshTokenAction() {
    try {
      if (!refreshToken.value) throw new Error('No refresh token')
      
      const response = await authService.refreshToken()
      token.value = response.token
      refreshToken.value = response.refreshToken
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (error) {
      await logout()
      throw error
    }
  }

  async function getCurrentUser() {
    try {
      if (!token.value) return null
      
      const userData = await authService.getCurrentUser()
      user.value = userData
      return userData
    } catch (error) {
      await logout()
      throw error
    }
  }

  async function updateProfile(data: Partial<User>) {
    try {
      const updatedUser = await authService.updateProfile(data)
      user.value = updatedUser
      return updatedUser
    } catch (error) {
      throw error
    }
  }

  // Initialize auth state
  async function initialize() {
    if (token.value) {
      try {
        await getCurrentUser()
      } catch {
        await logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    
    // Actions
    login,
    logout,
    refreshTokenAction,
    getCurrentUser,
    updateProfile,
    initialize,
  }
})
