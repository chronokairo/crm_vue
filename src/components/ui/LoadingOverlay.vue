<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <div class="text-gray-900 font-medium">Loading...</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// Simple loading overlay component
</script>