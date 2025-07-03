<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
        <p class="text-gray-600">Manage your contacts and leads</p>
      </div>
      <BaseButton @click="openCreateModal">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Contact
      </BaseButton>
    </div>

    <!-- Search and filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search contacts..."
          @input="debouncedSearch"
        />
      </div>
      <select
        v-model="statusFilter"
        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        @change="filterContacts"
      >
        <option value="">All Status</option>
        <option value="lead">Lead</option>
        <option value="prospect">Prospect</option>
        <option value="customer">Customer</option>
      </select>
    </div>

    <!-- Contacts grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500">Loading contacts...</div>
    </div>

    <div v-else-if="filteredContacts.length === 0" class="text-center py-12">
      <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new contact.</p>
      <div class="mt-6">
        <BaseButton @click="openCreateModal">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Contact
        </BaseButton>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="contact in filteredContacts"
        :key="contact.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900">{{ contact.name }}</h3>
            <p class="text-sm text-gray-600">{{ contact.company }}</p>
            <p class="text-sm text-gray-600">{{ contact.position }}</p>
          </div>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusBadgeClasses(contact.status)
            ]"
          >
            {{ contact.status }}
          </span>
        </div>
        
        <div class="mt-4 space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <EnvelopeIcon class="h-4 w-4 mr-2" />
            {{ contact.email }}
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <PhoneIcon class="h-4 w-4 mr-2" />
            {{ contact.phone }}
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <BaseButton variant="ghost" size="sm" @click="editContact(contact)">
            <PencilIcon class="h-4 w-4" />
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="deleteContact(contact)">
            <TrashIcon class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      :is-open="showModal"
      :title="editingContact ? 'Edit Contact' : 'Create Contact'"
      @close="closeModal"
    >
      <form @submit.prevent="saveContact" class="space-y-4">
        <BaseInput
          v-model="form.name"
          label="Full Name"
          required
          :error="errors.name"
        />
        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          required
          :error="errors.email"
        />
        <BaseInput
          v-model="form.phone"
          label="Phone"
          type="tel"
          :error="errors.phone"
        />
        <BaseInput
          v-model="form.company"
          label="Company"
          :error="errors.company"
        />
        <BaseInput
          v-model="form.position"
          label="Position"
          :error="errors.position"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="form.status"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton @click="saveContact" :disabled="saving">
          {{ saving ? 'Saving...' : (editingContact ? 'Update' : 'Create') }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  PlusIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import type { Contact, ContactStatus } from '../types'

const contacts = ref<Contact[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingContact = ref<Contact | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  status: 'lead' as ContactStatus,
  notes: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  position: ''
})

const filteredContacts = computed(() => {
  let filtered = contacts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(contact => contact.status === statusFilter.value)
  }

  return filtered
})

const getStatusBadgeClasses = (status: ContactStatus) => {
  const classes = {
    lead: 'bg-yellow-100 text-yellow-800',
    prospect: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800'
  }
  return classes[status]
}

const debouncedSearch = (() => {
  let timeout: number
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      // Search is reactive through computed
    }, 300)
  }
})()

const filterContacts = () => {
  // Filtering is reactive through computed
}

const openCreateModal = () => {
  editingContact.value = null
  resetForm()
  showModal.value = true
}

const editContact = (contact: Contact) => {
  editingContact.value = contact
  form.name = contact.name
  form.email = contact.email
  form.phone = contact.phone
  form.company = contact.company
  form.position = contact.position
  form.status = contact.status
  form.notes = contact.notes || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  editingContact.value = null
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.company = ''
  form.position = ''
  form.status = 'lead'
  form.notes = ''
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  return isValid
}

const saveContact = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingContact.value) {
      // Update existing contact
      const index = contacts.value.findIndex(c => c.id === editingContact.value!.id)
      if (index !== -1) {
        contacts.value[index] = {
          ...editingContact.value,
          ...form,
          updatedAt: new Date()
        }
      }
    } else {
      // Create new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      contacts.value.unshift(newContact)
    }

    closeModal()
  } catch (error) {
    console.error('Error saving contact:', error)
  } finally {
    saving.value = false
  }
}

const deleteContact = async (contact: Contact) => {
  if (!confirm('Are you sure you want to delete this contact?')) return

  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = contacts.value.findIndex(c => c.id === contact.id)
    if (index !== -1) {
      contacts.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Error deleting contact:', error)
  }
}

const loadContacts = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data
    contacts.value = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corp',
        position: 'CEO',
        status: 'customer',
        notes: 'Very interested in our premium package',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@techstart.com',
        phone: '+1 (555) 987-6543',
        company: 'TechStart Inc',
        position: 'CTO',
        status: 'prospect',
        notes: 'Scheduled for demo next week',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@startup.io',
        phone: '+1 (555) 456-7890',
        company: 'Startup.io',
        position: 'Product Manager',
        status: 'lead',
        notes: 'Found us through LinkedIn',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('Error loading contacts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContacts()
})
</script>