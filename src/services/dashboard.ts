import { apiService } from './api'
import type { DashboardStats, ChartData, ApiResponse } from '@/types'

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return apiService.get<ApiResponse<DashboardStats>>('/dashboard/stats')
      .then(response => response.data)
  }

  async getRevenueChart(period: 'month' | 'quarter' | 'year' = 'month'): Promise<ChartData> {
    return apiService.get<ApiResponse<ChartData>>('/dashboard/revenue-chart', { period })
      .then(response => response.data)
  }

  async getDealsChart(period: 'month' | 'quarter' | 'year' = 'month'): Promise<ChartData> {
    return apiService.get<ApiResponse<ChartData>>('/dashboard/deals-chart', { period })
      .then(response => response.data)
  }

  async getActivitiesChart(period: 'week' | 'month' | 'quarter' = 'week'): Promise<ChartData> {
    return apiService.get<ApiResponse<ChartData>>('/dashboard/activities-chart', { period })
      .then(response => response.data)
  }

  async getTopContacts(limit = 10): Promise<Array<{ contact: any; dealValue: number; dealCount: number }>> {
    return apiService.get<ApiResponse<Array<{ contact: any; dealValue: number; dealCount: number }>>>('/dashboard/top-contacts', { limit })
      .then(response => response.data)
  }

  async getRecentActivities(limit = 10): Promise<any[]> {
    return apiService.get<ApiResponse<any[]>>('/dashboard/recent-activities', { limit })
      .then(response => response.data)
  }
}

export const dashboardService = new DashboardService()
