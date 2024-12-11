import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      resolver: 'vue',
      dirs: './src/pages',
      importMode: 'async',
    })
  ],
})
