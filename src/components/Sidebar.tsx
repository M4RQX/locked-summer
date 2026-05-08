import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, BarChart3, Flame, Camera, Scale, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Tab {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}
const TABS: Tab[] = [
  { to: '/',         icon: Home,            label: 'Home',    end: true },
  { to: '/treino',   icon: Dumbbell,        label: 'Treino' },
  { to: '/comida',   icon: UtensilsCrossed, label: 'Comida' },
  { to: '/peso',     icon: Scale,           label: 'Peso' },
  { to: '/fotos',    icon: Camera,          label: 'Fotos' },
  { to: '/stats',    icon: BarChart3,       label: 'Stats' },
];

/**
 * Vertical sidebar nav shown on `md+` screens (desktop / iPad landscape).
 * Mobile uses BottomNav instead. Both navigate to the same routes.
 */
export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex sticky top-0 h-dvh w-56 flex-col border-r border-ink-600/60 bg-ink-900/80 backdrop-blur-md px-4 py-6 shrink-0"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
    >
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flame-500 to-flame-400 shadow-flame flex items-center justify-center">
          <Flame size={18} className="text-white" />
        </div>
        <div>
          <p className="font-display text-2xl leading-none tracking-wider">LOCKED</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted">summer</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end}>
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition ${
                  isActive
                    ? 'bg-flame-500/15 text-flame-400 border border-flame-500/30 shadow-[0_0_18px_-6px_rgba(124,58,237,0.4)]'
                    : 'text-muted hover:text-white/90 border border-transparent'
                }`}
              >
                <t.icon size={18} strokeWidth={2.2} />
                <span>{t.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="sb-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 -ml-4 bg-flame-500 rounded-r-full"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-muted hover:text-flame-400 transition border border-ink-600/40"
      >
        <SettingsIcon size={16} />
        <span>Definições</span>
      </NavLink>

      <p className="text-[10px] text-muted/60 text-center mt-4 uppercase tracking-[0.3em]">no days off</p>
    </aside>
  );
}
