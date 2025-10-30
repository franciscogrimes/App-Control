import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      
      registerType: 'autoUpdate',
      strategies: 'injectManifest', 
      srcDir: 'src',
      filename: 'Service-Worker.js', 
      exclude: [
          /\.map$/,
          /^manifest.*\.js$/,
          /data:/, // Exclui Data URLs
          /blob:/, // Exclui Blob URLs
        ],
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ju Control',
        short_name: 'Ju Control',
        theme_color: '#800020',
        background_color: '#800020',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
