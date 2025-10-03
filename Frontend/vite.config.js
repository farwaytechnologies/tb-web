import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 4173,
    host: true, // binds to 0.0.0.0
    allowedHosts: ['tb-front-40xi.onrender.com']
  }
})
