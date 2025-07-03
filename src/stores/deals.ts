import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dealsService } from '@/services/deals'
import type { Deal, DealFormData, FilterOptions, PaginatedResponse, PipelineData } from '@/types'

export const useDealsStore = defineStore('deals', () => {
  // State
  const deals = ref<Deal[]>([])
  const currentDeal = ref<Deal | null>(null)
  const pipelineData = ref<PipelineData[]>([])
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  const filters = ref<FilterOptions>({
    search: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    perPage: 20
  })

  // Getters
  const totalDeals = computed(() => pagination.value.total)
  const hasDeals = computed(() => deals.value.length > 0)
  const totalRevenue = computed(() => 
    deals.value
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0)
  )
  const dealsByStage = computed(() => {
    const stages = ['prospecting', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
    return stages.reduce((acc, stage) => {
      acc[stage] = deals.value.filter(deal => deal.stage === stage)
      return acc
    }, {} as Record<string, Deal[]>)
  })
  const averageDealValue = computed(() => {
    if (deals.value.length === 0) return 0
    return deals.value.reduce((sum, deal) => sum + deal.value, 0) / deals.value.length
  })
  const conversionRate = computed(() => {
    const total = deals.value.length
    const won = deals.value.filter(deal => deal.stage === 'closed-won').length
    return total > 0 ? (won / total) * 100 : 0
  })

  // Actions
  async function fetchDeals(newFilters: Partial<FilterOptions> = {}) {
    try {
      isLoading.value = true
      error.value = null
      
      // Update filters
      filters.value = { ...filters.value, ...newFilters }
      
      const response: PaginatedResponse<Deal> = await dealsService.getDeals(filters.value)
      
      deals.value = response.data
      pagination.value = response.meta
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch deals'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDeal(id: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const deal = await dealsService.getDeal(id)
      currentDeal.value = deal
      
      return deal
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch deal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createDeal(data: DealFormData) {
    try {
      isCreating.value = true
      error.value = null
      
      const deal = await dealsService.createDeal(data)
      
      // Add to beginning of list
      deals.value.unshift(deal)
      pagination.value.total += 1
      
      return deal
    } catch (err: any) {
      error.value = err.message || 'Failed to create deal'
      throw err
    } finally {
      isCreating.value = false
    }
  }

  async function updateDeal(id: string, data: Partial<DealFormData>) {
    try {
      isUpdating.value = true
      error.value = null
      
      const deal = await dealsService.updateDeal(id, data)
      
      // Update in list
      const index = deals.value.findIndex(d => d.id === id)
      if (index !== -1) {
        deals.value[index] = deal
      }
      
      // Update current deal if it's the same
      if (currentDeal.value?.id === id) {
        currentDeal.value = deal
      }
      
      return deal
    } catch (err: any) {
      error.value = err.message || 'Failed to update deal'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function updateDealStage(id: string, stage: Deal['stage']) {
    try {
      isUpdating.value = true
      error.value = null
      
      const deal = await dealsService.updateDealStage(id, stage)
      
      // Update in list
      const index = deals.value.findIndex(d => d.id === id)
      if (index !== -1) {
        deals.value[index] = deal
      }
      
      // Update current deal if it's the same
      if (currentDeal.value?.id === id) {
        currentDeal.value = deal
      }
      
      return deal
    } catch (err: any) {
      error.value = err.message || 'Failed to update deal stage'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteDeal(id: string) {
    try {
      isDeleting.value = true
      error.value = null
      
      await dealsService.deleteDeal(id)
      
      // Remove from list
      const index = deals.value.findIndex(d => d.id === id)
      if (index !== -1) {
        deals.value.splice(index, 1)
        pagination.value.total -= 1
      }
      
      // Clear current deal if it's the same
      if (currentDeal.value?.id === id) {
        currentDeal.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete deal'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  async function fetchPipelineData() {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await dealsService.getPipelineData()
      pipelineData.value = data
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch pipeline data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getDealsByContact(contactId: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const contactDeals = await dealsService.getDealsByContact(contactId)
      
      return contactDeals
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch deals by contact'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function searchDeals(query: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await dealsService.searchDeals(query)
      
      return results
    } catch (err: any) {
      error.value = err.message || 'Failed to search deals'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentDeal(deal: Deal | null) {
    currentDeal.value = deal
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = {
      search: '',
      status: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  }

  function updateFilters(newFilters: Partial<FilterOptions>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  // Drag and drop functionality
  function moveDealBetweenStages(dealId: string, newStage: Deal['stage']) {
    return updateDealStage(dealId, newStage)
  }

  return {
    // State
    deals,
    currentDeal,
    pipelineData,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    filters,
    
    // Getters
    totalDeals,
    hasDeals,
    totalRevenue,
    dealsByStage,
    averageDealValue,
    conversionRate,
    
    // Actions
    fetchDeals,
    fetchDeal,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
    fetchPipelineData,
    getDealsByContact,
    searchDeals,
    setCurrentDeal,
    clearError,
    resetFilters,
    updateFilters,
    moveDealBetweenStages
  }
})