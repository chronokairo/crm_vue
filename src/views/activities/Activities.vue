<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Activities</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your tasks, meetings, and calls.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <BaseButton @click="showCreateModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            New Activity
          </BaseButton>
        </div>
      </div>

      <!-- Activities list -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="activity in activities"
                :key="activity.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
                  <div class="text-sm text-gray-500">{{ activity.description || 'No description' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <component
                      :is="getActivityIcon(activity.type.name)"
                      class="h-5 w-5 text-gray-400 mr-2"
                    />
                    <span class="text-sm text-gray-900">{{ activity.type.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ activity.contact?.firstName }} {{ activity.contact?.lastName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(activity.startDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="activity.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click="editActivity(activity)"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </BaseButton>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click="deleteActivity(activity.id)"
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
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatDate } from '@/utils/helpers'
import type { Activity } from '@/types'

const showCreateModal = ref(false)

// Mock data - replace with actual API calls
const activities = ref<Activity[]>([
  {
    id: '1',
    title: 'Sales Call with John Doe',
    description: 'Discuss enterprise license requirements',
    type: { id: '1', name: 'Call', icon: 'phone', color: '#3B82F6' },
    status: 'completed',
    priority: 'high',
    startDate: '2024-01-15T10:00:00Z',
    contactId: '1',
    contact: { 
      id: '1', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com', 
      status: 'active', 
      createdAt: '', 
      updatedAt: '' 
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    title: 'Product Demo Meeting',
    description: 'Showcase platform features',
    type: { id: '2', name: 'Meeting', icon: 'video', color: '#10B981' },
    status: 'scheduled',
    priority: 'medium',
    startDate: '2024-01-16T14:00:00Z',
    contactId: '2',
    contact: { 
      id: '2', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane@example.com', 
      status: 'active', 
      createdAt: '', 
      updatedAt: '' 
    },
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-14T15:00:00Z'
  }
])

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'call':
      return PhoneIcon
    case 'meeting':
      return VideoCameraIcon
    case 'email':
      return EnvelopeIcon
    default:
      return CalendarDaysIcon
  }
}

const editActivity = (activity: Activity) => {
  // TODO: Implement edit functionality
  console.log('Edit activity:', activity)
}

const deleteActivity = (id: string) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    activities.value = activities.value.filter(activity => activity.id !== id)
  }
}

onMounted(() => {
  // Load activities data
})
</script>
