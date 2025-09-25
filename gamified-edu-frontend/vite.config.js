import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS 'server' BLOCK
  server: {
    proxy: {
      // This will forward any request starting with /api to your backend
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})