import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import svgLoader from 'vite-svg-loader'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      Pages({
        resolver: 'vue',
        dirs: './src/pages',
        importMode: 'async',
        routeBlockLang: 'json5',
      }),
      svgLoader(),
    ],
    ssr: {
      noExternal: ['vue', 'vue-router', '@vueuse/head']
    },
    build: {
      manifest: true,
    }
  }
})
