import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { injectSpeedInsights } from '@vercel/speed-insights/plugin';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    injectSpeedInsights(),
  ],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Minify CSS
    cssMinify: true,
    // Optimize assets
    assetsInlineLimit: 4096,
  },
  // Optimize for SEO
  server: {
    port: 3000,
    host: true,
  },
});
