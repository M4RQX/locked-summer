import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

const base = import.meta.env.VITE_BASE_PATH ?? '/';

// Auto-update PWA — when a new SW finishes installing, reload the page once
// so the user always sees fresh code on first load (instead of needing manual refresh).
if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // skipWaiting already activated the new SW; just reload to pick it up.
      window.location.reload();
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
