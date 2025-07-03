<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <BaseInput
        v-model="form.title"
        label="Activity Title"
        placeholder="Enter activity title"
        required
        :error="errors.title"
      />
      
      <BaseSelect
        v-model="form.type"
        label="Activity Type"
        :options="typeOptions"
        placeholder="Select type"
        required
        :error="errors.type"
      />
      
      <BaseSelect
        v-model="form.contact_id"
        label="Contact"
        :options="contactOptions"
        placeholder="Select contact (optional)"
        :error="errors.contact_id"
      />
      
      <BaseSelect
        v-model="form.deal_id"
        label="Deal"
        :options="dealOptions"
        placeholder="Select deal (optional)"
        :error="errors.deal_id"
      />
      
      <BaseInput
        v-model="form.date"
        type="datetime-local"
        label="Date & Time"
        required
        :error="errors.date"
      />
      
      <BaseSelect
        v-model="form.status"
        label="Status"
        :options="statusOptions"
        placeholder="Select status"
        required
        :error="errors.status"
      />
    </div>
    
    <div class="col-span-2">
      <BaseTextarea
        v-model="form.description"
        label="Description"
        placeholder="Enter activity description..."
        :rows="4"
        :error="errors.description"
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
        {{ activity ? 'Update Activity' : 'Create Activity' }}
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
import type { Activity, ActivityFormData, Contact, Deal } from '@/types'

interface Props {
  activity?: Activity | null
  contacts?: Contact[]
  deals?: Deal[]
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activity: null,
  contacts: () => [],
  deals: () => [],
  isSubmitting: false
})

const emit = defineEmits<{
  submit: [data: ActivityFormData]
  cancel: []
}>()

const form = reactive<ActivityFormData>({
  title: '',
  type: 'call',
  contact_id: '',
  deal_id: '',
  date: '',
  status: 'scheduled',
  description: ''
})

const errors = reactive({
  title: '',
  type: '',
  contact_id: '',
  deal_id: '',
  date: '',
  status: '',
  description: ''
})

const typeOptions = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'demo', label: 'Demo' }
]

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const contactOptions = computed(() => [
  { value: '', label: 'No contact' },
  ...props.contacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} (${contact.company})`
  }))
])

const dealOptions = computed(() => [
  { value: '', label: 'No deal' },
  ...props.deals.map(deal => ({
    value: deal.id,
    label: deal.name
  }))
])

// Watch for activity prop changes to populate form
watch(() => props.activity, (newActivity) => {
  if (newActivity) {
    form.title = newActivity.title
    form.type = newActivity.type
    form.contact_id = newActivity.contact_id || ''
    form.deal_id = newActivity.deal_id || ''
    form.date = newActivity.date
    form.status = newActivity.status
    form.description = newActivity.description
  } else {
    // Reset form
    Object.assign(form, {
      title: '',
      type: 'call',
      contact_id: '',
      deal_id: '',
      date: '',
      status: 'scheduled',
      description: ''
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

  if (!form.title.trim()) {
    errors.title = 'Activity title is required'
    isValid = false
  }

  if (!form.type) {
    errors.type = 'Activity type is required'
    isValid = false
  }

  if (!form.date) {
    errors.date = 'Date and time is required'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return
  
  emit('submit', { ...form })
}
</script>