import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

const base = import.meta.env.VITE_BASE_PATH ?? '/';

// Auto-update PWA — crítico para iPhone PWA standalone (sem botão refresh).
// 1. Registra SW e força reload quando há nova versão (skipWaiting + clientsClaim
//    no workbox config já activam o novo SW de imediato).
// 2. A cada 60s, se online, chama registration.update() para verificar deploy novo.
// 3. Quando o user volta à app (visibilitychange → visible), também verifica.
// 4. NUCLEAR FALLBACK: se um chunk JS falhar a carregar (sintoma de HTML stale
//    a apontar para hash antigo que já não existe), limpa todas as caches +
//    desregista SW + reload. Auto-recovery sem o user fazer nada.

async function nukeAndReload(reason: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.warn(`[locked-summer] ${reason} → nuking caches and reloading`);
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch { /* swallow — reload anyway */ }
  // Use location.replace + cachebuster to force a fully fresh boot.
  const u = new URL(window.location.href);
  u.searchParams.set('_v', String(Date.now()));
  window.location.replace(u.toString());
}

function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  const msg = String((err as { message?: string })?.message ?? err);
  // Vite/Rollup fail names + generic "failed to fetch dynamically imported module"
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg);
}

if (import.meta.env.PROD) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // skipWaiting já activou o novo SW; recarrega para apanhar o HTML/JS frescos.
      window.location.reload();
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Periodic update check (every 60s) while online.
      setInterval(() => {
        if (navigator.onLine) registration.update().catch(() => { /* swallow */ });
      }, 60_000);
    },
  });

  // Quando a PWA volta a ficar visível (iPhone: utilizador voltou à app), verifica.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      updateSW().catch(() => { /* swallow */ });
    }
  });

  // Nuclear fallback: chunk falhou (HTML stale aponta para hash antigo) → recover.
  window.addEventListener('error', (event) => {
    if (isChunkLoadError(event.error) || (event.target as HTMLElement | null)?.tagName === 'SCRIPT') {
      const src = (event.target as HTMLScriptElement | null)?.src ?? '';
      if (src.includes('/assets/') || isChunkLoadError(event.error)) {
        nukeAndReload(`chunk load failed (${src || event.message})`);
      }
    }
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) nukeAndReload('unhandled chunk rejection');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
