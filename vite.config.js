import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/safrah-tourism/',
  plugins: [react()],
  build: {
    outDir: 'dist', // تأكيد استخدام dist
    emptyOutDir: true // تنظيف المجلد قبل كل بناء
  }
})