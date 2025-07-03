import { apiClient } from './api'
import type { Activity, ActivityFormData, PaginatedResponse, FilterOptions } from '@/types'

export const activitiesService = {
  // Get all activities with optional filters
  async getActivities(filters: FilterOptions = {}): Promise<PaginatedResponse<Activity>> {
    const response = await apiClient.get<PaginatedResponse<Activity>>('/activities', filters)
    return response.data
  },

  // Get activity by ID
  async getActivity(id: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/activities/${id}`)
    return response.data
  },

  // Create new activity
  async createActivity(data: ActivityFormData): Promise<Activity> {
    const response = await apiClient.post<Activity>('/activities', data)
    return response.data
  },

  // Update activity
  async updateActivity(id: string, data: Partial<ActivityFormData>): Promise<Activity> {
    const response = await apiClient.put<Activity>(`/activities/${id}`, data)
    return response.data
  },

  // Delete activity
  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`)
  },

  // Update activity status
  async updateActivityStatus(id: string, status: Activity['status']): Promise<Activity> {
    const response = await apiClient.patch<Activity>(`/activities/${id}/status`, { status })
    return response.data
  },

  // Get activities by contact
  async getActivitiesByContact(contactId: string): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { contact_id: contactId })
    return response.data
  },

  // Get activities by deal
  async getActivitiesByDeal(dealId: string): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { deal_id: dealId })
    return response.data
  },

  // Get activities by type
  async getActivitiesByType(type: Activity['type']): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { type })
    return response.data
  },

  // Get upcoming activities
  async getUpcomingActivities(days: number = 7): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities/upcoming', { days })
    return response.data
  },

  // Get overdue activities
  async getOverdueActivities(): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities/overdue')
    return response.data
  },

  // Get activities for date range
  async getActivitiesForDateRange(startDate: string, endDate: string): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { 
      start_date: startDate, 
      end_date: endDate 
    })
    return response.data
  },

  // Mark activity as completed
  async markAsCompleted(id: string): Promise<Activity> {
    const response = await apiClient.patch<Activity>(`/activities/${id}/complete`)
    return response.data
  },

  // Search activities
  async searchActivities(query: string): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities/search', { q: query })
    return response.data
  }
}