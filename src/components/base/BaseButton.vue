<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
    <component v-if="icon && !loading" :is="icon" class="w-4 h-4 mr-2" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  tag?: string
  icon?: any
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  tag: 'button',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  {
    'btn-sm': props.size === 'sm',
    'btn-lg': props.size === 'lg',
    'w-full': props.block,
    'opacity-50 cursor-not-allowed': props.disabled || props.loading,
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

.btn-lg {
  @apply px-6 py-3 text-base;
}

.btn-ghost {
  @apply bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500;
}
</style>
