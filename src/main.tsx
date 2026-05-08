import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const base = import.meta.env.VITE_BASE_PATH ?? '/';

// Auto-update PWA:
// 1. Registra SW e força reload quando há nova versão (skipWaiting + clientsClaim
//    no workbox config activam o novo SW imediatamente).
// 2. A cada 60s, se online, chama registration.update().
// 3. Em visibilitychange (utilizador voltou à app) também verifica.
//
// NÃO há mais auto-nuke baseado em window.error / unhandledrejection — causava
// loop "Algo correu mal" ⇄ "A limpar tudo". O nuke fica reservado a:
//   - URL manual `?reset=1`
//   - Botão do ErrorBoundary (só dispara em erros reais de render React)

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
  const u = new URL(window.location.href);
  u.search = '';
  window.location.replace(u.toString());
}

// Emergency reset: visiting `?reset=1` nukes ALL local state (caches, SW,
// localStorage session) and reloads. Acessível mesmo se a app não carrega:
//   https://locked-summer.vercel.app/?reset=1
const isResetMode =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('reset') === '1';

if (isResetMode) {
  try { localStorage.clear(); } catch { /* swallow */ }
  document.getElementById('root')!.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;min-height:100dvh;background:#050505;color:#A78BFA;font-family:system-ui,-apple-system,sans-serif;flex-direction:column;gap:12px;text-align:center;padding:24px"><div style="font-size:48px">🔄</div><div style="font-size:20px;font-weight:700">A limpar tudo…</div><div style="font-size:13px;color:#9a9a9a">A app vai recarregar em segundos.</div></div>';
  void nukeAndReload('manual reset via ?reset=1');
}

if (!isResetMode && import.meta.env.PROD) {
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
}

if (!isResetMode) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter basename={base}>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
