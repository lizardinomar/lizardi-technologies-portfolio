import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

export default defineConfig({
  site: 'https://arpagan.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({ filter: (p) => !p.includes('/admin') }),
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-01',
      useCdn: false,
      studioBasePath: '/admin',
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
