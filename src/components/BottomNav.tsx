import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/',         icon: Home,             label: 'Home' },
  { to: '/treino',   icon: Dumbbell,         label: 'Treino' },
  { to: '/comida',   icon: UtensilsCrossed,  label: 'Comida' },
  { to: '/stats',    icon: BarChart3,        label: 'Stats' },
];

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-950/90 backdrop-blur-xl border-t border-ink-700/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4 h-[68px] max-w-md mx-auto px-2">
        {tabs.map((t) => (
          <li key={t.to} className="flex">
            <NavLink
              to={t.to}
              end={t.to === '/'}
              className="flex-1 flex items-center justify-center"
              aria-label={t.label}
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="relative flex items-center justify-center w-12 h-12"
                >
                  {isActive && (
                    <motion.span
                      layoutId="bn-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-2xl bg-flame-500/15 ring-1 ring-flame-400/40 shadow-[0_0_16px_-2px_rgba(124,58,237,0.4)]"
                    />
                  )}
                  <t.icon
                    size={24}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={`relative z-10 transition-colors ${isActive ? 'text-flame-300' : 'text-muted'}`}
                  />
                </motion.div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
