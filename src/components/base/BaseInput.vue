<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="inputId"
      class="label"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'input transition-base',
          {
            'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': error,
            'opacity-50 cursor-not-allowed': disabled,
            'bg-gray-50': readonly
          }
        ]"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="$attrs"
      />
      
      <div
        v-if="iconRight"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component :is="iconRight" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </p>
    
    <p
      v-else-if="hint"
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  autocomplete?: string
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>