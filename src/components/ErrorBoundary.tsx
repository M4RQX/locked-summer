import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

/**
 * Catches React render-tree errors and shows a visible recovery UI
 * (instead of leaving the user on a blank white screen). The "Reset" button
 * fires the same nuke-and-reload routine used elsewhere — works even if
 * the rest of the app is dead. Inline-styled to avoid depending on Tailwind
 * (which may itself have failed to load).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[locked-summer] caught render error', error, info.componentStack);
  }

  async handleReset() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      try { localStorage.clear(); } catch { /* swallow */ }
    } finally {
      const u = new URL(window.location.href);
      u.search = '';
      u.searchParams.set('_v', String(Date.now()));
      window.location.replace(u.toString());
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const msg = this.state.error?.message ?? 'erro desconhecido';
    return (
      <div style={{
        minHeight: '100dvh', background: '#050505', color: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>⚠️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '0.02em' }}>
            Algo correu mal
          </h1>
          <p style={{ fontSize: 14, color: '#9a9a9a', margin: '0 0 24px' }}>
            A app encontrou um erro. Clica abaixo para limpar tudo e voltar a tentar.
          </p>
          <button
            onClick={() => this.handleReset()}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
              color: 'white', border: 'none', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 6px 24px -8px rgba(124,58,237,.55)',
            }}
          >
            🔄 Limpar e recarregar
          </button>
          <details style={{ marginTop: 24, textAlign: 'left', color: '#666' }}>
            <summary style={{ fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 2 }}>
              detalhes técnicos
            </summary>
            <pre style={{ fontSize: 11, padding: 12, background: '#121212', borderRadius: 8, overflow: 'auto', marginTop: 8 }}>
              {msg}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
