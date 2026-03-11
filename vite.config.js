import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // automatically update SW
      manifest: {
        name: 'Studly LMS',
        short_name: 'Studly',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
          {
            src: '/icons/icon-192x192.png', // put in public/icons/
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png', // put in public/icons/
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // optional offline caching
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/hay-card-back-end\.vercel\.app\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    allowedHosts: [
      'nektonic-gennie-unobstinately.ngrok-free.dev'
    ]
  }
})