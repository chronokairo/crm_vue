<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage all your customer contacts and leads in one place.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <BaseButton @click="showCreateModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            New Contact
          </BaseButton>
        </div>
      </div>

      <!-- Filters and search -->
      <div class="card p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BaseInput
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
            @input="debouncedSearch"
          >
            <template #prefix>
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
            </template>
          </BaseInput>
          
          <BaseSelect
            v-model="filters.status"
            placeholder="All Statuses"
            :options="statusOptions"
            @change="handleFilterChange"
          />
          
          <BaseSelect
            v-model="filters.assignedTo"
            placeholder="All Assigned"
            :options="userOptions"
            @change="handleFilterChange"
          />
          
          <div class="flex space-x-2">
            <BaseButton variant="secondary" @click="clearFilters">
              Clear Filters
            </BaseButton>
            <BaseButton variant="secondary" @click="exportContacts">
              Export
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Contacts table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="contact in contacts"
                :key="contact.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="viewContact(contact.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="contact.avatar || '/avatar-placeholder.png'"
                      :alt="contact.firstName + ' ' + contact.lastName"
                      class="h-10 w-10 rounded-full"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ contact.firstName }} {{ contact.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ contact.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ contact.company || '-' }}</div>
                  <div class="text-sm text-gray-500">{{ contact.position || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="contact.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ contact.assignedUser?.name || 'Unassigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(contact.updatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click.stop="editContact(contact)"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </BaseButton>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click.stop="deleteContact(contact.id)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
        
        <!-- Empty state -->
        <div v-else-if="contacts.length === 0" class="text-center py-12">
          <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating your first contact.
          </p>
          <div class="mt-6">
            <BaseButton @click="showCreateModal = true">
              <PlusIcon class="h-4 w-4 mr-2" />
              New Contact
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="contacts.length > 0" class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ startItem }} to {{ endItem }} of {{ total }} results
        </div>
        <div class="flex space-x-2">
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="!hasPrev"
            @click="prevPage"
          >
            Previous
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="!hasNext"
            @click="nextPage"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Create/Edit Contact Modal -->
    <ContactModal
      v-if="showCreateModal || showEditModal"
      :contact="selectedContact"
      :is-edit="showEditModal"
      @close="closeModal"
      @success="handleContactSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import LoadingSpinner from '@/components/base/LoadingSpinner.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ContactModal from '@/components/contacts/ContactModal.vue'
import { useContactsStore } from '@/stores/contacts'
import { usePagination } from '@/composables/usePagination'
import { useNotifications } from '@/composables/useNotifications'
import { debounce } from '@/utils/helpers'
import type { Contact } from '@/types'

const router = useRouter()
const contactsStore = useContactsStore()
const { success, error } = useNotifications()

// Component state
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedContact = ref<Contact | null>(null)
const isLoading = ref(false)

const filters = reactive({
  status: '',
  assignedTo: '',
})

// Computed properties
const contacts = computed(() => contactsStore.contacts)
const total = computed(() => contactsStore.pagination.total)

// Pagination
const {
  page,
  hasNext,
  hasPrev,
  startItem,
  endItem,
  nextPage,
  prevPage,
} = usePagination()

// Filter options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
]

const userOptions = [
  { value: 'user1', label: 'John Doe' },
  { value: 'user2', label: 'Jane Smith' },
  { value: 'user3', label: 'Mike Johnson' },
]

// Methods
const loadContacts = async () => {
  try {
    isLoading.value = true
    await contactsStore.fetchContacts(page.value, {
      search: searchQuery.value,
      ...filters,
    })
  } catch (err: any) {
    error('Error loading contacts', err.message)
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = debounce(() => {
  loadContacts()
}, 300)

const handleFilterChange = () => {
  loadContacts()
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.status = ''
  filters.assignedTo = ''
  loadContacts()
}

const viewContact = (id: string) => {
  router.push(`/contacts/${id}`)
}

const editContact = (contact: Contact) => {
  selectedContact.value = contact
  showEditModal.value = true
}

const deleteContact = async (id: string) => {
  if (confirm('Are you sure you want to delete this contact?')) {
    try {
      await contactsStore.deleteContact(id)
      success('Contact deleted', 'The contact has been successfully deleted.')
    } catch (err: any) {
      error('Error deleting contact', err.message)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedContact.value = null
}

const handleContactSaved = () => {
  closeModal()
  loadContacts()
  success(
    showEditModal.value ? 'Contact updated' : 'Contact created',
    'The contact has been successfully saved.'
  )
}

const exportContacts = () => {
  // TODO: Implement export functionality
  success('Export started', 'Your contacts export will be ready shortly.')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  loadContacts()
})
</script>
