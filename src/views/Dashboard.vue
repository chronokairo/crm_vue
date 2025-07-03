<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">
          Welcome back, {{ authStore.user?.name }}! Here's what's happening with your CRM.
        </p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="card p-5"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="stat.icon"
                :class="['h-8 w-8', stat.iconColor]"
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ stat.value }}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-center text-sm">
              <component
                :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
                :class="[
                  'h-4 w-4 mr-1',
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                ]"
              />
              <span
                :class="[
                  'font-medium',
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ stat.change }}
              </span>
              <span class="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue chart -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div class="h-64">
            <Line
              v-if="revenueChartData"
              :data="revenueChartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          </div>
        </div>

        <!-- Deals pipeline -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Deals Pipeline</h3>
          <div class="h-64">
            <Doughnut
              v-if="pipelineChartData"
              :data="pipelineChartData"
              :options="doughnutOptions"
            />
            <div v-else class="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent activities and top contacts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent activities -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    activity.type === 'call' ? 'bg-blue-100' : 
                    activity.type === 'meeting' ? 'bg-green-100' : 'bg-gray-100'
                  ]"
                >
                  <component
                    :is="getActivityIcon(activity.type)"
                    :class="[
                      'h-4 w-4',
                      activity.type === 'call' ? 'text-blue-600' : 
                      activity.type === 'meeting' ? 'text-green-600' : 'text-gray-600'
                    ]"
                  />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.contact }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <router-link
              to="/activities"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all activities →
            </router-link>
          </div>
        </div>

        <!-- Top contacts -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Contacts</h3>
          <div class="space-y-4">
            <div
              v-for="contact in topContacts"
              :key="contact.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="contact.avatar || '/avatar-placeholder.png'"
                  :alt="contact.name"
                  class="h-8 w-8 rounded-full"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ contact.name }}</p>
                  <p class="text-sm text-gray-500">{{ contact.company }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">${{ formatCurrency(contact.totalValue) }}</p>
                <p class="text-xs text-gray-500">{{ contact.dealCount }} deals</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <router-link
              to="/contacts"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all contacts →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Line,
  Doughnut
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PhoneIcon,
  VideoCameraIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/base/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const authStore = useAuthStore()

const revenueChartData = ref(null)
const pipelineChartData = ref(null)
const recentActivities = ref([])
const topContacts = ref([])

const stats = ref([
  {
    name: 'Total Contacts',
    value: '2,651',
    change: '+12%',
    changeType: 'increase',
    icon: UserGroupIcon,
    iconColor: 'text-blue-600'
  },
  {
    name: 'Active Deals',
    value: '145',
    change: '+8%',
    changeType: 'increase',
    icon: BriefcaseIcon,
    iconColor: 'text-green-600'
  },
  {
    name: 'Revenue',
    value: '$892,450',
    change: '+15%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
    iconColor: 'text-yellow-600'
  },
  {
    name: 'Activities',
    value: '89',
    change: '-3%',
    changeType: 'decrease',
    icon: CalendarDaysIcon,
    iconColor: 'text-purple-600'
  }
])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const getActivityIcon = (type: string) => {
  switch (type) {
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const loadDashboardData = async () => {
  // Mock data - replace with actual API calls
  setTimeout(() => {
    revenueChartData.value = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [65000, 78000, 82000, 91000, 87000, 95000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    }

    pipelineChartData.value = {
      labels: ['Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
      datasets: [
        {
          data: [45, 32, 28, 15],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
        },
      ],
    }

    recentActivities.value = [
      {
        id: '1',
        title: 'Call with Sarah Johnson',
        contact: 'Acme Corp',
        type: 'call',
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Product demo meeting',
        contact: 'TechStart Inc',
        type: 'meeting',
        date: '2024-01-15T14:00:00Z'
      },
      {
        id: '3',
        title: 'Follow-up email sent',
        contact: 'Global Solutions',
        type: 'email',
        date: '2024-01-14T16:45:00Z'
      },
    ]

    topContacts.value = [
      {
        id: '1',
        name: 'Sarah Johnson',
        company: 'Acme Corp',
        avatar: null,
        totalValue: 125000,
        dealCount: 3
      },
      {
        id: '2',
        name: 'Mike Chen',
        company: 'TechStart Inc',
        avatar: null,
        totalValue: 89000,
        dealCount: 2
      },
      {
        id: '3',
        name: 'Emily Davis',
        company: 'Global Solutions',
        avatar: null,
        totalValue: 156000,
        dealCount: 4
      },
    ]
  }, 1000)
}

onMounted(() => {
  loadDashboardData()
})
</script>
