<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  page: number
  perPage: number
  total: number
  totalPages: number
  loading: boolean
}>()

const emit = defineEmits<{
  'go-to-page': [page: number]
}>()

const goToPageInput = ref(String(props.page))

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function clampPage(nextPage: number): number {
  return Math.min(Math.max(nextPage, 1), props.totalPages)
}

function requestPage(nextPage: number): void {
  if (props.loading) {
    return
  }

  const normalizedPage = clampPage(nextPage)
  if (normalizedPage === props.page) {
    return
  }

  emit('go-to-page', normalizedPage)
}

function prevPage(): void {
  requestPage(props.page - 1)
}

function nextPage(): void {
  requestPage(props.page + 1)
}

function firstPage(): void {
  requestPage(1)
}

function lastPage(): void {
  requestPage(props.totalPages)
}

function submitGoToPage(): void {
  const parsed = Number.parseInt(goToPageInput.value, 10)
  if (!Number.isFinite(parsed)) {
    goToPageInput.value = String(props.page)
    return
  }

  requestPage(parsed)
}

const pageStart = computed(() => {
  if (props.total === 0) {
    return 0
  }

  return (props.page - 1) * props.perPage + 1
})

const pageEnd = computed(() => {
  if (props.total === 0) {
    return 0
  }

  return Math.min(props.page * props.perPage, props.total)
})

const pageTokens = computed<Array<number | string>>(() => {
  const current = props.page
  const totalPagesValue = props.totalPages

  if (totalPagesValue <= 7) {
    return Array.from({ length: totalPagesValue }, (_, index) => index + 1)
  }

  const tokens: Array<number | string> = [1]
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(totalPagesValue - 1, current + 1)

  if (windowStart > 2) {
    tokens.push('ellipsis-left')
  }

  for (let currentPage = windowStart; currentPage <= windowEnd; currentPage += 1) {
    tokens.push(currentPage)
  }

  if (windowEnd < totalPagesValue - 1) {
    tokens.push('ellipsis-right')
  }

  tokens.push(totalPagesValue)
  return tokens
})

watch(
  () => props.page,
  (nextPage) => {
    goToPageInput.value = String(nextPage)
  },
)
</script>

<template>
  <div class="flex flex-wrap gap-3 justify-between items-center px-2">
    <span class="text-xs text-zinc-500">
      Showing {{ formatCount(pageStart) }}-{{ formatCount(pageEnd) }} of {{ formatCount(total) }} ·
      Page {{ formatCount(page) }} of {{ formatCount(totalPages) }} · {{ formatCount(perPage) }} per
      page
    </span>
    <div class="flex flex-wrap items-center justify-end gap-2">
      <button
        class="text-xs font-semibold px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="loading || page <= 1"
        @click="firstPage()"
      >
        First
      </button>
      <button
        class="text-xs font-semibold px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="loading || page <= 1"
        @click="prevPage()"
      >
        Previous
      </button>
      <template v-for="(token, index) in pageTokens" :key="`${token}-${index}`">
        <span v-if="typeof token !== 'number'" class="text-xs text-zinc-500 px-1">…</span>
        <button
          v-else
          class="text-xs font-semibold min-w-8 px-2 py-1 rounded border transition-colors"
          :class="
            token === page
              ? 'border-blue-500 bg-blue-500/20 text-blue-200'
              : 'border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500'
          "
          :disabled="loading || token === page"
          @click="requestPage(token)"
        >
          {{ token }}
        </button>
      </template>
      <button
        class="text-xs font-semibold px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="loading || page >= totalPages"
        @click="nextPage()"
      >
        Next
      </button>
      <button
        class="text-xs font-semibold px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="loading || page >= totalPages"
        @click="lastPage()"
      >
        Last
      </button>
      <form class="flex items-center gap-2 ml-1" @submit.prevent="submitGoToPage()">
        <label for="pagination-go-to-page" class="text-xs text-zinc-500">Go to</label>
        <input
          id="pagination-go-to-page"
          v-model="goToPageInput"
          type="text"
          inputmode="numeric"
          class="w-16 px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          class="text-xs font-semibold px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          :disabled="loading"
        >
          Go
        </button>
      </form>
    </div>
  </div>
</template>
