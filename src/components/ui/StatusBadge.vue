<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusClasses
    ]"
  >
    <span
      :class="[
        'w-1.5 h-1.5 rounded-full mr-1.5',
        dotClasses
      ]"
    ></span>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'active' | 'inactive' | 'lead' | 'completed' | 'scheduled' | 'cancelled'
}

const props = defineProps<Props>()

const statusConfig = {
  active: {
    label: 'Active',
    classes: 'bg-green-100 text-green-800',
    dotClasses: 'bg-green-500'
  },
  inactive: {
    label: 'Inactive',
    classes: 'bg-gray-100 text-gray-800',
    dotClasses: 'bg-gray-500'
  },
  lead: {
    label: 'Lead',
    classes: 'bg-blue-100 text-blue-800',
    dotClasses: 'bg-blue-500'
  },
  completed: {
    label: 'Completed',
    classes: 'bg-green-100 text-green-800',
    dotClasses: 'bg-green-500'
  },
  scheduled: {
    label: 'Scheduled',
    classes: 'bg-yellow-100 text-yellow-800',
    dotClasses: 'bg-yellow-500'
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-100 text-red-800',
    dotClasses: 'bg-red-500'
  }
}

const statusLabel = computed(() => statusConfig[props.status]?.label || props.status)
const statusClasses = computed(() => statusConfig[props.status]?.classes || statusConfig.inactive.classes)
const dotClasses = computed(() => statusConfig[props.status]?.dotClasses || statusConfig.inactive.dotClasses)
</script>
