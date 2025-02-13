import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@splidejs/react-splide']
  },
  resolve: {
    alias: {
      '@splidejs/react-splide': '@splidejs/react-splide/dist/react-splide.esm.js'
    }
  }
});
