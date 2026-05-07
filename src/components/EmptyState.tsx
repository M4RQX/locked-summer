import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-12 px-6"
    >
      <div className="p-4 rounded-2xl bg-ink-700/50 border border-ink-500/60 mb-3">
        <Icon size={28} className="text-flame-400" />
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="text-muted text-sm mt-2 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
