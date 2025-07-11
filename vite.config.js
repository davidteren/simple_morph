import { defineConfig } from 'vite';
import postcss from './postcss.config.js';

export default defineConfig({
  root: '.',
  base: process.env.NODE_ENV === 'production' ? '/simple-morph/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  },
  css: {
    postcss
  },
  server: {
    port: 3000,
    open: true
  }
});
