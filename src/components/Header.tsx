import { motion } from 'framer-motion';
import { Flame, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, showSettings = true, right }: Props) {
  return (
    <header className="px-5 pt-12 pb-3 flex items-end justify-between gap-3" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
      <div className="min-w-0">
        <motion.h1
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
          className="font-display text-4xl tracking-wide leading-none flex items-center gap-2"
        >
          <Flame className="text-flame-500" size={28} />
          {title}
        </motion.h1>
        {subtitle && <p className="text-muted text-xs mt-1 uppercase tracking-widest font-semibold">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        {showSettings && (
          <Link to="/settings" className="p-2 rounded-xl bg-ink-700/60 border border-ink-500/60 active:scale-95 transition">
            <Settings size={18} className="text-muted" />
          </Link>
        )}
      </div>
    </header>
  );
}
