<template>
  <BaseModal
    :title="isEdit ? 'Edit Contact' : 'New Contact'"
    :subtitle="isEdit ? 'Update contact information' : 'Add a new contact to your CRM'"
    :icon="UserIcon"
    size="lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Personal Information -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">Personal Information</h4>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="form.firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            :error="errors.firstName"
          />
          
          <BaseInput
            v-model="form.lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
            :error="errors.lastName"
          />
          
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="Enter email address"
            required
            :error="errors.email"
          />
          
          <BaseInput
            v-model="form.phone"
            type="tel"
            label="Phone"
            placeholder="Enter phone number"
            :error="errors.phone"
          />
        </div>
      </div>

      <!-- Company Information -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">Company Information</h4>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>
      </div>

      <!-- Additional Information -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">Additional Information</h4>
        <div class="space-y-4">
          <BaseSelect
            v-model="form.status"
            label="Status"
            :options="statusOptions"
            required
            :error="errors.status"
          />
          
          <div>
            <label class="label">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="input"
              placeholder="Add any additional notes about this contact..."
            ></textarea>
          </div>
          
          <!-- Tags -->
          <div>
            <label class="label">Tags</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-600"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
            <div class="flex">
              <input
                v-model="newTag"
                type="text"
                class="input rounded-r-none"
                placeholder="Add a tag..."
                @keyup.enter="addTag"
              />
              <BaseButton
                type="button"
                variant="secondary"
                class="rounded-l-none border-l-0"
                @click="addTag"
              >
                Add
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton
        type="button"
        variant="secondary"
        @click="$emit('close')"
      >
        Cancel
      </BaseButton>
      <BaseButton
        type="button"
        :loading="isLoading"
        :disabled="!isFormValid"
        @click="handleSubmit"
        class="ml-3"
      >
        {{ isEdit ? 'Update Contact' : 'Create Contact' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { UserIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useContactsStore } from '@/stores/contacts'
import { useNotifications } from '@/composables/useNotifications'
import { isValidEmail, isValidPhone } from '@/utils/helpers'
import type { Contact } from '@/types'

interface Props {
  contact?: Contact | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  close: []
  success: []
}>()

const contactsStore = useContactsStore()
const { error } = useNotifications()

const isLoading = ref(false)
const newTag = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  status: 'lead',
  notes: '',
  tags: [] as string[],
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  status: '',
})

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const isFormValid = computed(() => {
  return form.firstName.trim() !== '' &&
         form.lastName.trim() !== '' &&
         form.email.trim() !== '' &&
         form.status !== ''
})

// Initialize form with contact data if editing
watch(() => props.contact, (contact) => {
  if (contact && props.isEdit) {
    Object.assign(form, {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      status: contact.status,
      notes: contact.notes || '',
      tags: contact.tags || [],
    })
  }
}, { immediate: true })

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (form.phone && !isValidPhone(form.phone)) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  return isValid
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true

    if (props.isEdit && props.contact) {
      await contactsStore.updateContact(props.contact.id, form)
    } else {
      await contactsStore.createContact(form)
    }

    emit('success')
  } catch (err: any) {
    error('Error saving contact', err.message)
  } finally {
    isLoading.value = false
  }
}
</script>
