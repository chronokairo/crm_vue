import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { LoginCredentials } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)
  const userRole = computed(() => authStore.userRole)

  // Methods
  async function login(credentials: LoginCredentials) {
    try {
      await authStore.login(credentials)
      
      // Redirect to intended page or dashboard
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  async function logout() {
    try {
      await authStore.logout()
      await router.push('/login')
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    }
  }

  async function refreshUser() {
    try {
      await authStore.getCurrentUser()
      return true
    } catch (error) {
      console.error('Failed to refresh user:', error)
      return false
    }
  }

  function clearError() {
    authStore.clearError()
  }

  // Check if user has specific role
  function hasRole(role: string) {
    return userRole.value === role
  }

  // Check if user has any of the provided roles
  function hasAnyRole(roles: string[]) {
    return roles.includes(userRole.value || '')
  }

  // Check if user is admin
  function isAdmin() {
    return hasRole('admin')
  }

  // Check if user is manager or admin
  function isManagerOrAdmin() {
    return hasAnyRole(['manager', 'admin'])
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    
    // Methods
    login,
    logout,
    refreshUser,
    clearError,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManagerOrAdmin
  }
}