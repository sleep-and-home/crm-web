<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

type ReportTab = 'ai'

const activeTab = ref<ReportTab>('ai')

const tabs: { id: ReportTab; label: string }[] = [{ id: 'ai', label: 'AI Query' }]

type AIQueryData = {
  columns: string[]
  rows: unknown[][]
}

type AIQueryResponse = {
  answer: string
  data?: AIQueryData | null
}

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? ''

function getToken(): string {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_access_token') ||
    ''
  )
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

// Table columns/rows come from whatever SQL the LLM wrote, so we don't know
// ahead of time which are money/counts/ids — just add thousands separators
// to any numeric cell rather than guessing per-column formatting.
//
// ClickHouse serializes Decimal columns (money amounts) as JSON strings to
// avoid float precision loss, so a "number" typeof check alone misses them.
// Only reformat strings that look like a decimal amount (contain a '.') —
// large integer ids are also sent as strings for the same precision reason,
// and we don't want to mangle those with separators or lose their precision
// by round-tripping through Number().
const decimalStringPattern = /^-?\d+\.\d+$/

function formatCell(value: unknown): string {
  if (typeof value === 'number') {
    return numberFormatter.format(value)
  }
  if (typeof value === 'string' && decimalStringPattern.test(value.trim())) {
    return numberFormatter.format(Number(value))
  }
  return String(value)
}

const question = ref('')
const loading = ref(false)
const errorMessage = ref('')
const answer = ref('')
const tableData = ref<AIQueryData | null>(null)

// The answer comes from an LLM and can echo data pulled from ClickHouse
// (product/brand names etc.) — never trust it as safe HTML. marked renders
// markdown to HTML; DOMPurify strips anything dangerous (script tags, event
// handlers, ...) before it ever reaches v-html.
const renderedAnswer = computed(() => {
  if (!answer.value) {
    return ''
  }
  const html = marked.parse(answer.value, { async: false }) as string
  return DOMPurify.sanitize(html)
})

async function askQuestion(): Promise<void> {
  if (!question.value.trim() || loading.value) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  answer.value = ''
  tableData.value = null

  try {
    const token = getToken()
    const endpoint = apiBase ? `${apiBase}/api/v1/ai/query` : '/api/v1/ai/query'
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question: question.value }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: set access token in localStorage as access_token')
      }
      if (response.status === 503) {
        throw new Error('AI Reports is temporarily unavailable')
      }

      let message = `Failed to get answer (${response.status})`
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

    const body = (await response.json()) as AIQueryResponse
    answer.value = body.answer
    tableData.value = body.data ?? null
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to get answer'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col space-y-6 animate-in fade-in duration-500">
    <div>
      <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Reports</h2>
    </div>

    <div class="flex gap-1 border-b border-zinc-800">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <section v-if="activeTab === 'ai'" class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <label class="block text-sm font-semibold text-zinc-300 mb-2" for="ai-question">
        Ask a question about sales, orders, or products
      </label>
      <textarea
        id="ai-question"
        v-model="question"
        rows="3"
        placeholder="e.g. What were our top 5 selling brands last month?"
        class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100
        placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
      />
      <button type="button" class="ask-button" :disabled="loading" @click="askQuestion">
        {{ loading ? 'Thinking…' : 'Ask' }}
      </button>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-400">{{ errorMessage }}</p>

      <div
        v-if="answer"
        class="markdown-answer mt-4 text-sm text-zinc-200"
        v-html="renderedAnswer"
      ></div>

      <div v-if="tableData" class="mt-4 overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
            >
              <th v-for="col in tableData.columns" :key="col" class="py-3 pr-4">{{ col }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/70">
            <tr v-for="(row, i) in tableData.rows" :key="i">
              <td v-for="(cell, j) in row" :key="j" class="py-3 pr-4 text-sm text-zinc-200">
                {{ formatCell(cell) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.tab-button {
  @apply px-4 py-2.5 text-sm font-bold text-zinc-500 border-b-2 border-transparent
  transition-colors duration-200 hover:text-zinc-200;
}

.tab-button--active {
  @apply text-zinc-100 border-zinc-100;
}

.ask-button {
  @apply mt-3 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold
  transition-colors duration-200 hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed;
}

.markdown-answer :deep(p) {
  @apply mb-2 last:mb-0;
}

.markdown-answer :deep(strong) {
  @apply font-semibold text-zinc-100;
}

.markdown-answer :deep(code) {
  @apply rounded bg-zinc-950 border border-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-200;
}

.markdown-answer :deep(ul),
.markdown-answer :deep(ol) {
  @apply mb-2 pl-5 space-y-1;
}

.markdown-answer :deep(ul) {
  @apply list-disc;
}

.markdown-answer :deep(ol) {
  @apply list-decimal;
}

.markdown-answer :deep(a) {
  @apply text-zinc-100 underline underline-offset-2;
}
</style>
