<script setup lang="ts">
type TopProduct = {
  name: string
  sku: string
  orders: number
  revenue: number
}

type CategoryStat = {
  name: string
  revenue: number
  orders: number
  avgOrderValue: number
  returnRate: number
  marginPct: number
  deltaMoM: number
}

type CityStat = {
  name: string
  revenue: number
  orders: number
  cancelRate: number
  deltaMoM: number
}

type BrandStat = {
  name: string
  revenue: number
  orders: number
  avgOrderValue: number
  returnRate: number
  deltaMoM: number
}

const periodLabel = '01-07 Feb 2026'
const periodCompareLabel = 'vs 01-07 Jan 2026'

const revenueMTD = 124500
const revenueMTDMoM = 8.5

const ordersMTD = 1240
const ordersMTDMoM = 5.2

const avgOrderValueMTD = 100.4
const avgOrderValueMTDMoM = 3.1

const topSellingProducts: TopProduct[] = [
  { name: 'Orthopedic Mattress Ultra', sku: 'MAT-ULTRA-160', orders: 186, revenue: 37200 },
  { name: 'Memory Foam Pillow Pro', sku: 'PIL-PRO-002', orders: 241, revenue: 24100 },
  { name: 'Premium Bed Frame Oak', sku: 'BED-OAK-180', orders: 92, revenue: 18400 },
  { name: 'Hotel Collection Blanket', sku: 'BLK-HOTEL-01', orders: 167, revenue: 12520 },
  { name: 'Cloud Soft Topper', sku: 'TOP-CLOUD-90', orders: 123, revenue: 9840 },
]

const salesByCities: CityStat[] = [
  { name: 'Moscow', revenue: 45200, orders: 390, cancelRate: 1.9, deltaMoM: 9.3 },
  { name: 'Saint Petersburg', revenue: 27800, orders: 242, cancelRate: 2.4, deltaMoM: 4.7 },
  { name: 'Kazan', revenue: 16400, orders: 157, cancelRate: 3.1, deltaMoM: 1.8 },
  { name: 'Yekaterinburg', revenue: 13200, orders: 119, cancelRate: 4.2, deltaMoM: -2.1 },
  { name: 'Novosibirsk', revenue: 9600, orders: 91, cancelRate: 5.7, deltaMoM: -4.9 },
]

const salesByCategories: CategoryStat[] = [
  {
    name: 'Mattresses',
    revenue: 56100,
    orders: 430,
    avgOrderValue: 130.47,
    returnRate: 1.8,
    marginPct: 34.2,
    deltaMoM: 8.5,
  },
  {
    name: 'Pillows',
    revenue: 24300,
    orders: 336,
    avgOrderValue: 72.32,
    returnRate: 2.1,
    marginPct: 41.3,
    deltaMoM: 4.1,
  },
  {
    name: 'Beds',
    revenue: 21900,
    orders: 118,
    avgOrderValue: 185.59,
    returnRate: 3.9,
    marginPct: 28.8,
    deltaMoM: -2.4,
  },
  {
    name: 'Blankets',
    revenue: 12200,
    orders: 214,
    avgOrderValue: 57.01,
    returnRate: 2.7,
    marginPct: 37.5,
    deltaMoM: 6.9,
  },
  {
    name: 'Accessories',
    revenue: 10000,
    orders: 142,
    avgOrderValue: 70.42,
    returnRate: 4.8,
    marginPct: 45.1,
    deltaMoM: 1.6,
  },
]

const salesByBrands: BrandStat[] = [
  {
    name: 'DreamCloud',
    revenue: 33800,
    orders: 263,
    avgOrderValue: 128.6,
    returnRate: 1.1,
    deltaMoM: 7.3,
  },
  {
    name: 'OrtoMax',
    revenue: 29100,
    orders: 250,
    avgOrderValue: 116.4,
    returnRate: 1.6,
    deltaMoM: 5.4,
  },
  {
    name: 'Podushka',
    revenue: 24800,
    orders: 269,
    avgOrderValue: 92.3,
    returnRate: 2.8,
    deltaMoM: -1.2,
  },
  {
    name: 'SleepLab',
    revenue: 20500,
    orders: 186,
    avgOrderValue: 109.9,
    returnRate: 2.2,
    deltaMoM: 2.7,
  },
  {
    name: 'NordRest',
    revenue: 16300,
    orders: 186,
    avgOrderValue: 87.4,
    returnRate: 3.4,
    deltaMoM: -0.8,
  },
]

