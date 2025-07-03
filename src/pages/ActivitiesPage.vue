<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Activities</h1>
        <p class="text-gray-600">Track and manage your activities</p>
      </div>
      <BaseButton @click="openCreateModal">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Activity
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search activities..."
        />
      </div>
      <select
        v-model="statusFilter"
        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      >
        <option value="">All Status</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="overdue">Overdue</option>
      </select>
      <select
        v-model="typeFilter"
        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      >
        <option value="">All Types</option>
        <option value="call">Call</option>
        <option value="email">Email</option>
        <option value="meeting">Meeting</option>
        <option value="task">Task</option>
        <option value="demo">Demo</option>
      </select>
    </div>

    <!-- Activities List -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500">Loading activities...</div>
    </div>

    <div v-else-if="filteredActivities.length === 0" class="text-center py-12">
      <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No activities</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
      <div class="mt-6">
        <BaseButton @click="openCreateModal">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Activity
        </BaseButton>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      getActivityIconClasses(activity.type)
                    ]"
                  >
                    <component :is="getActivityIcon(activity.type)" class="h-5 w-5" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-medium text-gray-900">{{ activity.title }}</h3>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{{ formatDate(activity.dueDate) }}</span>
                    <span v-if="activity.contact">{{ activity.contact.name }}</span>
                    <span v-if="activity.deal">{{ activity.deal.title }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusBadgeClasses(activity.status)
                ]"
              >
                {{ activity.status }}
              </span>
              <div class="flex space-x-2">
                <BaseButton
                  v-if="activity.status === 'scheduled'"
                  variant="ghost"
                  size="sm"
                  @click="markComplete(activity)"
                >
                  <CheckIcon class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="ghost" size="sm" @click="editActivity(activity)">
                  <PencilIcon class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="danger" size="sm" @click="deleteActivity(activity)">
                  <TrashIcon class="h-4 w-4" />
                </BaseButton>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      :is-open="showModal"
      :title="editingActivity ? 'Edit Activity' : 'Create Activity'"
      @close="closeModal"
    >
      <form @submit.prevent="saveActivity" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Title"
          required
          :error="errors.title"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            v-model="form.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="demo">Demo</option>
          </select>
        </div>
        <BaseInput
          v-model="form.dueDate"
          label="Due Date"
          type="datetime-local"
          required
          :error="errors.dueDate"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="form.status"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton @click="saveActivity" :disabled="saving">
          {{ saving ? 'Saving...' : (editingActivity ? 'Update' : 'Create') }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  PlusIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import type { Activity, ActivityType, ActivityStatus } from '../types'

const activities = ref<Activity[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingActivity = ref<Activity | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

const form = reactive({
  title: '',
  description: '',
  type: 'call' as ActivityType,
  status: 'scheduled' as ActivityStatus,
  dueDate: '',
  contactId: '',
  dealId: ''
})

const errors = reactive({
  title: '',
  dueDate: ''
})

const filteredActivities = computed(() => {
  let filtered = activities.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      (activity.description && activity.description.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(activity => activity.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(activity => activity.type === typeFilter.value)
  }

  return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
})

const getActivityIcon = (type: ActivityType) => {
  const icons = {
    call: PhoneIcon,
    email: EnvelopeIcon,
    meeting: UserIcon,
    task: ClipboardDocumentIcon,
    demo: UserIcon
  }
  return icons[type]
}

const getActivityIconClasses = (type: ActivityType) => {
  const classes = {
    call: 'bg-blue-100 text-blue-600',
    email: 'bg-green-100 text-green-600',
    meeting: 'bg-purple-100 text-purple-600',
    task: 'bg-yellow-100 text-yellow-600',
    demo: 'bg-indigo-100 text-indigo-600'
  }
  return classes[type]
}

const getStatusBadgeClasses = (status: ActivityStatus) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    overdue: 'bg-orange-100 text-orange-800'
  }
  return classes[status]
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openCreateModal = () => {
  editingActivity.value = null
  resetForm()
  showModal.value = true
}

const editActivity = (activity: Activity) => {
  editingActivity.value = activity
  form.title = activity.title
  form.description = activity.description || ''
  form.type = activity.type
  form.status = activity.status
  form.dueDate = new Date(activity.dueDate).toISOString().slice(0, 16)
  form.contactId = activity.contactId || ''
  form.dealId = activity.dealId || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  editingActivity.value = null
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.type = 'call'
  form.status = 'scheduled'
  form.dueDate = ''
  form.contactId = ''
  form.dealId = ''
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  let isValid = true
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required'
    isValid = false
  }

  return isValid
}

const saveActivity = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingActivity.value) {
      const index = activities.value.findIndex(a => a.id === editingActivity.value!.id)
      if (index !== -1) {
        activities.value[index] = {
          ...editingActivity.value,
          ...form,
          dueDate: new Date(form.dueDate),
          updatedAt: new Date()
        }
      }
    } else {
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...form,
        dueDate: new Date(form.dueDate),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      activities.value.unshift(newActivity)
    }

    closeModal()
  } catch (error) {
    console.error('Error saving activity:', error)
  } finally {
    saving.value = false
  }
}

const markComplete = async (activity: Activity) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = activities.value.findIndex(a => a.id === activity.id)
    if (index !== -1) {
      activities.value[index].status = 'completed'
      activities.value[index].updatedAt = new Date()
    }
  } catch (error) {
    console.error('Error updating activity:', error)
  }
}

const deleteActivity = async (activity: Activity) => {
  if (!confirm('Are you sure you want to delete this activity?')) return

  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = activities.value.findIndex(a => a.id === activity.id)
    if (index !== -1) {
      activities.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Error deleting activity:', error)
  }
}

const loadActivities = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    activities.value = [
      {
        id: '1',
        title: 'Follow-up call with John Doe',
        description: 'Discuss contract details and timeline',
        type: 'call',
        status: 'scheduled',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        contactId: '1',
        contact: { name: 'John Doe' } as any,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Send proposal to TechStart',
        description: 'Send detailed proposal with pricing',
        type: 'email',
        status: 'completed',
        dueDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        contactId: '2',
        contact: { name: 'Jane Smith' } as any,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Product demo meeting',
        description: 'Demonstrate key features and benefits',
        type: 'demo',
        status: 'scheduled',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        contactId: '3',
        contact: { name: 'Bob Johnson' } as any,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('Error loading activities:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadActivities()
})
</script>