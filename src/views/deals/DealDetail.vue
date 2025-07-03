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
            <h1 class="text-2xl font-bold text-gray-900">Deal Details</h1>
            <p class="text-sm text-gray-500">{{ deal?.title }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <BaseButton variant="secondary">
            Edit Deal
          </BaseButton>
          <BaseButton variant="danger">
            Delete Deal
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Deal info -->
          <div class="card p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Deal Information</h2>
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Value</dt>
                <dd class="mt-1 text-sm text-gray-900">${{ deal?.value.toLocaleString() }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Probability</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ deal?.probability }}%</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Stage</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ deal?.stage.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Expected Close</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ deal?.expectedCloseDate || 'Not set' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact info -->
          <div class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Contact</h3>
            <div class="flex items-center space-x-3">
              <img
                :src="deal?.contact?.avatar || '/avatar-placeholder.png'"
                :alt="deal?.contact?.firstName"
                class="h-10 w-10 rounded-full"
              />
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ deal?.contact?.firstName }} {{ deal?.contact?.lastName }}
                </p>
                <p class="text-sm text-gray-500">{{ deal?.contact?.email }}</p>
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
import type { Deal } from '@/types'

const route = useRoute()
const deal = ref<Deal | null>(null)

onMounted(() => {
  // Mock data - replace with actual API call
  deal.value = {
    id: route.params.id as string,
    title: 'Enterprise Software License',
    value: 50000,
    currency: 'USD',
    stage: { id: '1', name: 'Qualified', position: 1, color: '#3B82F6' },
    probability: 75,
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
    expectedCloseDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
})
</script>
