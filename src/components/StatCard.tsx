import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: 'flame' | 'gold' | 'cool';
  onClick?: () => void;
}
export default function StatCard({ icon: Icon, label, value, unit, hint, tone = 'flame', onClick }: Props) {
  const ring = tone === 'gold' ? 'ring-gold-500/30' : tone === 'cool' ? 'ring-sky-500/20' : 'ring-flame-500/30';
  const text = tone === 'gold' ? 'text-gold-400' : tone === 'cool' ? 'text-sky-400' : 'text-flame-400';
  return (
    <motion.button
      whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`card text-left ring-1 ${ring} disabled:opacity-50 w-full`}
      disabled={!onClick}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-ink-700/60 ${text}`}><Icon size={14} /></div>
        <span className="label">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="stat-num">{value}</span>
        {unit && <span className="text-muted text-sm font-semibold">{unit}</span>}
      </div>
      {hint && <p className="text-muted text-xs mt-1">{hint}</p>}
    </motion.button>
  );
}
