import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works at https://suzanaboulhesn.github.io/ and under any sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
})
