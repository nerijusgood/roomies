import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { contentPlugin } from './plugins/content'
import { localApiPlugin } from './plugins/local-api'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:demo` makes one self-contained HTML file with a fake in-browser API (no server, no service worker).
const DEMO = process.env.VITE_DEMO === '1'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: DEMO
    ? { outDir: 'dist-demo', assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 2000 }
    : { chunkSizeWarningLimit: 800 },
  plugins: [
    react(),
    tailwindcss(),
    contentPlugin(),
    localApiPlugin(),
    DEMO && viteSingleFile(),
    VitePWA({
      disable: DEMO,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Roomies',
        short_name: 'Roomies',
        description: 'Who cleans what this week',
        theme_color: '#F4F2EF',
        background_color: '#F4F2EF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [{ urlPattern: /\/api\//, handler: 'NetworkOnly' }],
      },
    }),
  ],
})
