import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activitiesService } from '@/services/activities'
import type { Activity, ActivityFormData, FilterOptions, PaginatedResponse } from '@/types'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref<Activity[]>([])
  const currentActivity = ref<Activity | null>(null)
  const upcomingActivities = ref<Activity[]>([])
  const overdueActivities = ref<Activity[]>([])
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
    type: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    perPage: 20
  })

  // Getters
  const totalActivities = computed(() => pagination.value.total)
  const hasActivities = computed(() => activities.value.length > 0)
  const activitiesByStatus = computed(() => {
    return activities.value.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })
  const activitiesByType = computed(() => {
    return activities.value.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })
  const todaysActivities = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return activities.value.filter(activity => 
      activity.date && activity.date.startsWith(today)
    )
  })
  const completedActivities = computed(() => 
    activities.value.filter(activity => activity.status === 'completed')
  )
  const pendingActivities = computed(() => 
    activities.value.filter(activity => activity.status === 'scheduled')
  )

  // Actions
  async function fetchActivities(newFilters: Partial<FilterOptions> = {}) {
    try {
      isLoading.value = true
      error.value = null
      
      // Update filters
      filters.value = { ...filters.value, ...newFilters }
      
      const response: PaginatedResponse<Activity> = await activitiesService.getActivities(filters.value)
      
      activities.value = response.data
      pagination.value = response.meta
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch activities'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchActivity(id: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const activity = await activitiesService.getActivity(id)
      currentActivity.value = activity
      
      return activity
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch activity'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createActivity(data: ActivityFormData) {
    try {
      isCreating.value = true
      error.value = null
      
      const activity = await activitiesService.createActivity(data)
      
      // Add to beginning of list
      activities.value.unshift(activity)
      pagination.value.total += 1
      
      return activity
    } catch (err: any) {
      error.value = err.message || 'Failed to create activity'
      throw err
    } finally {
      isCreating.value = false
    }
  }

  async function updateActivity(id: string, data: Partial<ActivityFormData>) {
    try {
      isUpdating.value = true
      error.value = null
      
      const activity = await activitiesService.updateActivity(id, data)
      
      // Update in list
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = activity
      }
      
      // Update current activity if it's the same
      if (currentActivity.value?.id === id) {
        currentActivity.value = activity
      }
      
      return activity
    } catch (err: any) {
      error.value = err.message || 'Failed to update activity'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function updateActivityStatus(id: string, status: Activity['status']) {
    try {
      isUpdating.value = true
      error.value = null
      
      const activity = await activitiesService.updateActivityStatus(id, status)
      
      // Update in list
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = activity
      }
      
      // Update current activity if it's the same
      if (currentActivity.value?.id === id) {
        currentActivity.value = activity
      }
      
      return activity
    } catch (err: any) {
      error.value = err.message || 'Failed to update activity status'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteActivity(id: string) {
    try {
      isDeleting.value = true
      error.value = null
      
      await activitiesService.deleteActivity(id)
      
      // Remove from list
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value.splice(index, 1)
        pagination.value.total -= 1
      }
      
      // Clear current activity if it's the same
      if (currentActivity.value?.id === id) {
        currentActivity.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete activity'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  async function fetchUpcomingActivities(days: number = 7) {
    try {
      isLoading.value = true
      error.value = null
      
      const upcoming = await activitiesService.getUpcomingActivities(days)
      upcomingActivities.value = upcoming
      
      return upcoming
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch upcoming activities'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOverdueActivities() {
    try {
      isLoading.value = true
      error.value = null
      
      const overdue = await activitiesService.getOverdueActivities()
      overdueActivities.value = overdue
      
      return overdue
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch overdue activities'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getActivitiesByContact(contactId: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const contactActivities = await activitiesService.getActivitiesByContact(contactId)
      
      return contactActivities
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch activities by contact'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getActivitiesByDeal(dealId: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const dealActivities = await activitiesService.getActivitiesByDeal(dealId)
      
      return dealActivities
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch activities by deal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function markAsCompleted(id: string) {
    try {
      isUpdating.value = true
      error.value = null
      
      const activity = await activitiesService.markAsCompleted(id)
      
      // Update in list
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = activity
      }
      
      return activity
    } catch (err: any) {
      error.value = err.message || 'Failed to mark activity as completed'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function searchActivities(query: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await activitiesService.searchActivities(query)
      
      return results
    } catch (err: any) {
      error.value = err.message || 'Failed to search activities'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentActivity(activity: Activity | null) {
    currentActivity.value = activity
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = {
      search: '',
      status: '',
      type: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  }

  function updateFilters(newFilters: Partial<FilterOptions>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    // State
    activities,
    currentActivity,
    upcomingActivities,
    overdueActivities,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    filters,
    
    // Getters
    totalActivities,
    hasActivities,
    activitiesByStatus,
    activitiesByType,
    todaysActivities,
    completedActivities,
    pendingActivities,
    
    // Actions
    fetchActivities,
    fetchActivity,
    createActivity,
    updateActivity,
    updateActivityStatus,
    deleteActivity,
    fetchUpcomingActivities,
    fetchOverdueActivities,
    getActivitiesByContact,
    getActivitiesByDeal,
    markAsCompleted,
    searchActivities,
    setCurrentActivity,
    clearError,
    resetFilters,
    updateFilters
  }
})