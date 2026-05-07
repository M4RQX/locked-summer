import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { Camera, Dumbbell, Flame, Scale, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { getCurrentUser } from '@/lib/auth';
import { getDailyTotalsRange, getRecentWorkouts, getStreakDays, getLatestWeight } from '@/lib/repo';
import { fmtDate } from '@/lib/utils';
import type { User } from '@/types';

interface Snapshot {
  weeklyKcal: Array<{ date: string; kcal: number; protein_g: number }>;
  workoutsThisMonth: number;
  streak: number;
  lastWeight: number | null;
}

export default function StatsPage() {
  const navigate = useNavigate();
  void useLocation(); // ensure rerender on tab switch
  const [user, setUser] = useState<User | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      const [range, workouts, streak, lw] = await Promise.all([
        getDailyTotalsRange(u.id, 7),
        getRecentWorkouts(u.id, 50),
        getStreakDays(u.id),
        getLatestWeight(u.id),
      ]);
      const fromDate = new Date(); fromDate.setDate(1);
      const monthCount = workouts.filter((w) => new Date(w.date) >= fromDate).length;
      setSnap({
        weeklyKcal: range.map((r) => ({ date: r.date, kcal: Math.round(r.totals.kcal), protein_g: Math.round(r.totals.protein_g) })).reverse(),
        workoutsThisMonth: monthCount,
        streak,
        lastWeight: lw ? Number(lw.weight_kg) : null,
      });
      setLoading(false);
    })();
  }, [navigate]);

  if (loading || !user || !snap) return <><Header title="STATS" /><Loading /></>;

  return (
    <div className="px-5 max-w-md mx-auto space-y-4">
      <Header title="STATS" subtitle="resumo · últimos dias" />

      <div className="grid grid-cols-3 gap-2">
        <Tile icon={Flame} value={snap.streak} unit={snap.streak === 1 ? 'dia' : 'dias'} label="streak" tone="flame" />
        <Tile icon={Dumbbell} value={snap.workoutsThisMonth} unit="treinos" label="este mês" tone="gold" />
        <Tile icon={Scale} value={snap.lastWeight != null ? snap.lastWeight.toFixed(1) : '—'} unit="kg" label="peso" tone="cool" />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-flame-400" />
          <span className="label">kcal · 7 dias</span>
          <span className="ml-auto text-xs tabular-nums text-muted">alvo {user.target_calories}</span>
        </div>
        <div className="h-48 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={snap.weeklyKcal} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#242424" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#888" fontSize={10} tickFormatter={(d) => fmtDate(d, 'd/M')} />
              <YAxis stroke="#888" fontSize={10} />
              <Tooltip contentStyle={{ background: '#121212', border: '1px solid #2e2e2e', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="kcal" fill="#FF6B35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <nav className="space-y-2">
        {[
          { to: '/peso', icon: Scale, label: 'Peso & composição', hint: 'evolução completa' },
          { to: '/fotos', icon: Camera, label: 'Fotos de progresso', hint: 'galeria + compare' },
          { to: '/treino', icon: Dumbbell, label: 'Histórico de treinos', hint: 'todos os treinos' },
        ].map((it) => (
          <Link key={it.to} to={it.to} className="card flex items-center gap-3 active:scale-[0.99] transition">
            <div className="p-2 rounded-xl bg-ink-700/60 text-flame-400"><it.icon size={16} /></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{it.label}</p>
              <p className="text-xs text-muted">{it.hint}</p>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Tile({ icon: Icon, value, unit, label, tone }: { icon: LucideIcon; value: number | string; unit: string; label: string; tone: 'flame' | 'gold' | 'cool' }) {
  const text = tone === 'gold' ? 'text-gold-400' : tone === 'cool' ? 'text-sky-400' : 'text-flame-400';
  return (
    <div className="card !p-3">
      <div className="flex items-center gap-1.5">
        <Icon size={12} className={text} />
        <span className="label">{label}</span>
      </div>
      <p className="stat-num !text-3xl mt-1">{value}<span className="text-sm text-muted ml-1">{unit}</span></p>
    </div>
  );
}
