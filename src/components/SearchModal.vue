<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Badge from './Badge.vue'
import searchIndexMock from '../mocks/search-index.json'

type SearchEntry = {
  type: 'order' | 'product' | 'brand' | 'category'
  title: string
  subtitle: string
  route: string
  keywords: string[]
}

type SearchSectionKey = 'orders' | 'products' | 'brands' | 'categories'

type SearchIndex = {
  recent: SearchEntry[]
  orders: SearchEntry[]
  products: SearchEntry[]
  brands: SearchEntry[]
  categories: SearchEntry[]
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const searchIndex = searchIndexMock as SearchIndex

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')

const sectionDefs: Array<{ key: SearchSectionKey; label: string }> = [
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'brands', label: 'Brands' },
  { key: 'categories', label: 'Categories' },
]

const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const hasQuery = computed(() => normalizedQuery.value.length > 0)

function matchesQuery(entry: SearchEntry): boolean {
  const q = normalizedQuery.value
  if (!q) {
    return true
  }

  return [entry.title, entry.subtitle, ...entry.keywords].join(' ').toLowerCase().includes(q)
}

const groupedResults = computed(() => {
  return sectionDefs
    .map((section) => ({
      key: section.key,
      label: section.label,
      items: searchIndex[section.key].filter(matchesQuery).slice(0, 5),
    }))
    .filter((section) => section.items.length > 0)
})

const recentItems = computed(() => searchIndex.recent.slice(0, 6))
const hasAnyResults = computed(() => groupedResults.value.length > 0)

const firstResult = computed(() => {
  if (!hasQuery.value) {
    return recentItems.value[0] ?? null
  }

  return groupedResults.value[0]?.items[0] ?? null
})

function close(): void {
  emit('close')
}

function openResult(entry: SearchEntry): void {
  void router.push(entry.route)
  close()
}

function submitSearch(): void {
  const target = firstResult.value
  if (!target) {
    return
  }

  openResult(target)
}

function entryTone(entry: SearchEntry): 'zinc' | 'emerald' | 'blue' | 'red' | 'amber' {
  switch (entry.type) {
    case 'order':
      return 'blue'
    case 'product':
      return 'emerald'
    case 'brand':
      return 'amber'
    case 'category':
      return 'zinc'
    default:
      return 'zinc'
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      return
    }

    query.value = ''
    void nextTick(() => {
      inputRef.value?.focus()
    })
  },
)
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-[1px]" @click="close">
    <div class="mx-auto mt-20 w-full max-w-3xl px-4" @click.stop>
      <div class="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
        <form class="border-b border-zinc-800 p-4" @submit.prevent="submitSearch">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search orders, products, brands, categories..."
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-24 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500"
              >Esc</span
            >
          </div>
        </form>

        <div class="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          <section v-if="!hasQuery && recentItems.length > 0" class="mb-5">
            <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Recent
            </h3>
            <div class="space-y-1">
              <button
                v-for="item in recentItems"
                :key="`recent-${item.type}-${item.title}`"
                class="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-left hover:border-zinc-700"
                @click="openResult(item)"
              >
                <div>
                  <div class="text-sm font-medium text-zinc-100">{{ item.title }}</div>
                  <div class="text-xs text-zinc-500">{{ item.subtitle }}</div>
                </div>
                <Badge :label="item.type" :tone="entryTone(item)" />
              </button>
            </div>
          </section>

          <template v-if="hasQuery && hasAnyResults">
            <section v-for="section in groupedResults" :key="section.key" class="mb-5 last:mb-0">
              <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {{ section.label }}
                <span class="text-zinc-600">({{ section.items.length }})</span>
              </h3>
              <div class="space-y-1">
                <button
                  v-for="item in section.items"
                  :key="`${section.key}-${item.title}`"
                  class="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-left hover:border-zinc-700"
                  @click="openResult(item)"
                >
                  <div>
                    <div class="text-sm font-medium text-zinc-100">{{ item.title }}</div>
                    <div class="text-xs text-zinc-500">{{ item.subtitle }}</div>
                  </div>
                  <Badge :label="item.type" :tone="entryTone(item)" />
                </button>
              </div>
            </section>
          </template>

          <div
            v-else-if="hasQuery"
            class="rounded-md border border-zinc-800 bg-zinc-950/40 px-4 py-6 text-center text-sm text-zinc-500"
          >
            No matches found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
