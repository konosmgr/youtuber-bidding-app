import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:8000', // Changed from backend to api
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Optimize build performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Improve chunking with simpler configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/lucide-svelte')) {
            return 'ui';
          }
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
            return 'vendor';
          }
          return undefined;
        }
      }
    },
    // Enable source maps for production
    sourcemap: false,
    // Optimize assets
    assetsInlineLimit: 4096, // 4KB
  },
  optimizeDeps: {
    include: ['clsx', 'tailwind-merge', 'lucide-svelte']
  }
});