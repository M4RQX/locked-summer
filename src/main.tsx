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
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
