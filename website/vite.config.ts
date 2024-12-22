import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const ssrOptions = isBuild
    ? { noExternal: ['vue', 'vue-router', '@vueuse/head'] }
    : {}
    
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
    ssr: ssrOptions,
    build: {
      manifest: true,
    }
  }
})
