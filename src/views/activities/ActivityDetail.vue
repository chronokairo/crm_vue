<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <BaseButton
            variant="ghost"
            @click="$router.go(-1)"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Back
          </BaseButton>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Activity Details</h1>
            <p class="text-sm text-gray-500">{{ activity?.title }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <BaseButton variant="secondary">
            Edit Activity
          </BaseButton>
          <BaseButton variant="danger">
            Delete Activity
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Activity info -->
          <div class="card p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Activity Information</h2>
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Title</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ activity?.title }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Type</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ activity?.type.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <StatusBadge :status="activity?.status || 'scheduled'" />
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Priority</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ activity?.priority }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(activity?.startDate) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">End Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ activity?.endDate ? formatDate(activity.endDate) : 'Not set' }}</dd>
              </div>
            </dl>
            
            <div v-if="activity?.description" class="mt-6">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ activity.description }}</dd>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact info -->
          <div v-if="activity?.contact" class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Related Contact</h3>
            <div class="flex items-center space-x-3">
              <img
                :src="activity.contact.avatar || '/avatar-placeholder.png'"
                :alt="activity.contact.firstName"
                class="h-10 w-10 rounded-full"
              />
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ activity.contact.firstName }} {{ activity.contact.lastName }}
                </p>
                <p class="text-sm text-gray-500">{{ activity.contact.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatDate } from '@/utils/helpers'
import type { Activity } from '@/types'

const route = useRoute()
const activity = ref<Activity | null>(null)

onMounted(() => {
  // Mock data - replace with actual API call
  activity.value = {
    id: route.params.id as string,
    title: 'Sales Call with John Doe',
    description: 'Discuss enterprise license requirements and next steps',
    type: { id: '1', name: 'Call', icon: 'phone', color: '#3B82F6' },
    status: 'completed',
    priority: 'high',
    startDate: '2024-01-15T10:00:00Z',
    endDate: '2024-01-15T11:00:00Z',
    contactId: '1',
    contact: { 
      id: '1', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      status: 'active', 
      createdAt: '', 
      updatedAt: '' 
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
})
</script>
