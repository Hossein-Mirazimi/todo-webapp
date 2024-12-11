import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'


// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const buildPlugins: Plugin[] = [
      // Compression({}),
      // Compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ]
  return {
    plugins: [
      vue(),
      Pages({
        resolver: 'vue',
        dirs: './src/pages',
        importMode: 'async',
      }),
      !isDev && buildPlugins
    ],
  }
})
