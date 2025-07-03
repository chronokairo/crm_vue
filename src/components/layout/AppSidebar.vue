<template>
  <!-- Mobile sidebar backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 lg:hidden"
    @click="$emit('close')"
  >
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
  </div>
  
  <!-- Sidebar -->
  <div
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      open ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex items-center justify-center h-16 px-4 bg-primary-600">
      <h1 class="text-xl font-bold text-white">CRM System</h1>
    </div>
    
    <nav class="mt-5 px-2">
      <div class="space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
            isActive(item.href)
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'mr-3 h-5 w-5',
              isActive(item.href)
                ? 'text-primary-500'
                : 'text-gray-400 group-hover:text-gray-500'
            ]"
          />
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="mt-8">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div class="mt-2 space-y-1">
          <button
            v-for="action in quickActions"
            :key="action.name"
            @click="action.action"
            class="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <component
              :is="action.icon"
              class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            {{ action.name }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  PlusIcon,
  DocumentPlusIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  open: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const route = useRoute()

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Deals', href: '/deals', icon: BriefcaseIcon },
  { name: 'Activities', href: '/activities', icon: CalendarDaysIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

const quickActions = [
  {
    name: 'New Contact',
    icon: UserPlusIcon,
    action: () => {
      // Handle new contact
    },
  },
  {
    name: 'New Deal',
    icon: PlusIcon,
    action: () => {
      // Handle new deal
    },
  },
  {
    name: 'New Activity',
    icon: DocumentPlusIcon,
    action: () => {
      // Handle new activity
    },
  },
]

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}
</script>
