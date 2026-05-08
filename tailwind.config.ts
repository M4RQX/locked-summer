import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#050505', 900: '#0a0a0a', 800: '#121212', 700: '#1a1a1a', 600: '#242424', 500: '#2e2e2e', 400: '#3a3a3a' },
        // Royal Violet — paleta principal. Nome `flame` mantém-se (legacy classes
        // em ~17 componentes); só o hex muda para violet-600/500/400 (não-neon).
        flame: { 500: '#7C3AED', 400: '#8B5CF6', 300: '#A78BFA' },
        // Acento dourado mais subtil (amber-400/300) — só para PRs/conquistas/streak.
        gold: { 500: '#FBBF24', 400: '#FCD34D' },
        muted: '#9a9a9a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Anton"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Royal Violet glows — substituem os antigos rgba(255,69,0,*) laranja.
        flame: '0 0 0 1px rgba(124,58,237,.4), 0 6px 24px -8px rgba(124,58,237,.55)',
        'flame-strong': '0 0 0 1px rgba(139,92,246,.6), 0 10px 40px -8px rgba(124,58,237,.65)',
        gold: '0 0 0 1px rgba(251,191,36,.4), 0 6px 24px -8px rgba(251,191,36,.45)',
      },
      keyframes: {
        pulseFlame: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(124,58,237,.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(124,58,237,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-flame': 'pulseFlame 2s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
