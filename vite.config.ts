import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.jpeg', 'robots.txt'],
      manifest: {
        name: 'Optimizer Game',
        short_name: 'Optimizer',
        description: 'A progressive web game with level-based gameplay',
        theme_color: '#667eea',
        background_color: '#667eea',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'logo-circle-lightning.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'logo-circle-lightning.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: './',
  server: {
    port: 3000,
    host: true, // Allows access from network devices (0.0.0.0)
    strictPort: false, // Will try next available port if 3000 is taken
    open: false // Don't auto-open browser
  }
})

