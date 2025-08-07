import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // For alias resolution

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Use @/ to shorten imports
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Optional UI lib exclusion
  },
  server: {
    historyApiFallback: true, // Fixes refresh / direct route errors (Dev)
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://irkfrlvddkyjziuvrisb.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    historyApiFallback: true, // Also fixes for `npm run preview`
    port: 4173,
  },
  base: '/', // Ensures correct relative paths on Netlify
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
