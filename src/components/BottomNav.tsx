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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ink-600/60 bg-ink-900/85 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {tabs.map((t) => (
          <li key={t.to} className="flex">
            <NavLink to={t.to} end={t.to === '/'} className="flex-1 flex items-center justify-center">
              {({ isActive }) => (
                <motion.div
                  className={`relative flex flex-col items-center justify-center gap-0.5 ${isActive ? 'text-flame-400' : 'text-muted'}`}
                  whileTap={{ scale: 0.92 }}
                >
                  <t.icon size={22} strokeWidth={2.2} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">{t.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="bn-active"
                      className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-10 bg-flame-500 rounded-full shadow-[0_0_12px_2px_rgba(255,69,0,0.5)]"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
