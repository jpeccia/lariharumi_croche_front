import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          // Routing
          'router': ['react-router-dom'],
          // UI Components
          'ui-icons': ['lucide-react'],
          // Forms and validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // HTTP and state
          'data': ['axios', 'zustand'],
          // Notifications
          'notifications': ['react-toastify'],
          // Utilities
          'utils': ['jwt-decode', 'use-debounce'],
          // QR Code
          'qr': ['qrcode.react']
          // Note: Swiper removed from manual chunks - auto-bundled when used
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild'
  },
  server: {
    port: 3000,
    open: true
  }
});
