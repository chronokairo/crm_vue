import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dealService } from '@/services/deals'
import type { Deal, DealStage, DealFilters } from '@/types'

export const useDealsStore = defineStore('deals', () => {
  // State
  const deals = ref<Deal[]>([])
  const stages = ref<DealStage[]>([])
  const selectedDeal = ref<Deal | null>(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const filters = ref<DealFilters>({})

  // Getters
  const dealsCount = computed(() => deals.value.length)
  const hasDeals = computed(() => deals.value.length > 0)
  const totalValue = computed(() => 
    deals.value.reduce((sum, deal) => sum + deal.value, 0)
  )
  const dealsByStage = computed(() => {
    const grouped: Record<string, Deal[]> = {}
    stages.value.forEach(stage => {
      grouped[stage.id] = deals.value.filter(deal => deal.stage.id === stage.id)
    })
    return grouped
  })

  // Actions
  async function fetchDeals(page = 1, newFilters?: DealFilters) {
    try {
      isLoading.value = true
      
      if (newFilters) {
        filters.value = { ...newFilters }
        pagination.value.page = 1
      } else {
        pagination.value.page = page
      }

      const response = await dealService.getDeals(
        filters.value,
        pagination.value.page,
        pagination.value.limit
      )

      if (page === 1) {
        deals.value = response.data
      } else {
        deals.value.push(...response.data)
      }

      pagination.value = response.pagination
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStages() {
    try {
      const stagesData = await dealService.getStages()
      stages.value = stagesData.sort((a, b) => a.position - b.position)
    } catch (error) {
      throw error
    }
  }

  async function fetchDeal(id: string) {
    try {
      isLoading.value = true
      const deal = await dealService.getDeal(id)
      selectedDeal.value = deal
      return deal
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true
      const newDeal = await dealService.createDeal(data)
      deals.value.unshift(newDeal)
      pagination.value.total += 1
      return newDeal
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateDeal(id: string, data: Partial<Deal>) {
    try {
      isLoading.value = true
      const updatedDeal = await dealService.updateDeal(id, data)
      
      const index = deals.value.findIndex(deal => deal.id === id)
      if (index !== -1) {
        deals.value[index] = updatedDeal
      }
      
      if (selectedDeal.value?.id === id) {
        selectedDeal.value = updatedDeal
      }
      
      return updatedDeal
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateDealStage(dealId: string, stageId: string) {
    try {
      const updatedDeal = await dealService.updateDealStage(dealId, stageId)
      
      const index = deals.value.findIndex(deal => deal.id === dealId)
      if (index !== -1) {
        deals.value[index] = updatedDeal
      }
      
      if (selectedDeal.value?.id === dealId) {
        selectedDeal.value = updatedDeal
      }
      
      return updatedDeal
    } catch (error) {
      throw error
    }
  }

  async function deleteDeal(id: string) {
    try {
      isLoading.value = true
      await dealService.deleteDeal(id)
      
      deals.value = deals.value.filter(deal => deal.id !== id)
      pagination.value.total -= 1
      
      if (selectedDeal.value?.id === id) {
        selectedDeal.value = null
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function clearSelectedDeal() {
    selectedDeal.value = null
  }

  function setFilters(newFilters: DealFilters) {
    filters.value = { ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    // State
    deals,
    stages,
    selectedDeal,
    isLoading,
    pagination,
    filters,
    
    // Getters
    dealsCount,
    hasDeals,
    totalValue,
    dealsByStage,
    
    // Actions
    fetchDeals,
    fetchStages,
    fetchDeal,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
    clearSelectedDeal,
    setFilters,
    clearFilters,
  }
})
