import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface PaginationOptions {
  page?: number
  limit?: number
  total?: number
}

export function usePagination(initialOptions: PaginationOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  const page = ref(initialOptions.page || parseInt(route.query.page as string) || 1)
  const limit = ref(initialOptions.limit || parseInt(route.query.limit as string) || 10)
  const total = ref(initialOptions.total || 0)

  const totalPages = computed(() => Math.ceil(total.value / limit.value))
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)
  const startItem = computed(() => (page.value - 1) * limit.value + 1)
  const endItem = computed(() => Math.min(page.value * limit.value, total.value))

  const setPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
      updateUrl()
    }
  }

  const setLimit = (newLimit: number) => {
    limit.value = newLimit
    page.value = 1
    updateUrl()
  }

  const setTotal = (newTotal: number) => {
    total.value = newTotal
  }

  const nextPage = () => {
    if (hasNext.value) {
      setPage(page.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrev.value) {
      setPage(page.value - 1)
    }
  }

  const firstPage = () => {
    setPage(1)
  }

  const lastPage = () => {
    setPage(totalPages.value)
  }

  const updateUrl = () => {
    const query = { ...route.query }
    
    if (page.value > 1) {
      query.page = page.value.toString()
    } else {
      delete query.page
    }
    
    if (limit.value !== 10) {
      query.limit = limit.value.toString()
    } else {
      delete query.limit
    }
    
    router.replace({ query })
  }

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    startItem,
    endItem,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  }
}
