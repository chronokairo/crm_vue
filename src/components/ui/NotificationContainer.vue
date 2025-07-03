<template>
  <Teleport to="body">
    <div
      v-if="globalNotifications.notifications.length > 0"
      class="fixed top-4 right-4 z-50 space-y-2"
    >
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in globalNotifications.notifications"
          :key="notification.id"
          :class="[
            'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            {
              'opacity-100 translate-x-0': notification.visible,
              'opacity-0 translate-x-full': !notification.visible
            }
          ]"
          class="transition-all duration-300 ease-in-out"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component
                  :is="getIcon(notification.type)"
                  :class="getIconClass(notification.type)"
                  class="h-6 w-6"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="globalNotifications.removeNotification(notification.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { globalNotifications } from '@/composables/useNotifications'

function getIcon(type: string) {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'error': return ExclamationCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
    default: return InformationCircleIcon
  }
}

function getIconClass(type: string) {
  switch (type) {
    case 'success': return 'text-green-400'
    case 'error': return 'text-red-400'
    case 'warning': return 'text-yellow-400'
    case 'info': return 'text-blue-400'
    default: return 'text-blue-400'
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>