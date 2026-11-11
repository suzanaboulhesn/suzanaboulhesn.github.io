import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of https://suzanaboulhesn.github.io/ (project pages live at /projects/<slug>/).
export default defineConfig({
  base: '/',
  plugins: [react()],
})
