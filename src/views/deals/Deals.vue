<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Deals</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your sales pipeline and track deal progress.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <BaseButton @click="showCreateModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            New Deal
          </BaseButton>
        </div>
      </div>

      <!-- Pipeline view -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Sales Pipeline</h2>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="stage in stages"
              :key="stage.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-900">{{ stage.name }}</h3>
                <span class="text-xs text-gray-500">{{ getDealsInStage(stage.id).length }}</span>
              </div>
              
              <div class="space-y-3">
                <div
                  v-for="deal in getDealsInStage(stage.id)"
                  :key="deal.id"
                  class="bg-white rounded p-3 border border-gray-200 cursor-pointer hover:border-primary-300"
                  @click="viewDeal(deal.id)"
                >
                  <h4 class="text-sm font-medium text-gray-900 mb-1">{{ deal.title }}</h4>
                  <p class="text-xs text-gray-500 mb-2">{{ deal.contact?.firstName }} {{ deal.contact?.lastName }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-green-600">
                      ${{ formatCurrency(deal.value) }}
                    </span>
                    <span class="text-xs text-gray-500">{{ deal.probability }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deals table -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">All Deals</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="deal in deals"
                :key="deal.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ deal.title }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(deal.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ deal.contact?.firstName }} {{ deal.contact?.lastName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ${{ formatCurrency(deal.value) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :style="{ backgroundColor: deal.stage.color + '20', color: deal.stage.color }"
                  >
                    {{ deal.stage.name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm text-gray-900">{{ deal.probability }}%</div>
                    <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        :style="{ width: deal.probability + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click="editDeal(deal)"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </BaseButton>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      @click="deleteDeal(deal.id)"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { formatCurrency, formatDate } from '@/utils/helpers'
import type { Deal, DealStage } from '@/types'

const router = useRouter()

const showCreateModal = ref(false)

// Mock data - replace with actual API calls
const deals = ref<Deal[]>([
  {
    id: '1',
    title: 'Enterprise Software License',
    value: 50000,
    currency: 'USD',
    stage: { id: '1', name: 'Qualified', position: 1, color: '#3B82F6' },
    probability: 75,
    contactId: '1',
    contact: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'active', createdAt: '', updatedAt: '' },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    value: 125000,
    currency: 'USD',
    stage: { id: '2', name: 'Proposal', position: 2, color: '#10B981' },
    probability: 60,
    contactId: '2',
    contact: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', status: 'active', createdAt: '', updatedAt: '' },
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  }
])

const stages = ref<DealStage[]>([
  { id: '1', name: 'Qualified', position: 1, color: '#3B82F6' },
  { id: '2', name: 'Proposal', position: 2, color: '#10B981' },
  { id: '3', name: 'Negotiation', position: 3, color: '#F59E0B' },
  { id: '4', name: 'Closed Won', position: 4, color: '#22C55E' }
])

const getDealsInStage = (stageId: string) => {
  return deals.value.filter(deal => deal.stage.id === stageId)
}

const viewDeal = (id: string) => {
  router.push(`/deals/${id}`)
}

const editDeal = (deal: Deal) => {
  // TODO: Implement edit functionality
  console.log('Edit deal:', deal)
}

const deleteDeal = (id: string) => {
  if (confirm('Are you sure you want to delete this deal?')) {
    deals.value = deals.value.filter(deal => deal.id !== id)
  }
}

onMounted(() => {
  // Load deals data
})
</script>
