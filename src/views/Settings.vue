<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your account and application preferences.
        </p>
      </div>

      <!-- Settings sections -->
      <div class="space-y-6">
        <!-- Profile Settings -->
        <div class="card p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
          <form class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BaseInput
                v-model="profile.name"
                label="Full Name"
                placeholder="Enter your full name"
              />
              
              <BaseInput
                v-model="profile.email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                disabled
              />
            </div>
            
            <div>
              <BaseButton variant="primary">Save Changes</BaseButton>
            </div>
          </form>
        </div>

        <!-- Notification Settings -->
        <div class="card p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p class="text-sm text-gray-500">Receive email updates about your activities</p>
              </div>
              <input
                v-model="notifications.email"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Push Notifications</h3>
                <p class="text-sm text-gray-500">Get push notifications on your device</p>
              </div>
              <input
                v-model="notifications.push"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <!-- Theme Settings -->
        <div class="card p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
          <div class="space-y-4">
            <div>
              <label class="label">Theme</label>
              <BaseSelect
                v-model="appearance.theme"
                :options="themeOptions"
                placeholder="Select theme"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const profile = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com'
})

const notifications = reactive({
  email: true,
  push: false
})

const appearance = reactive({
  theme: 'light'
})

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]
</script>
