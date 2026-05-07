import { Flame } from 'lucide-react';

export default function Loading({ label = 'A carregar…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted">
      <Flame size={28} className="text-flame-500 animate-pulse" />
      <p className="mt-3 text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
