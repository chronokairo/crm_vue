import { apiClient } from './api'
import type { Contact, ContactFormData, PaginatedResponse, FilterOptions } from '@/types'

export const contactsService = {
  // Get all contacts with optional filters
  async getContacts(filters: FilterOptions = {}): Promise<PaginatedResponse<Contact>> {
    const response = await apiClient.get<PaginatedResponse<Contact>>('/contacts', filters)
    return response.data
  },

  // Get contact by ID
  async getContact(id: string): Promise<Contact> {
    const response = await apiClient.get<Contact>(`/contacts/${id}`)
    return response.data
  },

  // Create new contact
  async createContact(data: ContactFormData): Promise<Contact> {
    const response = await apiClient.post<Contact>('/contacts', data)
    return response.data
  },

  // Update contact
  async updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact> {
    const response = await apiClient.put<Contact>(`/contacts/${id}`, data)
    return response.data
  },

  // Delete contact
  async deleteContact(id: string): Promise<void> {
    await apiClient.delete(`/contacts/${id}`)
  },

  // Search contacts
  async searchContacts(query: string): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts/search', { q: query })
    return response.data
  },

  // Get contacts by status
  async getContactsByStatus(status: Contact['status']): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts', { status })
    return response.data
  },

  // Import contacts from CSV
  async importContacts(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post<{ imported: number; failed: number; errors: string[] }>('/contacts/import', formData)
    return response.data
  },

  // Export contacts to CSV
  async exportContacts(filters: FilterOptions = {}): Promise<Blob> {
    // Note: In a real implementation, this would be handled differently for blob responses
    const response = await apiClient.get('/contacts/export', filters) as any
    return response.data as Blob
  }
}