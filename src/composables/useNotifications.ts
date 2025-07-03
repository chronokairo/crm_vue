import { ref, reactive, nextTick, readonly } from 'vue'
import type { NotificationOptions } from '@/types'

interface Notification extends NotificationOptions {
  id: string
  timestamp: Date
  visible: boolean
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export function useNotifications() {
  // Add notification
  function addNotification(options: NotificationOptions): string {
    const id = (++notificationId).toString()
    const notification: Notification = {
      id,
      timestamp: new Date(),
      visible: false,
      duration: 5000,
      ...options
    }

    notifications.value.push(notification)

    // Make visible in next tick for animation
    nextTick(() => {
      const notif = notifications.value.find(n => n.id === id)
      if (notif) {
        notif.visible = true
      }
    })

    // Auto remove after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  // Remove notification
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      const notification = notifications.value[index]
      notification.visible = false
      
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = notifications.value.findIndex(n => n.id === id)
        if (currentIndex > -1) {
          notifications.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  }

  // Clear all notifications
  function clearAll() {
    notifications.value.forEach(notification => {
      notification.visible = false
    })
    
    setTimeout(() => {
      notifications.value.length = 0
    }, 300)
  }

  // Success notification
  function success(title: string, message: string = '', duration?: number) {
    return addNotification({
      type: 'success',
      title,
      message,
      duration
    })
  }

  // Error notification
  function error(title: string, message: string = '', duration?: number) {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 8000 // Errors stay longer by default
    })
  }

  // Warning notification
  function warning(title: string, message: string = '', duration?: number) {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration
    })
  }

  // Info notification
  function info(title: string, message: string = '', duration?: number) {
    return addNotification({
      type: 'info',
      title,
      message,
      duration
    })
  }

  // Handle API errors
  function handleApiError(err: any, fallbackMessage: string = 'An error occurred') {
    const message = err?.message || fallbackMessage
    const details = err?.details ? ` (${err.code})` : ''
    
    return error('Error', message + details)
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    handleApiError
  }
}

// Global notifications instance
export const globalNotifications = useNotifications()

// Modal management
interface Modal {
  id: string
  component: any
  props: Record<string, any>
  title: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  closable: boolean
  visible: boolean
}

const modals = ref<Modal[]>([])
let modalId = 0

export function useModal() {
  // Open modal
  function openModal(options: {
    component: any
    props?: Record<string, any>
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closable?: boolean
  }): string {
    const id = (++modalId).toString()
    const modal: Modal = {
      id,
      visible: false,
      size: 'md',
      closable: true,
      title: '',
      props: {},
      ...options
    }

    modals.value.push(modal)

    // Make visible in next tick for animation
    nextTick(() => {
      const modalRef = modals.value.find(m => m.id === id)
      if (modalRef) {
        modalRef.visible = true
      }
    })

    return id
  }

  // Close modal
  function closeModal(id: string) {
    const index = modals.value.findIndex(m => m.id === id)
    if (index > -1) {
      const modal = modals.value[index]
      modal.visible = false
      
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = modals.value.findIndex(m => m.id === id)
        if (currentIndex > -1) {
          modals.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  }

  // Close all modals
  function closeAllModals() {
    modals.value.forEach(modal => {
      modal.visible = false
    })
    
    setTimeout(() => {
      modals.value.length = 0
    }, 300)
  }

  // Close top modal (ESC key)
  function closeTopModal() {
    if (modals.value.length > 0) {
      const topModal = modals.value[modals.value.length - 1]
      if (topModal.closable) {
        closeModal(topModal.id)
      }
    }
  }

  return {
    modals: readonly(modals),
    openModal,
    closeModal,
    closeAllModals,
    closeTopModal
  }
}

// Global modal instance
export const globalModal = useModal()

// Loading state management
const loadingState = ref(false)
const loadingOperations = reactive(new Set<string>())

export function useLoading() {
  function startLoading(operation?: string) {
    if (operation) {
      loadingOperations.add(operation)
    }
    loadingState.value = true
  }

  function stopLoading(operation?: string) {
    if (operation) {
      loadingOperations.delete(operation)
      if (loadingOperations.size === 0) {
        loadingState.value = false
      }
    } else {
      loadingOperations.clear()
      loadingState.value = false
    }
  }

  function isLoading(operation?: string) {
    if (operation) {
      return loadingOperations.has(operation)
    }
    return loadingState.value
  }

  return {
    loading: readonly(loadingState),
    startLoading,
    stopLoading,
    isLoading
  }
}

// Global loading instance
export const globalLoading = useLoading()