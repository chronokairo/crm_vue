import { apiClient } from './api'
import type { DashboardMetrics, PipelineData, Activity, Deal } from '@/types'

export const dashboardService = {
  // Get dashboard metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics')
    return response.data
  },

  // Get pipeline data for charts
  async getPipelineData(): Promise<PipelineData[]> {
    const response = await apiClient.get<PipelineData[]>('/dashboard/pipeline')
    return response.data
  },

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/dashboard/recent-activities', { limit })
    return response.data
  },

  // Get recent deals
  async getRecentDeals(limit: number = 10): Promise<Deal[]> {
    const response = await apiClient.get<Deal[]>('/dashboard/recent-deals', { limit })
    return response.data
  },

  // Get revenue trends
  async getRevenueTrends(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    labels: string[]
    values: number[]
  }> {
    const response = await apiClient.get<{
      labels: string[]
      values: number[]
    }>('/dashboard/revenue-trends', { period })
    return response.data
  },

  // Get conversion funnel
  async getConversionFunnel(): Promise<{
    stage: string
    count: number
    conversionRate: number
  }[]> {
    const response = await apiClient.get<{
      stage: string
      count: number
      conversionRate: number
    }[]>('/dashboard/conversion-funnel')
    return response.data
  }
}