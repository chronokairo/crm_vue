import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useSearch<T = any>(searchFn: (query: string) => Promise<T[]>) {
  const route = useRoute()
  const router = useRouter()

  const query = ref((route.query.search as string) || '')
  const results = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasQuery = computed(() => query.value.trim().length > 0)
  const hasResults = computed(() => results.value.length > 0)

  const search = async (searchQuery?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const searchTerm = searchQuery !== undefined ? searchQuery : query.value
      
      if (searchTerm.trim().length === 0) {
        results.value = []
        return
      }

      const data = await searchFn(searchTerm)
      results.value = data
      
      // Update URL with search query
      updateUrl(searchTerm)
    } catch (err: any) {
      error.value = err.message || 'Search failed'
      results.value = []
    } finally {
      isLoading.value = false
    }
  }

  const clear = () => {
    query.value = ''
    results.value = []
    error.value = null
    updateUrl('')
  }

  const setQuery = (newQuery: string) => {
    query.value = newQuery
  }

  const updateUrl = (searchQuery: string) => {
    const queryParams = { ...route.query }
    
    if (searchQuery.trim().length > 0) {
      queryParams.search = searchQuery
    } else {
      delete queryParams.search
    }
    
    router.replace({ query: queryParams })
  }

  return {
    query,
    results,
    isLoading,
    error,
    hasQuery,
    hasResults,
    search,
    clear,
    setQuery,
  }
}
