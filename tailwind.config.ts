import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#050505', 900: '#0a0a0a', 800: '#121212', 700: '#1a1a1a', 600: '#242424', 500: '#2e2e2e', 400: '#3a3a3a' },
        flame: { 500: '#FF4500', 400: '#FF6B35', 300: '#FF8B5C' },
        gold: { 500: '#FFB627', 400: '#FFC857' },
        muted: '#9a9a9a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Anton"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        flame: '0 0 0 1px rgba(255,69,0,.4), 0 6px 24px -8px rgba(255,69,0,.55)',
        'flame-strong': '0 0 0 1px rgba(255,107,53,.6), 0 10px 40px -8px rgba(255,69,0,.65)',
        gold: '0 0 0 1px rgba(255,182,39,.5), 0 6px 24px -8px rgba(255,182,39,.55)',
      },
      keyframes: {
        pulseFlame: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,69,0,.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,69,0,0)' },
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
