import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiProxyTarget = env.API_PROXY_TARGET || 'http://127.0.0.1:6061'

    return {
        plugins: [
            vue(),
            vueDevTools(),
            tailwindcss(),
        ],
        server: {
            proxy: {
                '/api': {
                    target: apiProxyTarget,
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
    }
})
