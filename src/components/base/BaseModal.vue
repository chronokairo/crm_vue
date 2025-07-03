<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="handleBackdropClick"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="handleBackdropClick"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        :class="sizeClasses"
      >
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div
                v-if="icon"
                :class="[
                  'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                  iconBgClass
                ]"
              >
                <component :is="icon" :class="['h-6 w-6', iconClass]" />
              </div>
              <div class="ml-4 text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
                  {{ subtitle }}
                </p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-4 pb-4 sm:px-6">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  subtitle?: string
  icon?: any
  iconClass?: string
  iconBgClass?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  iconClass: 'text-gray-600',
  iconBgClass: 'bg-gray-100'
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = computed(() => true)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  }
  return sizes[props.size]
})

const handleBackdropClick = () => {
  if (props.closable) {
    emit('close')
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = 'unset'
})
</script>
