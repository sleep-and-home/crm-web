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
    case 'active':
      return 'emerald'
    case 'inactive':
      return 'amber'
    case 'draft':
      return 'blue'
    case 'archived':
      return 'red'
    default:
      return 'zinc'
  }
})

const label = computed(() => props.status.replaceAll('_', ' '))
</script>

<template>
  <Badge :label="label" :tone="tone" />
</template>
