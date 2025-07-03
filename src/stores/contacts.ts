import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contactService } from '@/services/contacts'
import type { Contact, ContactFilters, PaginatedResponse } from '@/types'

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref<Contact[]>([])
  const selectedContact = ref<Contact | null>(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const filters = ref<ContactFilters>({})

  // Getters
  const contactsCount = computed(() => contacts.value.length)
  const hasContacts = computed(() => contacts.value.length > 0)
  const activeContacts = computed(() => 
    contacts.value.filter(contact => contact.status === 'active')
  )
  const leadContacts = computed(() => 
    contacts.value.filter(contact => contact.status === 'lead')
  )

  // Actions
  async function fetchContacts(page = 1, newFilters?: ContactFilters) {
    try {
      isLoading.value = true
      
      if (newFilters) {
        filters.value = { ...newFilters }
        pagination.value.page = 1
      } else {
        pagination.value.page = page
      }

      const response = await contactService.getContacts(
        filters.value,
        pagination.value.page,
        pagination.value.limit
      )

      if (page === 1) {
        contacts.value = response.data
      } else {
        contacts.value.push(...response.data)
      }

      pagination.value = response.pagination
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchContact(id: string) {
    try {
      isLoading.value = true
      const contact = await contactService.getContact(id)
      selectedContact.value = contact
      return contact
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true
      const newContact = await contactService.createContact(data)
      contacts.value.unshift(newContact)
      pagination.value.total += 1
      return newContact
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateContact(id: string, data: Partial<Contact>) {
    try {
      isLoading.value = true
      const updatedContact = await contactService.updateContact(id, data)
      
      const index = contacts.value.findIndex(contact => contact.id === id)
      if (index !== -1) {
        contacts.value[index] = updatedContact
      }
      
      if (selectedContact.value?.id === id) {
        selectedContact.value = updatedContact
      }
      
      return updatedContact
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function deleteContact(id: string) {
    try {
      isLoading.value = true
      await contactService.deleteContact(id)
      
      contacts.value = contacts.value.filter(contact => contact.id !== id)
      pagination.value.total -= 1
      
      if (selectedContact.value?.id === id) {
        selectedContact.value = null
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function clearSelectedContact() {
    selectedContact.value = null
  }

  function setFilters(newFilters: ContactFilters) {
    filters.value = { ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    // State
    contacts,
    selectedContact,
    isLoading,
    pagination,
    filters,
    
    // Getters
    contactsCount,
    hasContacts,
    activeContacts,
    leadContacts,
    
    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    clearSelectedContact,
    setFilters,
    clearFilters,
  }
})
