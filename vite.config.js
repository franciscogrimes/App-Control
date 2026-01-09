import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
   VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
  manifest: {
    name: 'Ju Control',
    short_name: 'Ju Control',
    description: 'Sistema de controle de estoque',
    theme_color: '#800020',
    background_color: '#800020',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    icons: [
      { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true
  }
})


  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
