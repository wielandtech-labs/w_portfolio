// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://wielandtech.com',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  build: {
    // nginx sends a strict CSP (style-src 'self'), so nothing may be inlined.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
    server: {
      // In the cluster nginx proxies this to w_tech; locally go to prod directly.
      proxy: {
        '/api/metrics/': { target: 'https://raphaelwieland.com', changeOrigin: true },
      },
    },
  },
});
