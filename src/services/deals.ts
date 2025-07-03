import { apiService } from './api'
import type { 
  Deal, 
  DealStage, 
  DealFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

export class DealService {
  async getDeals(filters?: DealFilters, page = 1, limit = 10): Promise<PaginatedResponse<Deal>> {
    const params = { ...filters, page, limit }
    return apiService.get<ApiResponse<PaginatedResponse<Deal>>>('/deals', params)
      .then(response => response.data)
  }

  async getDeal(id: string): Promise<Deal> {
    return apiService.get<ApiResponse<Deal>>(`/deals/${id}`)
      .then(response => response.data)
  }

  async createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    return apiService.post<ApiResponse<Deal>>('/deals', data)
      .then(response => response.data)
  }

  async updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
    return apiService.put<ApiResponse<Deal>>(`/deals/${id}`, data)
      .then(response => response.data)
  }

  async deleteDeal(id: string): Promise<void> {
    return apiService.delete(`/deals/${id}`)
  }

  async updateDealStage(id: string, stageId: string): Promise<Deal> {
    return apiService.patch<ApiResponse<Deal>>(`/deals/${id}/stage`, { stageId })
      .then(response => response.data)
  }

  async getStages(): Promise<DealStage[]> {
    return apiService.get<ApiResponse<DealStage[]>>('/deals/stages')
      .then(response => response.data)
  }

  async createStage(data: Omit<DealStage, 'id'>): Promise<DealStage> {
    return apiService.post<ApiResponse<DealStage>>('/deals/stages', data)
      .then(response => response.data)
  }

  async updateStage(id: string, data: Partial<DealStage>): Promise<DealStage> {
    return apiService.put<ApiResponse<DealStage>>(`/deals/stages/${id}`, data)
      .then(response => response.data)
  }

  async deleteStage(id: string): Promise<void> {
    return apiService.delete(`/deals/stages/${id}`)
  }

  async reorderStages(stages: { id: string; position: number }[]): Promise<DealStage[]> {
    return apiService.put<ApiResponse<DealStage[]>>('/deals/stages/reorder', { stages })
      .then(response => response.data)
  }
}

export const dealService = new DealService()
