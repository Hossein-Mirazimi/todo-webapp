import { generateSW } from 'workbox-build';
import type { Plugin } from 'vite'
import packageJson from '../package.json';
const APP_VERSION = packageJson.version;

export default () => ({
    name: 'service-worker-plugin',
    closeBundle: async () => {
      await generateSW({
        swDest: 'dist/client/sw.js',
        globDirectory: 'dist',
        directoryIndex: '/',
        cleanupOutdatedCaches: true,
        sourcemap: false,
        globPatterns: ['**/*.{html,js,css,png,jpg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-cache' + APP_VERSION,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache' + APP_VERSION,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      });
    },
} as Plugin)