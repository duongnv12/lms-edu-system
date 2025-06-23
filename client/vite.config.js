// client/vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000, // Đảm bảo frontend chạy trên cổng 3000
    host: true, // Cho phép truy cập từ mạng nội bộ nếu cần
    proxy: {
      '/api': 'http://localhost:5000', // Đúng port backend của bạn
    }
  }
})