import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getViteProxyConfig } from './config/wordpress-proxy.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const wpSiteUrl = process.env.VITE_WP_SITE_URL || env.VITE_WP_SITE_URL;

  return {
    plugins: [react(), tailwindcss()],
    base: '/', 
    server: {
      allowedHosts: ['.trycloudflare.com'],
      proxy: getViteProxyConfig(wpSiteUrl),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
      include: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    },
  };
});
