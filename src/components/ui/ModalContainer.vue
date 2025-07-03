<template>
  <Teleport to="body">
    <div
      v-if="globalModal.modals.length > 0"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <div
        v-for="(modalItem, index) in globalModal.modals"
        :key="modalItem.id"
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        :style="{ zIndex: 50 + index }"
      >
        <!-- Background overlay -->
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="modalItem.visible"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="handleBackdropClick(modalItem)"
          />
        </Transition>

        <!-- Modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="modalItem.visible"
            :class="[
              'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle',
              getSizeClass(modalItem.size)
            ]"
          >
            <!-- Header -->
            <div v-if="modalItem.title || modalItem.closable" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
              <h3 v-if="modalItem.title" class="text-lg leading-6 font-medium text-gray-900">
                {{ modalItem.title }}
              </h3>
              <button
                v-if="modalItem.closable"
                @click="globalModal.closeModal(modalItem.id)"
                class="bg-gray-50 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Content -->
            <div class="bg-white">
              <component
                :is="modalItem.component"
                v-bind="modalItem.props"
                @close="globalModal.closeModal(modalItem.id)"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { globalModal } from '@/composables/useNotifications'

function getSizeClass(size: string) {
  switch (size) {
    case 'sm': return 'sm:max-w-sm w-full'
    case 'md': return 'sm:max-w-lg w-full'
    case 'lg': return 'sm:max-w-2xl w-full'
    case 'xl': return 'sm:max-w-4xl w-full'
    default: return 'sm:max-w-lg w-full'
  }
}

function handleBackdropClick(modalItem: any) {
  if (modalItem.closable) {
    globalModal.closeModal(modalItem.id)
  }
}
</script>