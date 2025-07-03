<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UserGroupIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Contacts
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ metrics.totalContacts }}
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
                  Total Deals
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ metrics.totalDeals }}
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
                  Revenue
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  ${{ formatCurrency(metrics.totalRevenue) }}
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
              <CalendarDaysIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Activities
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ metrics.totalActivities }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Pipeline Overview -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Sales Pipeline</h3>
        <div class="space-y-4">
          <div
            v-for="stage in pipelineStages"
            :key="stage.name"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ stage.name }}</p>
              <p class="text-sm text-gray-600">{{ stage.count }} deals</p>
            </div>
            <div class="text-sm font-medium text-gray-900">
              ${{ formatCurrency(stage.value) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-primary-600" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ClipboardDocumentIcon
} from '@heroicons/vue/24/outline'
import type { DashboardMetrics, Activity } from '../types'

const metrics = ref<DashboardMetrics>({
  totalContacts: 0,
  totalDeals: 0,
  totalRevenue: 0,
  totalActivities: 0,
  pipelineValue: 0,
  conversionRate: 0
})

const pipelineStages = ref([
  { name: 'Prospecting', count: 15, value: 45000 },
  { name: 'Qualified', count: 8, value: 32000 },
  { name: 'Proposal', count: 5, value: 25000 },
  { name: 'Negotiation', count: 3, value: 18000 },
  { name: 'Closed', count: 12, value: 65000 }
])

const recentActivities = ref<Activity[]>([])

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getActivityIcon = (type: string) => {
  const icons = {
    call: PhoneIcon,
    email: EnvelopeIcon,
    meeting: UserIcon,
    task: ClipboardDocumentIcon,
    demo: UserIcon
  }
  return icons[type as keyof typeof icons] || ClipboardDocumentIcon
}

const loadDashboardData = async () => {
  // Simulate API calls
  await new Promise(resolve => setTimeout(resolve, 500))
  
  metrics.value = {
    totalContacts: 156,
    totalDeals: 43,
    totalRevenue: 185000,
    totalActivities: 28,
    pipelineValue: 185000,
    conversionRate: 0.32
  }

  recentActivities.value = [
    {
      id: '1',
      title: 'Call with John Doe',
      description: 'Discussed new project requirements',
      type: 'call',
      status: 'completed',
      dueDate: new Date(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Follow-up email to Jane Smith',
      description: 'Sent proposal and pricing information',
      type: 'email',
      status: 'completed',
      dueDate: new Date(),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Demo meeting scheduled',
      description: 'Product demonstration for ABC Corp',
      type: 'meeting',
      status: 'scheduled',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ]
}

onMounted(() => {
  loadDashboardData()
})
</script>