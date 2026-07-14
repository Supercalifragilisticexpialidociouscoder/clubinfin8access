import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/clubinfin8access/',
  plugins: [react()],
  server: {
    allowedHosts: true,
  }
})
