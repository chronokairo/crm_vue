import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contactsService } from '@/services/contacts'
import type { Contact, ContactFormData, FilterOptions, PaginatedResponse } from '@/types'

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref<Contact[]>([])
  const currentContact = ref<Contact | null>(null)
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
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    perPage: 20
  })

  // Getters
  const totalContacts = computed(() => pagination.value.total)
  const hasContacts = computed(() => contacts.value.length > 0)
  const contactsByStatus = computed(() => {
    return contacts.value.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })
  const filteredContacts = computed(() => {
    let filtered = [...contacts.value]
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.status) {
      filtered = filtered.filter(contact => contact.status === filters.value.status)
    }
    
    return filtered
  })

  // Actions
  async function fetchContacts(newFilters: Partial<FilterOptions> = {}) {
    try {
      isLoading.value = true
      error.value = null
      
      // Update filters
      filters.value = { ...filters.value, ...newFilters }
      
      const response: PaginatedResponse<Contact> = await contactsService.getContacts(filters.value)
      
      contacts.value = response.data
      pagination.value = response.meta
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contacts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchContact(id: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const contact = await contactsService.getContact(id)
      currentContact.value = contact
      
      return contact
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contact'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createContact(data: ContactFormData) {
    try {
      isCreating.value = true
      error.value = null
      
      const contact = await contactsService.createContact(data)
      
      // Add to beginning of list
      contacts.value.unshift(contact)
      pagination.value.total += 1
      
      return contact
    } catch (err: any) {
      error.value = err.message || 'Failed to create contact'
      throw err
    } finally {
      isCreating.value = false
    }
  }

  async function updateContact(id: string, data: Partial<ContactFormData>) {
    try {
      isUpdating.value = true
      error.value = null
      
      const contact = await contactsService.updateContact(id, data)
      
      // Update in list
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts.value[index] = contact
      }
      
      // Update current contact if it's the same
      if (currentContact.value?.id === id) {
        currentContact.value = contact
      }
      
      return contact
    } catch (err: any) {
      error.value = err.message || 'Failed to update contact'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteContact(id: string) {
    try {
      isDeleting.value = true
      error.value = null
      
      await contactsService.deleteContact(id)
      
      // Remove from list
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts.value.splice(index, 1)
        pagination.value.total -= 1
      }
      
      // Clear current contact if it's the same
      if (currentContact.value?.id === id) {
        currentContact.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete contact'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  async function searchContacts(query: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await contactsService.searchContacts(query)
      
      return results
    } catch (err: any) {
      error.value = err.message || 'Failed to search contacts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentContact(contact: Contact | null) {
    currentContact.value = contact
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = {
      search: '',
      status: '',
      sortBy: 'created_at',
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
    contacts,
    currentContact,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    filters,
    
    // Getters
    totalContacts,
    hasContacts,
    contactsByStatus,
    filteredContacts,
    
    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    setCurrentContact,
    clearError,
    resetFilters,
    updateFilters
  }
})