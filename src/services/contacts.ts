import { apiService } from './api'
import type { 
  Contact, 
  ContactFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

export class ContactService {
  async getContacts(filters?: ContactFilters, page = 1, limit = 10): Promise<PaginatedResponse<Contact>> {
    const params = { ...filters, page, limit }
    return apiService.get<ApiResponse<PaginatedResponse<Contact>>>('/contacts', params)
      .then(response => response.data)
  }

  async getContact(id: string): Promise<Contact> {
    return apiService.get<ApiResponse<Contact>>(`/contacts/${id}`)
      .then(response => response.data)
  }

  async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    return apiService.post<ApiResponse<Contact>>('/contacts', data)
      .then(response => response.data)
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    return apiService.put<ApiResponse<Contact>>(`/contacts/${id}`, data)
      .then(response => response.data)
  }

  async deleteContact(id: string): Promise<void> {
    return apiService.delete(`/contacts/${id}`)
  }

  async importContacts(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiService.post<ApiResponse<{ imported: number; errors: string[] }>>('/contacts/import', formData)
      .then(response => response.data)
  }

  async exportContacts(filters?: ContactFilters): Promise<Blob> {
    const params = { ...filters, export: true }
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.blob()
  }
}

export const contactService = new ContactService()
