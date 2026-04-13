<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import SearchModal from './components/SearchModal.vue'

const searchOpen = ref(false)

function openSearch(): void {
  searchOpen.value = true
}

function closeSearch(): void {
  searchOpen.value = false
}

function handleGlobalKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
    event.preventDefault()
    searchOpen.value = true
    return
  }

  if (event.key === 'Escape' && searchOpen.value) {
    event.preventDefault()
    searchOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-zinc-950 selection:bg-zinc-800">
    <AppSidebar @open-search="openSearch" />

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-900 px-8"
      >
        <div class="flex flex-1 items-center"></div>

        <div class="flex items-center gap-6">
          <div class="hidden flex-col items-end md:flex">
            <span class="text-[10px] font-bold uppercase tracking-tight text-zinc-500"
              >Today's Revenue</span
            >
            <span class="font-mono text-xs font-bold text-emerald-500">$12,450.00</span>
          </div>

          <div class="h-8 w-[1px] bg-zinc-800"></div>

          <button
            class="rounded bg-zinc-100 px-4 py-2 text-[11px] font-black uppercase text-zinc-950 shadow-sm transition-transform hover:bg-white active:scale-95"
          >
            + New Order
          </button>
        </div>
      </header>

      <main class="custom-scrollbar flex-1 overflow-y-auto p-4">
        <router-view />
      </main>
    </div>

    <SearchModal :open="searchOpen" @close="closeSearch" />
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 10px;
}
</style>
