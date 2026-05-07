import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default `/` for Vercel/standalone. Override to `/locked-summer/` for GitHub Pages
  // via VITE_BASE_PATH (the GH Actions workflow already does this).
  const base = env.VITE_BASE_PATH ?? '/';
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'LOCKED SUMMER',
          short_name: 'LOCKED',
          description: 'App pessoal de treino, nutrição e progresso. Locked in for summer.',
          theme_color: '#0a0a0a',
          background_color: '#0a0a0a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: base,
          scope: base,
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
          navigateFallback: `${base}index.html`,
          // Activate the new SW immediately and take control of any open clients.
          // Combined with registerType:'autoUpdate' + reload-on-update on the client,
          // this prevents the "first load shows stale, refresh fixes it" problem.
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
    server: { port: 5173, host: true },
  };
});
