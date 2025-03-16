import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Split chunks more aggressively
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into smaller chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('redux')) return 'vendor-redux'
            if (id.includes('icons')) return 'vendor-icons'
            return 'vendor' // all other packages
          }
        },
      },
    },
  },
})
