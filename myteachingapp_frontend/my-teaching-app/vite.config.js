import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This helps with some CSP issues in local development
    hmr: {
      overlay: false 
    }
  },
  build: {
    // Use 'source-map' instead of 'eval-source-map' for better CSP compliance
    sourcemap: true 
  }
})