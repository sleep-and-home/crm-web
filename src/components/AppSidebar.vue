<script setup>
import { RouterLink } from 'vue-router'

const emit = defineEmits(['open-search'])

const menuLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Brands', path: '/brands' },
  { name: 'Categories', path: '/categories' },
  { name: 'Orders', path: '/orders' },
  { name: 'Reports', path: '/reports' },
]
</script>

<template>
  <aside
    class="w-64 h-screen bg-zinc-900 border-r border-zinc-800/50 flex flex-col py-4 px-2 transition-all"
  >
    <div class="flex items-center gap-3 mb-12 px-2">
      <div class="flex gap-1 items-end h-6">
        <div class="w-1.5 h-3 bg-zinc-500 rounded-full"></div>
        <div
          class="w-1.5 h-6 bg-zinc-300 rounded-full shadow-[0_0_10px_rgba(212,212,216,0.2)]"
        ></div>
        <div class="w-1.5 h-4 bg-zinc-400 rounded-full"></div>
      </div>
      <span class="text-xl font-black tracking-tighter text-zinc-100 uppercase">Ecoversion</span>
    </div>

    <div class="mb-3 px-2">
      <button class="search-button" type="button" @click="emit('open-search')">
        <span class="search-button__label">Search</span>
        <span class="search-button__hotkey">Ctrl+K</span>
      </button>
    </div>

    <nav class="flex-1 space-y-1">
      <RouterLink v-for="link in menuLinks" :key="link.path" :to="link.path" class="nav-link">
        <span>{{ link.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
@reference "../assets/main.css";

.nav-link {
  /* text-zinc-500: приглушенный текст для неактивных пунктов */
  @apply flex items-center px-4 py-2.5 rounded-lg transition-all duration-200
  text-sm font-bold text-zinc-500 hover:text-zinc-200;
}

.search-button {
  @apply flex w-full items-center justify-between rounded-lg border border-zinc-800/80
  bg-zinc-950/70 px-3 py-2 text-left text-sm font-semibold text-zinc-300
  transition-colors duration-200 hover:border-zinc-700 hover:text-zinc-100;
}

.search-button__label {
  @apply tracking-tight;
}

.search-button__hotkey {
  @apply rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] font-semibold
  text-zinc-500;
}

/* Активный пункт: "вдавленный" эффект за счет bg-zinc-800 и молочного текста zinc-100 */
.router-link-active {
  @apply bg-zinc-800/50 text-zinc-100! shadow-inner ring-1 ring-zinc-700/50;
  /* Убрали border-l-2 и отрицательные маргины для чистоты интерфейса */
}
</style>
