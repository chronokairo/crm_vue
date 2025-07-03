import { createPinia } from 'pinia'

export const pinia = createPinia()

// Export stores
export { useAuthStore } from './auth'
export { useContactsStore } from './contacts'
export { useDealsStore } from './deals'
export { useActivitiesStore } from './activities'
