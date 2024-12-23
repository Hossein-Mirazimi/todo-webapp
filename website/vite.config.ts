import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'
import ServiceWorker from './service-worker'

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
      VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        includeManifestIcons: true,
        minify: isBuild,
        manifest: {
          id: 'com.todo.app',
          name: 'Todo App',
          short_name: 'Todo',
          description: 'My Awesome Todo description',
          theme_color: '#ffffff',
          display: "standalone",
          background_color: "#ffffff",
          start_url: "/",
          dir: 'ltr',
          lang: 'en-US',
          icons: [
            {
              "src": "/icons/icon-48x48.png",
              "sizes": "48x48",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-72x72.png",
              "sizes": "72x72",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-96x96.png",
              "sizes": "96x96",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-128x128.png",
              "sizes": "128x128",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-144x144.png",
              "sizes": "144x144",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-152x152.png",
              "sizes": "152x152",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/icons/icon-256x256.png",
              "sizes": "256x256",
              "type": "image/png"
            }
          ]
        }
      }),
      ServiceWorker(),
    ],
    ssr: ssrOptions,
    build: {
      manifest: true,
    }
  }
})