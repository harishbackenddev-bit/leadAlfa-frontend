import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // keep this as '/' unless deploying to a sub-path
  server: { allowedHosts: ['.trycloudflare.com'] }, // quick tunnels get a random subdomain each run
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
