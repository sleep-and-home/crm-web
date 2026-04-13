<script setup lang="ts">
import { computed } from 'vue'
import Badge from './Badge.vue'

type BadgeTone = 'zinc' | 'emerald' | 'blue' | 'red' | 'amber'

const props = defineProps<{
  status: string
}>()

const normalizedStatus = computed(() => props.status.toLowerCase())

const tone = computed<BadgeTone>(() => {
  switch (normalizedStatus.value) {
    case 'delivered':
    case 'paid':
      return 'emerald'
    case 'shipped':
    case 'ready_for_shipment':
    case 'in_production':
      return 'blue'
    case 'cancelled':
    case 'refunded':
      return 'red'
    case 'awaiting_payment':
      return 'amber'
    default:
      return 'zinc'
  }
})

const label = computed(() => props.status.replaceAll('_', ' '))
</script>

<template>
  <Badge :label="label" :tone="tone" />
</template>
