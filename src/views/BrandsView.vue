<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import Badge from '../components/Badge.vue'
import Pagination from '../components/Pagination.vue'

type BrandItem = {
  id: number
  name: string
  slug: string
  is_active: boolean
  updated_at: string
}

type BrandsResponse = {
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  items: BrandItem[]
}

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 100

const route = useRoute()
const router = useRouter()

const page = ref(DEFAULT_PAGE)
const perPage = ref(DEFAULT_PER_PAGE)
const total = ref(0)
const totalPages = ref(1)
const brands = ref<BrandItem[]>([])
const loading = ref(false)
const errorMessage = ref('')
const skipNextQueryWatch = ref(false)

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? ''

function getToken(): string {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_access_token') ||
    ''
  )
}

function parsePositiveInt(
  rawValue: LocationQueryValue | LocationQueryValue[] | undefined,
  fallback: number,
): number {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

function syncStateFromQuery(): void {
  page.value = parsePositiveInt(route.query.page, DEFAULT_PAGE)
  perPage.value = parsePositiveInt(route.query.per_page, DEFAULT_PER_PAGE)
}

function formatUtcDate(raw: string): string {
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    return raw
  }

  return (
    new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(date) + ' UTC'
  )
}

function buildPaginationQuery(
  nextPage: number,
  nextPerPage: number,
): Record<string, string | string[]> {
  return {
    ...route.query,
    page: String(nextPage),
    per_page: String(nextPerPage),
  } as Record<string, string | string[]>
}

function clampPage(nextPage: number): number {
  return Math.min(Math.max(nextPage, 1), totalPages.value)
}

function navigateToPage(nextPage: number): void {
  if (loading.value) {
    return
  }

  const normalizedPage = clampPage(nextPage)
  if (normalizedPage === page.value) {
    return
  }

  skipNextQueryWatch.value = false
  void router.push({
    query: buildPaginationQuery(normalizedPage, perPage.value),
  })
}

async function loadBrands(): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    const token = getToken()
    const endpoint = apiBase ? `${apiBase}/api/v1/brands` : '/api/v1/brands'
    const url = `${endpoint}?page=${page.value}&per_page=${perPage.value}`
    const headers: Record<string, string> = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: set access token in localStorage as access_token')
      }

      let message = `Failed to load brands (${response.status})`
      try {
        const body = (await response.json()) as { error?: string }
        if (body.error) {
          message = body.error
        }
      } catch {
        // Ignore json parse errors for non-json responses
      }

      throw new Error(message)
    }

    const body = (await response.json()) as BrandsResponse
    brands.value = body.items ?? []
    total.value = body.pagination?.total ?? 0
    totalPages.value = Math.max(1, body.pagination?.total_pages ?? 1)
    page.value = body.pagination?.page ?? page.value
    perPage.value = body.pagination?.per_page ?? perPage.value
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load brands'
    brands.value = []
    total.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function brandStatusLabel(isActive: boolean): string {
  return isActive ? 'active' : 'inactive'
}

function brandStatusTone(isActive: boolean): 'emerald' | 'amber' {
  return isActive ? 'emerald' : 'amber'
}

onMounted(() => {
  syncStateFromQuery()

  skipNextQueryWatch.value = true
  void router
    .replace({
      query: buildPaginationQuery(page.value, perPage.value),
    })
    .then(() => {
      void loadBrands()
    })
})

watch(
  () => [route.query.page, route.query.per_page],
  () => {
    if (skipNextQueryWatch.value) {
      skipNextQueryWatch.value = false
      return
    }

    syncStateFromQuery()
    void loadBrands()
  },
)
</script>

<template>
  <div class="flex flex-col space-y-6 animate-in fade-in duration-500">
    <div>
      <div>
        <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Brands</h2>
      </div>
    </div>

    <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
            >
              <th class="py-3 pr-4">ID</th>
              <th class="py-3 pr-4">Name</th>
              <th class="py-3 pr-4">Slug</th>
              <th class="py-3 pr-4">Status</th>
              <th class="py-3">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/70">
            <tr v-if="errorMessage">
              <td colspan="5" class="py-4 text-sm text-red-400">{{ errorMessage }}</td>
            </tr>
            <tr v-else-if="loading">
              <td colspan="5" class="py-4 text-sm text-zinc-500">Loading brands...</td>
            </tr>
            <tr v-else-if="brands.length === 0">
              <td colspan="5" class="py-4 text-sm text-zinc-500">No brands found.</td>
            </tr>
            <tr v-for="brand in brands" :key="brand.id">
              <td class="py-3 pr-4 text-sm text-zinc-200 font-mono">#{{ brand.id }}</td>
              <td class="py-3 pr-4 text-sm text-zinc-100 font-semibold">{{ brand.name }}</td>
              <td class="py-3 pr-4 text-sm text-zinc-300 font-mono">{{ brand.slug }}</td>
              <td class="py-3 pr-4">
                <Badge
                  :label="brandStatusLabel(brand.is_active)"
                  :tone="brandStatusTone(brand.is_active)"
                />
              </td>
              <td class="py-3 text-sm text-zinc-400">{{ formatUtcDate(brand.updated_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Pagination
      :page="page"
      :per-page="perPage"
      :total="total"
      :total-pages="totalPages"
      :loading="loading"
      @go-to-page="navigateToPage"
    />
  </div>
</template>
