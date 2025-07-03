<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn focus-ring transition-base',
      sizeClass,
      variantClass,
      {
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-wait': loading
      }
    ]"
    v-bind="$attrs"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <component
      v-if="icon && !loading"
      :is="icon"
      :class="iconClass"
    />
    
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: any
  iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  iconPosition: 'left'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'px-2.5 py-1.5 text-xs'
    case 'sm': return 'px-3 py-2 text-sm'
    case 'md': return 'px-4 py-2 text-sm'
    case 'lg': return 'px-4 py-2 text-base'
    case 'xl': return 'px-6 py-3 text-base'
    default: return 'px-4 py-2 text-sm'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'btn-primary'
    case 'secondary':
      return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    case 'outline':
      return 'btn-outline'
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
    default:
      return 'btn-primary'
  }
})

const iconClass = computed(() => {
  const baseClass = props.size === 'xs' || props.size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return props.iconPosition === 'right' ? `${baseClass} ml-2` : `${baseClass} mr-2`
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>