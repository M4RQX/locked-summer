import { motion } from 'framer-motion';

interface Props {
  value: number;     // current
  target: number;    // goal
  color?: 'flame' | 'gold' | 'green' | 'blue';
  label?: string;
  unit?: string;
  compact?: boolean;
}
const colors: Record<string, string> = {
  flame: 'from-flame-500 to-flame-400',
  gold:  'from-gold-500  to-gold-400',
  green: 'from-emerald-500 to-emerald-400',
  blue:  'from-sky-500 to-sky-400',
};
export default function ProgressBar({ value, target, color = 'flame', label, unit = '', compact = false }: Props) {
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0);
  return (
    <div className={compact ? '' : 'space-y-1.5'}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="label">{label}</span>
          <span className="text-sm tabular-nums">
            <span className="font-bold text-white">{Math.round(value)}</span>
            <span className="text-muted">/{Math.round(target)}{unit && <span className="ml-0.5">{unit}</span>}</span>
          </span>
        </div>
      )}
      <div className="h-2.5 bg-ink-700/80 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
    </div>
  );
}
