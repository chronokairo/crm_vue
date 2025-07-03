<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
    
    <!-- Global notifications -->
    <NotificationContainer />
    
    <!-- Global modals -->
    <ModalContainer />
    
    <!-- Global loading overlay -->
    <LoadingOverlay v-if="globalLoading.loading" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'
import ModalContainer from '@/components/ui/ModalContainer.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import { useAuthStore } from '@/stores/auth'
import { globalNotifications, globalModal, globalLoading } from '@/composables/useNotifications'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth on app mount
  authStore.initializeAuth()
})
</script>

<style>
/* Global styles */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

/* Transition utilities */
.transition-base {
  @apply transition-all duration-200 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-300 ease-in-out;
}

/* Animation utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideInFromRight {
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInFromRight 0.3s ease-out;
}

/* Loading spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>