<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <BaseInput
        v-model="form.name"
        label="Deal Name"
        placeholder="Enter deal name"
        required
        :error="errors.name"
      />
      
      <BaseInput
        v-model="form.value"
        type="number"
        label="Deal Value"
        placeholder="Enter deal value"
        required
        :error="errors.value"
      />
      
      <BaseSelect
        v-model="form.contact_id"
        label="Contact"
        :options="contactOptions"
        placeholder="Select contact"
        required
        :error="errors.contact_id"
      />
      
      <BaseSelect
        v-model="form.stage"
        label="Stage"
        :options="stageOptions"
        placeholder="Select stage"
        required
        :error="errors.stage"
      />
      
      <BaseInput
        v-model="form.close_date"
        type="date"
        label="Expected Close Date"
        required
        :error="errors.close_date"
      />
      
      <BaseInput
        v-model="form.probability"
        type="number"
        label="Probability (%)"
        placeholder="Enter probability"
        min="0"
        max="100"
        required
        :error="errors.probability"
      />
    </div>
    
    <div class="col-span-2">
      <BaseTextarea
        v-model="form.notes"
        label="Notes"
        placeholder="Enter any additional notes..."
        :rows="4"
        :error="errors.notes"
      />
    </div>
    
    <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
      <BaseButton
        type="button"
        variant="outline"
        @click="$emit('cancel')"
      >
        Cancel
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        :loading="isSubmitting"
      >
        {{ deal ? 'Update Deal' : 'Create Deal' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { Deal, DealFormData, Contact } from '@/types'

interface Props {
  deal?: Deal | null
  contacts?: Contact[]
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deal: null,
  contacts: () => [],
  isSubmitting: false
})

const emit = defineEmits<{
  submit: [data: DealFormData]
  cancel: []
}>()

const form = reactive<DealFormData>({
  name: '',
  value: 0,
  contact_id: '',
  stage: 'prospecting',
  close_date: '',
  probability: 50,
  notes: ''
})

const errors = reactive({
  name: '',
  value: '',
  contact_id: '',
  stage: '',
  close_date: '',
  probability: '',
  notes: ''
})

const stageOptions = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed-won', label: 'Closed Won' },
  { value: 'closed-lost', label: 'Closed Lost' }
]

const contactOptions = computed(() => [
  { value: '', label: 'Select a contact' },
  ...props.contacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} (${contact.company})`
  }))
])

// Watch for deal prop changes to populate form
watch(() => props.deal, (newDeal) => {
  if (newDeal) {
    form.name = newDeal.name
    form.value = newDeal.value
    form.contact_id = newDeal.contact_id
    form.stage = newDeal.stage
    form.close_date = newDeal.close_date
    form.probability = newDeal.probability
    form.notes = newDeal.notes
  } else {
    // Reset form
    Object.assign(form, {
      name: '',
      value: 0,
      contact_id: '',
      stage: 'prospecting',
      close_date: '',
      probability: 50,
      notes: ''
    })
  }
  
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}, { immediate: true })

function validateForm(): boolean {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Deal name is required'
    isValid = false
  }

  if (!form.value || form.value <= 0) {
    errors.value = 'Deal value must be greater than 0'
    isValid = false
  }

  if (!form.contact_id) {
    errors.contact_id = 'Contact is required'
    isValid = false
  }

  if (!form.stage) {
    errors.stage = 'Stage is required'
    isValid = false
  }

  if (!form.close_date) {
    errors.close_date = 'Close date is required'
    isValid = false
  }

  if (form.probability < 0 || form.probability > 100) {
    errors.probability = 'Probability must be between 0 and 100'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return
  
  emit('submit', { ...form })
}
</script>