function formatCurrency(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

function deltaBadgeClass(delta: number): string {
  if (delta > 0) {
    return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
  }
  if (delta < 0) {
    return 'text-red-300 bg-red-500/10 border-red-500/30'
  }
  return 'text-zinc-300 bg-zinc-500/10 border-zinc-500/30'
}

function riskBadgeClass(rate: number): string {
  if (rate >= 5) {
    return 'text-red-300 bg-red-500/10 border-red-500/30'
  }
  if (rate >= 2.5) {
    return 'text-amber-300 bg-amber-500/10 border-amber-500/30'
  }
  return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
}
</script>

<template>
  <div class="flex flex-col space-y-6 animate-in fade-in duration-500">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Revenue (MTD)
            </p>
            <p class="mt-3 text-3xl font-bold text-zinc-100">{{ formatCurrency(revenueMTD) }}</p>
          </div>
          <span
            class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
            :class="deltaBadgeClass(revenueMTDMoM)"
          >
            {{ revenueMTDMoM > 0 ? '+' : '' }}{{ formatPercent(revenueMTDMoM) }} MoM
          </span>
        </div>
        <p class="mt-3 text-xs text-zinc-500">{{ periodLabel }} · {{ periodCompareLabel }}</p>
      </section>
      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Orders (MTD)
            </p>
            <p class="mt-3 text-3xl font-bold text-zinc-100">{{ ordersMTD }}</p>
          </div>
          <span
            class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
            :class="deltaBadgeClass(ordersMTDMoM)"
          >
            {{ ordersMTDMoM > 0 ? '+' : '' }}{{ formatPercent(ordersMTDMoM) }} MoM
          </span>
        </div>
        <p class="mt-3 text-xs text-zinc-500">{{ periodLabel }} · {{ periodCompareLabel }}</p>
      </section>
      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Avg. Order Value (MTD)
            </p>
            <p class="mt-3 text-3xl font-bold text-zinc-100">
              ${{ formatDecimal(avgOrderValueMTD) }}
            </p>
          </div>
          <span
            class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
            :class="deltaBadgeClass(avgOrderValueMTDMoM)"
          >
            {{ avgOrderValueMTDMoM > 0 ? '+' : '' }}{{ formatPercent(avgOrderValueMTDMoM) }} MoM
          </span>
        </div>
        <p class="mt-3 text-xs text-zinc-500">{{ periodLabel }} · {{ periodCompareLabel }}</p>
      </section>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <section class="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-zinc-100">Top Selling Products</h3>
          <span class="text-xs text-zinc-500">{{ topSellingProducts.length }} items</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
              >
                <th class="py-3 pr-4">Product</th>
                <th class="py-3 pr-4">SKU</th>
                <th class="py-3 pr-4 text-right">Orders</th>
                <th class="py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/70">
              <tr v-for="product in topSellingProducts" :key="product.sku">
                <td class="py-3 pr-4 text-sm text-zinc-200">{{ product.name }}</td>
                <td class="py-3 pr-4 text-xs text-zinc-500 font-mono">{{ product.sku }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-200 text-right">{{ product.orders }}</td>
                <td class="py-3 text-sm text-blue-400 text-right font-semibold">
                  {{ formatCurrency(product.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 class="text-base font-semibold text-zinc-100 mb-4">Sales by Cities</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
              >
                <th class="py-3 pr-4">City</th>
                <th class="py-3 pr-4 text-right">Revenue</th>
                <th class="py-3 pr-4 text-right">Orders</th>
                <th class="py-3 pr-4 text-right">Cancel</th>
                <th class="py-3 text-right">MoM</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/70">
              <tr v-for="city in salesByCities" :key="city.name">
                <td class="py-3 pr-4 text-sm text-zinc-200">{{ city.name }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-100 text-right">
                  {{ formatCurrency(city.revenue) }}
                </td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">{{ city.orders }}</td>
                <td class="py-3 pr-4 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="riskBadgeClass(city.cancelRate)"
                  >
                    {{ formatPercent(city.cancelRate) }}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="deltaBadgeClass(city.deltaMoM)"
                  >
                    {{ city.deltaMoM > 0 ? '+' : '' }}{{ formatPercent(city.deltaMoM) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 class="text-base font-semibold text-zinc-100 mb-4">Sales by Categories</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
              >
                <th class="py-3 pr-4">Category</th>
                <th class="py-3 pr-4 text-right">Revenue</th>
                <th class="py-3 pr-4 text-right">Orders</th>
                <th class="py-3 pr-4 text-right">AOV</th>
                <th class="py-3 pr-4 text-right">Returns</th>
                <th class="py-3 pr-4 text-right">Margin</th>
                <th class="py-3 text-right">MoM</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/70">
              <tr v-for="category in salesByCategories" :key="category.name">
                <td class="py-3 pr-4 text-sm text-zinc-200">{{ category.name }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-100 text-right">
                  {{ formatCurrency(category.revenue) }}
                </td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">{{ category.orders }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">
                  {{ formatCurrency(category.avgOrderValue, 2) }}
                </td>
                <td class="py-3 pr-4 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="riskBadgeClass(category.returnRate)"
                  >
                    {{ formatPercent(category.returnRate) }}
                  </span>
                </td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">
                  {{ formatPercent(category.marginPct) }}
                </td>
                <td class="py-3 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="deltaBadgeClass(category.deltaMoM)"
                  >
                    {{ category.deltaMoM > 0 ? '+' : '' }}{{ formatPercent(category.deltaMoM) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 class="text-base font-semibold text-zinc-100 mb-4">Sales by Brands</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800"
              >
                <th class="py-3 pr-4">Brand</th>
                <th class="py-3 pr-4 text-right">Revenue</th>
                <th class="py-3 pr-4 text-right">Orders</th>
                <th class="py-3 pr-4 text-right">AOV</th>
                <th class="py-3 pr-4 text-right">Returns</th>
                <th class="py-3 text-right">MoM</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/70">
              <tr v-for="brand in salesByBrands" :key="brand.name">
                <td class="py-3 pr-4 text-sm text-zinc-200">{{ brand.name }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-100 text-right">
                  {{ formatCurrency(brand.revenue) }}
                </td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">{{ brand.orders }}</td>
                <td class="py-3 pr-4 text-sm text-zinc-300 text-right">
                  {{ formatCurrency(brand.avgOrderValue, 2) }}
                </td>
                <td class="py-3 pr-4 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="riskBadgeClass(brand.returnRate)"
                  >
                    {{ formatPercent(brand.returnRate) }}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <span
                    class="text-[11px] font-semibold border rounded-md px-2 py-0.5"
                    :class="deltaBadgeClass(brand.deltaMoM)"
                  >
                    {{ brand.deltaMoM > 0 ? '+' : '' }}{{ formatPercent(brand.deltaMoM) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
