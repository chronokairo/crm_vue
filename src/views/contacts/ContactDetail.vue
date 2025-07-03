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
            <h1 class="text-2xl font-bold text-gray-900">Contact Details</h1>
            <p class="text-sm text-gray-500">{{ contact?.firstName }} {{ contact?.lastName }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <BaseButton variant="secondary">
            Edit Contact
          </BaseButton>
          <BaseButton variant="danger">
            Delete Contact
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact info -->
          <div class="card p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ contact?.firstName }} {{ contact?.lastName }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ contact?.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ contact?.phone || 'Not provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Company</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ contact?.company || 'Not provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Position</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ contact?.position || 'Not provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <StatusBadge :status="contact?.status || 'inactive'" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact avatar -->
          <div class="card p-6 text-center">
            <img
              :src="contact?.avatar || '/avatar-placeholder.png'"
              :alt="contact?.firstName"
              class="mx-auto h-24 w-24 rounded-full"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              {{ contact?.firstName }} {{ contact?.lastName }}
            </h3>
            <p class="text-sm text-gray-500">{{ contact?.position }}</p>
            <p class="text-sm text-gray-500">{{ contact?.company }}</p>
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
import type { Contact } from '@/types'

const route = useRoute()
const contact = ref<Contact | null>(null)

onMounted(() => {
  // Mock data - replace with actual API call
  contact.value = {
    id: route.params.id as string,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    position: 'Senior Developer',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
})
</script>
