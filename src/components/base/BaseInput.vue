<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  id: () => `input-${Math.random().toString(36).substring(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'input': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}>()

defineOptions({
  inheritAttrs: false
})

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const inputClasses = computed(() => [
  'input',
  {
    'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500': props.error,
    'opacity-50 cursor-not-allowed': props.disabled,
  }
])

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
