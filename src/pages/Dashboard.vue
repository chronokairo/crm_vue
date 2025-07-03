<template>
  <div class="space-y-6">
    <!-- Welcome header -->
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome back, {{ user?.name }}!
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        Here's what's happening with your business today.
      </p>
    </div>

    <!-- Metrics cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Contacts
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  1,234
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Active Deals
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  89
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Revenue This Month
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  $124,567
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Activities Today
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  12
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activities -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Recent Activities
        </h3>
        <div class="mt-6 flow-root">
          <div class="text-center py-8">
            <p class="text-gray-500">No recent activities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import {
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const { user } = useAuth()
</script>