<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Activities</h1>
          <p class="mt-1 text-sm text-gray-600">
            Manage your tasks, meetings, and follow-ups
          </p>
        </div>
        <BaseButton variant="primary">
          Add Activity
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <BaseSelect
          v-model="typeFilter"
          :options="typeOptions"
          placeholder="Filter by type"
        />
        <BaseSelect
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="Filter by status"
        />
        <BaseInput
          v-model="dateFilter"
          type="date"
          placeholder="Filter by date"
        />
        <div class="flex justify-end">
          <BaseButton variant="outline" size="sm">
            Calendar View
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Activities list -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="divide-y divide-gray-200">
        <div
          v-for="activity in sampleActivities"
          :key="activity.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div :class="getActivityIconClass(activity.type)" class="h-10 w-10 rounded-full flex items-center justify-center">
                  <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ activity.title }}
                  </h3>
                  <span :class="getStatusClass(activity.status)" class="status-badge">
                    {{ activity.status }}
                  </span>
                </div>
                
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    {{ formatDateTime(activity.date) }}
                  </div>
                  <div v-if="activity.contact" class="flex items-center">
                    <UserIcon class="h-4 w-4 mr-1" />
                    {{ activity.contact }}
                  </div>
                  <div v-if="activity.deal" class="flex items-center">
                    <ChartBarIcon class="h-4 w-4 mr-1" />
                    {{ activity.deal }}
                  </div>
                </div>
                
                <p v-if="activity.description" class="mt-2 text-sm text-gray-600">
                  {{ activity.description }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <BaseButton
                v-if="activity.status === 'scheduled'"
                variant="outline"
                size="sm"
                @click="markAsCompleted(activity.id)"
              >
                Mark Complete
              </BaseButton>
              <button class="text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="sampleActivities.length === 0" class="bg-white shadow rounded-lg p-6">
      <div class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No activities</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new activity.
        </p>
        <div class="mt-6">
          <BaseButton variant="primary">
            Add Activity
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import {
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  EnvelopeIcon,
  PresentationChartLineIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const typeFilter = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'demo', label: 'Demo' },
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const sampleActivities = ref([
  {
    id: '1',
    title: 'Follow-up call with John Doe',
    type: 'call',
    status: 'scheduled',
    date: '2024-02-20T14:00:00Z',
    contact: 'John Doe',
    deal: 'Website Redesign',
    description: 'Discuss project requirements and timeline'
  },
  {
    id: '2',
    title: 'Send proposal to Jane Smith',
    type: 'email',
    status: 'completed',
    date: '2024-02-19T10:30:00Z',
    contact: 'Jane Smith',
    deal: 'CRM Integration',
    description: 'Send detailed proposal with pricing options'
  },
  {
    id: '3',
    title: 'Product demo for Digital Agency',
    type: 'demo',
    status: 'scheduled',
    date: '2024-02-21T16:00:00Z',
    contact: 'Bob Johnson',
    deal: 'Mobile App',
    description: 'Demonstrate key features and capabilities'
  },
  {
    id: '4',
    title: 'Update CRM records',
    type: 'task',
    status: 'completed',
    date: '2024-02-18T09:00:00Z',
    contact: null,
    deal: null,
    description: 'Update contact information and deal stages'
  }
])

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return PhoneIcon
    case 'email': return EnvelopeIcon
    case 'meeting': return CalendarIcon
    case 'demo': return PresentationChartLineIcon
    case 'task': return ClipboardDocumentListIcon
    default: return CalendarIcon
  }
}

function getActivityIconClass(type: string) {
  switch (type) {
    case 'call': return 'bg-blue-500'
    case 'email': return 'bg-green-500'
    case 'meeting': return 'bg-purple-500'
    case 'demo': return 'bg-orange-500'
    case 'task': return 'bg-gray-500'
    default: return 'bg-blue-500'
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'completed': return 'status-badge-success'
    case 'scheduled': return 'status-badge-info'
    case 'cancelled': return 'status-badge-danger'
    default: return 'status-badge-info'
  }
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function markAsCompleted(activityId: string) {
  const activity = sampleActivities.value.find(a => a.id === activityId)
  if (activity) {
    activity.status = 'completed'
  }
}
</script>