<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p class="mt-1 text-sm text-gray-600">
            Track and manage your deals through the sales process
          </p>
        </div>
        <BaseButton variant="primary">
          Add Deal
        </BaseButton>
      </div>
    </div>

    <!-- Pipeline columns -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="stage in pipelineStages"
        :key="stage.id"
        class="bg-gray-50 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-900">
            {{ stage.name }}
          </h3>
          <span class="text-xs text-gray-500">
            {{ stage.deals.length }}
          </span>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="deal in stage.deals"
            :key="deal.id"
            class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">
                  {{ deal.name }}
                </h4>
                <p class="text-xs text-gray-500 mt-1">
                  {{ deal.company }}
                </p>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon class="h-4 w-4" />
              </button>
            </div>
            
            <div class="mt-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">
                  ${{ deal.value.toLocaleString() }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ deal.probability }}%
                </span>
              </div>
              
              <div class="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div
                  class="bg-primary-600 h-1 rounded-full"
                  :style="{ width: `${deal.probability}%` }"
                />
              </div>
            </div>
            
            <div class="mt-3 flex items-center text-xs text-gray-500">
              <CalendarIcon class="h-3 w-3 mr-1" />
              {{ formatDate(deal.closeDate) }}
            </div>
          </div>
          
          <!-- Empty state for column -->
          <div
            v-if="stage.deals.length === 0"
            class="text-center py-8 text-gray-400"
          >
            <ChartBarIcon class="mx-auto h-8 w-8 mb-2" />
            <p class="text-xs">No deals</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Pipeline Summary</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ totalDeals }}</p>
          <p class="text-sm text-gray-500">Total Deals</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">${{ totalValue.toLocaleString() }}</p>
          <p class="text-sm text-gray-500">Pipeline Value</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">${{ averageValue.toLocaleString() }}</p>
          <p class="text-sm text-gray-500">Average Deal</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ conversionRate }}%</p>
          <p class="text-sm text-gray-500">Win Rate</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  ChartBarIcon,
  CalendarIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

const pipelineStages = ref([
  {
    id: 'prospecting',
    name: 'Prospecting',
    deals: [
      {
        id: '1',
        name: 'Website Redesign',
        company: 'Acme Corp',
        value: 25000,
        probability: 20,
        closeDate: '2024-03-15'
      },
      {
        id: '2',
        name: 'CRM Integration',
        company: 'Tech Solutions',
        value: 15000,
        probability: 15,
        closeDate: '2024-03-20'
      }
    ]
  },
  {
    id: 'qualified',
    name: 'Qualified',
    deals: [
      {
        id: '3',
        name: 'Mobile App',
        company: 'Digital Agency',
        value: 45000,
        probability: 40,
        closeDate: '2024-03-10'
      }
    ]
  },
  {
    id: 'proposal',
    name: 'Proposal',
    deals: [
      {
        id: '4',
        name: 'E-commerce Platform',
        company: 'Retail Co',
        value: 85000,
        probability: 60,
        closeDate: '2024-02-28'
      }
    ]
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    deals: [
      {
        id: '5',
        name: 'Data Analytics',
        company: 'Finance Corp',
        value: 120000,
        probability: 80,
        closeDate: '2024-02-25'
      }
    ]
  },
  {
    id: 'closed-won',
    name: 'Closed Won',
    deals: [
      {
        id: '6',
        name: 'Marketing Automation',
        company: 'Growth Inc',
        value: 35000,
        probability: 100,
        closeDate: '2024-02-15'
      }
    ]
  }
])

const totalDeals = computed(() => {
  return pipelineStages.value.reduce((total, stage) => total + stage.deals.length, 0)
})

const totalValue = computed(() => {
  return pipelineStages.value.reduce((total, stage) => {
    return total + stage.deals.reduce((stageTotal, deal) => stageTotal + deal.value, 0)
  }, 0)
})

const averageValue = computed(() => {
  return totalDeals.value > 0 ? Math.round(totalValue.value / totalDeals.value) : 0
})

const conversionRate = computed(() => {
  const wonDeals = pipelineStages.value.find(stage => stage.id === 'closed-won')?.deals.length || 0
  return totalDeals.value > 0 ? Math.round((wonDeals / totalDeals.value) * 100) : 0
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>