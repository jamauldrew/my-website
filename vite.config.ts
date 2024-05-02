import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks(id) {
           if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    },
  plugins: [
    react(),
  ],
});
