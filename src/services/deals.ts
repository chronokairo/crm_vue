import { apiClient } from './api'
import type { Deal, DealFormData, PaginatedResponse, FilterOptions, PipelineData } from '@/types'

export const dealsService = {
  // Get all deals with optional filters
  async getDeals(filters: FilterOptions = {}): Promise<PaginatedResponse<Deal>> {
    const response = await apiClient.get<PaginatedResponse<Deal>>('/deals', filters)
    return response.data
  },

  // Get deal by ID
  async getDeal(id: string): Promise<Deal> {
    const response = await apiClient.get<Deal>(`/deals/${id}`)
    return response.data
  },

  // Create new deal
  async createDeal(data: DealFormData): Promise<Deal> {
    const response = await apiClient.post<Deal>('/deals', data)
    return response.data
  },

  // Update deal
  async updateDeal(id: string, data: Partial<DealFormData>): Promise<Deal> {
    const response = await apiClient.put<Deal>(`/deals/${id}`, data)
    return response.data
  },

  // Delete deal
  async deleteDeal(id: string): Promise<void> {
    await apiClient.delete(`/deals/${id}`)
  },

  // Update deal stage
  async updateDealStage(id: string, stage: Deal['stage']): Promise<Deal> {
    const response = await apiClient.patch<Deal>(`/deals/${id}/stage`, { stage })
    return response.data
  },

  // Get deals by stage
  async getDealsByStage(stage: Deal['stage']): Promise<Deal[]> {
    const response = await apiClient.get<Deal[]>('/deals', { stage })
    return response.data
  },

  // Get pipeline data
  async getPipelineData(): Promise<PipelineData[]> {
    const response = await apiClient.get<PipelineData[]>('/deals/pipeline')
    return response.data
  },

  // Get deals by contact
  async getDealsByContact(contactId: string): Promise<Deal[]> {
    const response = await apiClient.get<Deal[]>('/deals', { contact_id: contactId })
    return response.data
  },

  // Search deals
  async searchDeals(query: string): Promise<Deal[]> {
    const response = await apiClient.get<Deal[]>('/deals/search', { q: query })
    return response.data
  },

  // Get deals statistics
  async getDealsStats(): Promise<{
    total: number
    totalValue: number
    wonDeals: number
    wonValue: number
    lostDeals: number
    lostValue: number
    averageValue: number
    conversionRate: number
  }> {
    const response = await apiClient.get<{
      total: number
      totalValue: number
      wonDeals: number
      wonValue: number
      lostDeals: number
      lostValue: number
      averageValue: number
      conversionRate: number
    }>('/deals/stats')
    return response.data
  }
}