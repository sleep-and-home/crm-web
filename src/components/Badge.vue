<script setup lang="ts">
import { computed } from 'vue'

type BadgeTone = 'zinc' | 'emerald' | 'blue' | 'red' | 'amber'

const props = withDefaults(
  defineProps<{
    label: string
    tone?: BadgeTone
  }>(),
  {
    tone: 'zinc',
  },
)

const toneClass = computed(() => {
  switch (props.tone) {
    case 'emerald':
      return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
    case 'blue':
      return 'text-blue-300 bg-blue-500/10 border-blue-500/30'
    case 'red':
      return 'text-red-300 bg-red-500/10 border-red-500/30'
    case 'amber':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/30'
    default:
      return 'text-zinc-300 bg-zinc-500/10 border-zinc-500/30'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center text-[11px] font-semibold border rounded-md px-2 py-0.5 uppercase"
    :class="toneClass"
  >
    {{ label }}
  </span>
</template>
