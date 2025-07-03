<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="selectId"
      class="label"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <select
      :id="selectId"
      :disabled="disabled"
      :required="required"
      :class="[
        'input transition-base',
        {
          'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      :value="modelValue"
      @change="handleChange"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    
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
import { ref } from 'vue'

interface Option {
  value: string | number
  label: string
  [key: string]: any
}

interface Props {
  modelValue?: string | number
  options: (Option | string | number)[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  valueKey?: string
  labelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  valueKey: 'value',
  labelKey: 'label'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = ref(`select-${Math.random().toString(36).substr(2, 9)}`)

function getOptionValue(option: Option | string | number): string | number {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.valueKey]
}

function getOptionLabel(option: Option | string | number): string {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }
  return option[props.labelKey]
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>