<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    <div class="flex-1 lg:pl-64">
      <AppHeader />
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RouterView />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>