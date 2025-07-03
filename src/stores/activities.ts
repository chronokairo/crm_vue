import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activityService } from '@/services/activities'
import type { Activity, ActivityType, ActivityFilters } from '@/types'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref<Activity[]>([])
  const activityTypes = ref<ActivityType[]>([])
  const selectedActivity = ref<Activity | null>(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const filters = ref<ActivityFilters>({})

  // Getters
  const activitiesCount = computed(() => activities.value.length)
  const hasActivities = computed(() => activities.value.length > 0)
  const upcomingActivities = computed(() => 
    activities.value.filter(activity => 
      activity.status === 'scheduled' && 
      new Date(activity.startDate) > new Date()
    )
  )
  const completedActivities = computed(() => 
    activities.value.filter(activity => activity.status === 'completed')
  )
  const overdueActivities = computed(() => 
    activities.value.filter(activity => 
      activity.status === 'scheduled' && 
      new Date(activity.startDate) < new Date()
    )
  )

  // Actions
  async function fetchActivities(page = 1, newFilters?: ActivityFilters) {
    try {
      isLoading.value = true
      
      if (newFilters) {
        filters.value = { ...newFilters }
        pagination.value.page = 1
      } else {
        pagination.value.page = page
      }

      const response = await activityService.getActivities(
        filters.value,
        pagination.value.page,
        pagination.value.limit
      )

      if (page === 1) {
        activities.value = response.data
      } else {
        activities.value.push(...response.data)
      }

      pagination.value = response.pagination
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchActivityTypes() {
    try {
      const types = await activityService.getActivityTypes()
      activityTypes.value = types
    } catch (error) {
      throw error
    }
  }

  async function fetchActivity(id: string) {
    try {
      isLoading.value = true
      const activity = await activityService.getActivity(id)
      selectedActivity.value = activity
      return activity
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createActivity(data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true
      const newActivity = await activityService.createActivity(data)
      activities.value.unshift(newActivity)
      pagination.value.total += 1
      return newActivity
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateActivity(id: string, data: Partial<Activity>) {
    try {
      isLoading.value = true
      const updatedActivity = await activityService.updateActivity(id, data)
      
      const index = activities.value.findIndex(activity => activity.id === id)
      if (index !== -1) {
        activities.value[index] = updatedActivity
      }
      
      if (selectedActivity.value?.id === id) {
        selectedActivity.value = updatedActivity
      }
      
      return updatedActivity
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function completeActivity(id: string) {
    try {
      const completedActivity = await activityService.completeActivity(id)
      
      const index = activities.value.findIndex(activity => activity.id === id)
      if (index !== -1) {
        activities.value[index] = completedActivity
      }
      
      if (selectedActivity.value?.id === id) {
        selectedActivity.value = completedActivity
      }
      
      return completedActivity
    } catch (error) {
      throw error
    }
  }

  async function deleteActivity(id: string) {
    try {
      isLoading.value = true
      await activityService.deleteActivity(id)
      
      activities.value = activities.value.filter(activity => activity.id !== id)
      pagination.value.total -= 1
      
      if (selectedActivity.value?.id === id) {
        selectedActivity.value = null
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function clearSelectedActivity() {
    selectedActivity.value = null
  }

  function setFilters(newFilters: ActivityFilters) {
    filters.value = { ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    // State
    activities,
    activityTypes,
    selectedActivity,
    isLoading,
    pagination,
    filters,
    
    // Getters
    activitiesCount,
    hasActivities,
    upcomingActivities,
    completedActivities,
    overdueActivities,
    
    // Actions
    fetchActivities,
    fetchActivityTypes,
    fetchActivity,
    createActivity,
    updateActivity,
    completeActivity,
    deleteActivity,
    clearSelectedActivity,
    setFilters,
    clearFilters,
  }
})
