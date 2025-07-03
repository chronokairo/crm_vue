<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        
        <h1 class="ml-2 text-xl font-semibold text-gray-900">
          {{ pageTitle }}
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="hidden md:block">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        
        <!-- Notifications -->
        <button class="p-2 text-gray-500 hover:text-gray-600 relative">
          <BellIcon class="h-6 w-6" />
          <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
        </button>
        
        <!-- User menu -->
        <div class="relative">
          <Menu as="div" class="relative inline-block text-left">
            <MenuButton class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <img
                class="h-8 w-8 rounded-full"
                :src="user?.avatar || '/avatar-placeholder.png'"
                :alt="user?.name"
              />
            </MenuButton>
            
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                </div>
                
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/settings"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      Settings
                    </router-link>
                  </MenuItem>
                  
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="handleLogout"
                      :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const pageTitle = computed(() => route.meta.title || 'Dashboard')

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
