<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
        <p class="text-gray-600">Manage your deals and track progress</p>
      </div>
      <BaseButton @click="openCreateModal">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Deal
      </BaseButton>
    </div>

    <!-- Pipeline Kanban Board -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="bg-gray-50 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900">{{ stage.name }}</h3>
            <span class="text-sm text-gray-500">{{ getDealsInStage(stage.id).length }}</span>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="deal in getDealsInStage(stage.id)"
              :key="deal.id"
              class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              @click="editDeal(deal)"
            >
              <h4 class="font-medium text-gray-900 mb-2">{{ deal.title }}</h4>
              <p class="text-sm text-gray-600 mb-2">{{ deal.contact?.name }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold text-green-600">
                  ${{ formatCurrency(deal.value) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ deal.probability }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      :is-open="showModal"
      :title="editingDeal ? 'Edit Deal' : 'Create Deal'"
      @close="closeModal"
    >
      <form @submit.prevent="saveDeal" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Deal Title"
          required
          :error="errors.title"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <BaseInput
          v-model="form.value"
          label="Deal Value"
          type="number"
          required
          :error="errors.value"
        />
        <BaseInput
          v-model="form.probability"
          label="Probability (%)"
          type="number"
          min="0"
          max="100"
          required
          :error="errors.probability"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
          <select
            v-model="form.stage"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option v-for="stage in stages" :key="stage.id" :value="stage.id">
              {{ stage.name }}
            </option>
          </select>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton @click="saveDeal" :disabled="saving">
          {{ saving ? 'Saving...' : (editingDeal ? 'Update' : 'Create') }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import type { Deal, DealStage, Contact } from '../types'

const deals = ref<Deal[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingDeal = ref<Deal | null>(null)

const stages = [
  { id: 'prospecting', name: 'Prospecting' },
  { id: 'qualified', name: 'Qualified' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'closed', name: 'Closed' }
]

const form = reactive({
  title: '',
  description: '',
  value: 0,
  probability: 50,
  stage: 'prospecting' as DealStage,
  contactId: ''
})

const errors = reactive({
  title: '',
  value: '',
  probability: ''
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const getDealsInStage = (stageId: string) => {
  return deals.value.filter(deal => deal.stage === stageId)
}

const openCreateModal = () => {
  editingDeal.value = null
  resetForm()
  showModal.value = true
}

const editDeal = (deal: Deal) => {
  editingDeal.value = deal
  form.title = deal.title
  form.description = deal.description || ''
  form.value = deal.value
  form.probability = deal.probability
  form.stage = deal.stage
  form.contactId = deal.contactId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  editingDeal.value = null
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.value = 0
  form.probability = 50
  form.stage = 'prospecting'
  form.contactId = ''
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  let isValid = true
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (form.value <= 0) {
    errors.value = 'Value must be greater than 0'
    isValid = false
  }

  if (form.probability < 0 || form.probability > 100) {
    errors.probability = 'Probability must be between 0 and 100'
    isValid = false
  }

  return isValid
}

const saveDeal = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingDeal.value) {
      const index = deals.value.findIndex(d => d.id === editingDeal.value!.id)
      if (index !== -1) {
        deals.value[index] = {
          ...editingDeal.value,
          ...form,
          updatedAt: new Date()
        }
      }
    } else {
      const newDeal: Deal = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      deals.value.unshift(newDeal)
    }

    closeModal()
  } catch (error) {
    console.error('Error saving deal:', error)
  } finally {
    saving.value = false
  }
}

const loadDeals = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    deals.value = [
      {
        id: '1',
        title: 'Enterprise Software License',
        description: 'Annual license for 100 users',
        value: 25000,
        probability: 80,
        stage: 'negotiation',
        contactId: '1',
        contact: { name: 'John Doe' } as Contact,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'SaaS Platform Integration',
        description: 'Custom integration services',
        value: 15000,
        probability: 60,
        stage: 'proposal',
        contactId: '2',
        contact: { name: 'Jane Smith' } as Contact,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Consulting Services',
        description: 'Business process optimization',
        value: 8000,
        probability: 30,
        stage: 'qualified',
        contactId: '3',
        contact: { name: 'Bob Johnson' } as Contact,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('Error loading deals:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDeals()
})
</script>