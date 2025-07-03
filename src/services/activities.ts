import { apiService } from './api'
import type { 
  Activity, 
  ActivityType, 
  ActivityFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

export class ActivityService {
  async getActivities(filters?: ActivityFilters, page = 1, limit = 10): Promise<PaginatedResponse<Activity>> {
    const params = { ...filters, page, limit }
    return apiService.get<ApiResponse<PaginatedResponse<Activity>>>('/activities', params)
      .then(response => response.data)
  }

  async getActivity(id: string): Promise<Activity> {
    return apiService.get<ApiResponse<Activity>>(`/activities/${id}`)
      .then(response => response.data)
  }

  async createActivity(data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    return apiService.post<ApiResponse<Activity>>('/activities', data)
      .then(response => response.data)
  }

  async updateActivity(id: string, data: Partial<Activity>): Promise<Activity> {
    return apiService.put<ApiResponse<Activity>>(`/activities/${id}`, data)
      .then(response => response.data)
  }

  async deleteActivity(id: string): Promise<void> {
    return apiService.delete(`/activities/${id}`)
  }

  async completeActivity(id: string): Promise<Activity> {
    return apiService.patch<ApiResponse<Activity>>(`/activities/${id}/complete`)
      .then(response => response.data)
  }

  async getActivityTypes(): Promise<ActivityType[]> {
    return apiService.get<ApiResponse<ActivityType[]>>('/activities/types')
      .then(response => response.data)
  }

  async getUpcomingActivities(days = 7): Promise<Activity[]> {
    return apiService.get<ApiResponse<Activity[]>>('/activities/upcoming', { days })
      .then(response => response.data)
  }

  async getActivitiesForDate(date: string): Promise<Activity[]> {
    return apiService.get<ApiResponse<Activity[]>>('/activities/date', { date })
      .then(response => response.data)
  }
}

export const activityService = new ActivityService()
