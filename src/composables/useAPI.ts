import { ref, reactive } from 'vue'
import type { ApiError } from '@/types'

interface UseApiOptions {
  immediate?: boolean
  throwOnError?: boolean
}

export function useAPI<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = false, throwOnError = false } = options

  // State
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Execute the API call
  async function execute(...args: any[]): Promise<T | null> {
    try {
      loading.value = true
      error.value = null
      
      const result = await apiCall(...args)
      data.value = result
      
      return result
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'An error occurred',
        code: err.code || 'UNKNOWN_ERROR',
        details: err.details || err
      }
      
      error.value = apiError
      
      if (throwOnError) {
        throw apiError
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  // Reset all state
  function reset() {
    data.value = null
    loading.value = false
    error.value = null
  }

  // Execute immediately if requested
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    clearError,
    reset
  }
}

// Composable for handling multiple API calls
export function useMultipleAPI() {
  const state = reactive({
    loading: false,
    errors: [] as ApiError[]
  })

  async function executeAll<T extends readonly unknown[] | []>(
    apiCalls: readonly [...{ [K in keyof T]: () => Promise<T[K]> }]
  ): Promise<T | null> {
    try {
      state.loading = true
      state.errors = []
      
      const results = await Promise.allSettled(
        apiCalls.map(call => call())
      )
      
      const data: any[] = []
      const errors: ApiError[] = []
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          data[index] = result.value
        } else {
          const apiError: ApiError = {
            message: result.reason?.message || 'An error occurred',
            code: result.reason?.code || 'UNKNOWN_ERROR',
            details: result.reason
          }
          errors.push(apiError)
          data[index] = null
        }
      })
      
      state.errors = errors
      
      return data as T
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'Multiple API calls failed',
        code: err.code || 'MULTIPLE_API_ERROR',
        details: err
      }
      
      state.errors = [apiError]
      return null
    } finally {
      state.loading = false
    }
  }

  function clearErrors() {
    state.errors = []
  }

  return {
    ...state,
    executeAll,
    clearErrors
  }
}

// Composable for paginated API calls
export function usePaginatedAPI<T = any>(
  apiCall: (page: number, perPage: number, filters?: any) => Promise<{ data: T[]; meta: any }>,
  initialPerPage: number = 20
) {
  const data = ref<T[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const currentPage = ref(1)
  const perPage = ref(initialPerPage)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const filters = ref<any>({})

  async function fetchPage(page: number = currentPage.value, newFilters?: any) {
    try {
      loading.value = true
      error.value = null
      
      if (newFilters !== undefined) {
        filters.value = newFilters
        currentPage.value = 1
        page = 1
      }
      
      const result = await apiCall(page, perPage.value, filters.value)
      
      data.value = result.data
      currentPage.value = page
      totalPages.value = result.meta.last_page
      totalItems.value = result.meta.total
      
      return result
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'Failed to fetch data',
        code: err.code || 'PAGINATION_ERROR',
        details: err
      }
      
      error.value = apiError
      return null
    } finally {
      loading.value = false
    }
  }

  async function nextPage() {
    if (currentPage.value < totalPages.value) {
      return await fetchPage(currentPage.value + 1)
    }
  }

  async function prevPage() {
    if (currentPage.value > 1) {
      return await fetchPage(currentPage.value - 1)
    }
  }

  async function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      return await fetchPage(page)
    }
  }

  function setPerPage(newPerPage: number) {
    perPage.value = newPerPage
    return fetchPage(1)
  }

  function setFilters(newFilters: any) {
    return fetchPage(1, newFilters)
  }

  function refresh() {
    return fetchPage(currentPage.value)
  }

  return {
    data,
    loading,
    error,
    currentPage,
    perPage,
    totalPages,
    totalItems,
    filters,
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
    setPerPage,
    setFilters,
    refresh
  }
}