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
          // Não precache HTML — vai ser sempre fetched da rede (NetworkFirst).
          // Hashed JS/CSS/assets continuam a ser precached porque o nome é imutável.
          globPatterns: ['**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
          // Não usamos navigateFallback do precache; o runtimeCaching abaixo trata da navegação.
          navigateFallback: null,
          // Activate the new SW immediately and take control of any open clients.
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            // Navegação SPA: tenta sempre a rede primeiro (3s timeout). Se offline,
            // serve a versão cached. Resolve o "preciso de refresh para dar" — é a
            // causa raiz de iPhone PWA standalone (sem botão refresh) ficar preso
            // num HTML antigo a apontar para chunks JS já não existentes.
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // Assets hashed (já no precache, mas catch-all para qualquer um que escape).
            {
              urlPattern: /\/assets\/.*\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'assets',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            // Imagens das demos de exercícios (raw.githubusercontent.com).
            {
              urlPattern: /^https:\/\/raw\.githubusercontent\.com\/yuhonas\/free-exercise-db\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'exercise-demos',
                expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 90 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
    server: { port: 5173, host: true },
  };
});
