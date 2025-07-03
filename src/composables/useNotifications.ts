import { ref, reactive } from 'vue'

export interface NotificationOptions {
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
}

export interface Notification extends NotificationOptions {
  id: string
  createdAt: Date
}

const notifications = ref<Notification[]>([])

export function useNotifications() {
  const show = (options: NotificationOptions): string => {
    const id = Math.random().toString(36).substring(2)
    const notification: Notification = {
      id,
      type: 'info',
      duration: 5000,
      persistent: false,
      createdAt: new Date(),
      ...options,
    }

    notifications.value.push(notification)

    // Auto remove notification if not persistent
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        remove(id)
      }, notification.duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value.splice(0)
  }

  const success = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return show({ title, message, type: 'success', ...options })
  }

  const error = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return show({ title, message, type: 'error', persistent: true, ...options })
  }

  const warning = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return show({ title, message, type: 'warning', ...options })
  }

  const info = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return show({ title, message, type: 'info', ...options })
  }

  return {
    notifications: notifications.value,
    show,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  }
}
