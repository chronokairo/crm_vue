<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
          <p class="mt-1 text-sm text-gray-600">
            Manage your customer relationships
          </p>
        </div>
        <BaseButton variant="primary" @click="() => openContactModal()">
          Add Contact
        </BaseButton>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search contacts..."
          type="search"
        />
        <BaseSelect
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="Filter by status"
        />
        <div class="flex justify-end">
          <BaseButton variant="outline" size="sm">
            Export
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Contacts grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="contact in sampleContacts"
        :key="contact.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {{ getInitials(contact.name) }}
                </span>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-sm font-medium text-gray-900">
                {{ contact.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ contact.company }}
              </p>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="flex items-center text-sm text-gray-500">
              <EnvelopeIcon class="flex-shrink-0 mr-1.5 h-4 w-4" />
              {{ contact.email }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mt-1">
              <PhoneIcon class="flex-shrink-0 mr-1.5 h-4 w-4" />
              {{ contact.phone }}
            </div>
          </div>
          
          <div class="mt-4 flex items-center justify-between">
            <span :class="getStatusClass(contact.status)" class="status-badge">
              {{ contact.status }}
            </span>
            <button class="text-gray-400 hover:text-gray-600" @click="openContactModal(contact)">
              <EllipsisVerticalIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="sampleContacts.length === 0" class="bg-white shadow rounded-lg p-6">
      <div class="text-center py-12">
        <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new contact.
        </p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="() => openContactModal()">
            Add Contact
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <BaseModal
      :show="showContactModal"
      :title="selectedContact ? 'Edit Contact' : 'Add Contact'"
      size="lg"
      @close="closeContactModal"
    >
      <ContactForm
        :contact="selectedContact"
        :is-submitting="isSubmitting"
        @submit="handleContactSubmit"
        @cancel="closeContactModal"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import type { Contact, ContactFormData } from '@/types'
import {
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const statusFilter = ref('')
const showContactModal = ref(false)
const selectedContact = ref<Contact | null>(null)
const isSubmitting = ref(false)

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
]

const sampleContacts = ref<Contact[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    position: 'CEO',
    status: 'customer',
    notes: 'Important client',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Tech Solutions',
    position: 'CTO',
    status: 'prospect',
    notes: 'Interested in our services',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Digital Agency',
    position: 'Owner',
    status: 'lead',
    notes: 'New lead from website',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
])

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusClass(status: string) {
  switch (status) {
    case 'customer': return 'status-badge-success'
    case 'prospect': return 'status-badge-warning'
    case 'lead': return 'status-badge-info'
    default: return 'status-badge-info'
  }
}

function openContactModal(contact: Contact | null = null) {
  selectedContact.value = contact
  showContactModal.value = true
}

function closeContactModal() {
  showContactModal.value = false
  selectedContact.value = null
}

async function handleContactSubmit(data: ContactFormData) {
  isSubmitting.value = true
  
  try {
    if (selectedContact.value) {
      // Update existing contact
      const index = sampleContacts.value.findIndex(c => c.id === selectedContact.value!.id)
      if (index !== -1) {
        sampleContacts.value[index] = {
          ...sampleContacts.value[index],
          ...data,
          updated_at: new Date().toISOString()
        } as Contact
      }
    } else {
      // Create new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...data,
        avatar: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      sampleContacts.value.unshift(newContact)
    }
    
    closeContactModal()
  } catch (error) {
    console.error('Error saving contact:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>