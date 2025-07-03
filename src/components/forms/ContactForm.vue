<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <BaseInput
        v-model="form.name"
        label="Full Name"
        placeholder="Enter contact name"
        required
        :error="errors.name"
      />
      
      <BaseInput
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="Enter email address"
        required
        :error="errors.email"
      />
      
      <BaseInput
        v-model="form.phone"
        type="tel"
        label="Phone Number"
        placeholder="Enter phone number"
        :error="errors.phone"
      />
      
      <BaseInput
        v-model="form.company"
        label="Company"
        placeholder="Enter company name"
        :error="errors.company"
      />
      
      <BaseInput
        v-model="form.position"
        label="Position"
        placeholder="Enter job title"
        :error="errors.position"
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
        {{ contact ? 'Update Contact' : 'Create Contact' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { Contact, ContactFormData } from '@/types'

interface Props {
  contact?: Contact | null
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  contact: null,
  isSubmitting: false
})

const emit = defineEmits<{
  submit: [data: ContactFormData]
  cancel: []
}>()

const form = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  status: 'lead',
  notes: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  status: '',
  notes: ''
})

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' }
]

// Watch for contact prop changes to populate form
watch(() => props.contact, (newContact) => {
  if (newContact) {
    form.name = newContact.name
    form.email = newContact.email
    form.phone = newContact.phone
    form.company = newContact.company
    form.position = newContact.position
    form.status = newContact.status
    form.notes = newContact.notes
  } else {
    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'lead',
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
    errors.name = 'Name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid'
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