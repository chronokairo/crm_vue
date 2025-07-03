<template>
  <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
    <div class="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div class="flex items-center flex-shrink-0 px-4">
          <h1 class="text-xl font-bold text-gray-900">CRM Vue</h1>
        </div>
        
        <nav class="mt-8 flex-1 px-2 space-y-1">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              $route.name === item.name
                ? 'sidebar-nav-item-active'
                : 'sidebar-nav-item-inactive',
              'sidebar-nav-item'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                $route.name === item.name ? 'text-primary-500' : 'text-gray-400',
                'mr-3 flex-shrink-0 h-6 w-6'
              ]"
            />
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const $route = useRoute()

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Contacts', href: '/contacts', icon: UsersIcon },
  { name: 'Deals', href: '/deals', icon: ChartBarIcon },
  { name: 'Activities', href: '/activities', icon: CalendarIcon },
]
</script>