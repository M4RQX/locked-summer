import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { Camera, Dumbbell, Flame, Scale, ChevronRight, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { getCurrentUser } from '@/lib/auth';
import {
  getDailyTotalsRange, getRecentWorkouts, getStreakDays, getLatestWeight,
  getExerciseProgression, getStrengthSets, type ExerciseProgress,
} from '@/lib/repo';
import { getMuscleGroupForName, GROUP_LABELS, type MuscleGroup } from '@/lib/exercises';
import { fmtDate } from '@/lib/utils';
import type { User } from '@/types';

interface Snapshot {
  weeklyKcal: Array<{ date: string; kcal: number; protein_g: number }>;
  workoutsThisMonth: number;
  streak: number;
  lastWeight: number | null;
  progression: ExerciseProgress[];
  volumeByWeek: Array<{ weekISO: string; weekLabel: string } & Partial<Record<MuscleGroup, number>>>;
}

// Mon-anchored week start for any ISO date.
function weekStart(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const day = d.getUTCDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

// Visual palette per muscle group for the stacked chart.
const GROUP_COLOR: Record<MuscleGroup, string> = {
  peito:      '#FF6B35',
  costas:     '#06B6D4',
  pernas:     '#A855F7',
  gluteos:    '#EC4899',
  ombros:     '#F59E0B',
  biceps:     '#84CC16',
  triceps:    '#EAB308',
  antebraco:  '#10B981',
  core:       '#64748B',
  cardio:     '#EF4444',
  funcional:  '#94A3B8',
};

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
      const [range, workouts, streak, lw, progression, strengthSets] = await Promise.all([
        getDailyTotalsRange(u.id, 7),
        getRecentWorkouts(u.id, 50),
        getStreakDays(u.id),
        getLatestWeight(u.id),
        getExerciseProgression(u.id),
        getStrengthSets(u.id, 42), // 6 weeks
      ]);
      const fromDate = new Date(); fromDate.setDate(1);
      const monthCount = workouts.filter((w) => new Date(w.date) >= fromDate).length;

      // Bucket strength sets into (weekStart, group) → sum(weight × reps).
      const buckets: Record<string, Record<string, number>> = {};
      for (const s of strengthSets) {
        const wk = weekStart(s.date);
        const grp = getMuscleGroupForName(s.exercise_name) ?? 'funcional';
        const vol = Number(s.weight_kg) * Number(s.reps);
        if (!Number.isFinite(vol)) continue;
        (buckets[wk] ??= {})[grp] = (buckets[wk]?.[grp] ?? 0) + vol;
      }
      const volumeByWeek = Object.keys(buckets).sort().map((wk) => ({
        weekISO: wk,
        weekLabel: fmtDate(wk, 'd/M'),
        ...buckets[wk],
      }));

      setSnap({
        weeklyKcal: range.map((r) => ({ date: r.date, kcal: Math.round(r.totals.kcal), protein_g: Math.round(r.totals.protein_g) })).reverse(),
        workoutsThisMonth: monthCount,
        streak,
        lastWeight: lw ? Number(lw.weight_kg) : null,
        progression,
        volumeByWeek,
      });
      setLoading(false);
    })();
  }, [navigate]);

  if (loading || !user || !snap) return <><Header title="STATS" /><Loading /></>;

  return (
    <div className="px-5 md:px-8 max-w-md md:max-w-3xl xl:max-w-4xl mx-auto space-y-4">
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

      {snap.progression.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell size={14} className="text-flame-400" />
            <span className="label">progressão · por exercício</span>
            <span className="ml-auto text-xs tabular-nums text-muted">{snap.progression.length}</span>
          </div>
          <ul className="space-y-1.5">
            {snap.progression.slice(0, 12).map((p) => {
              const TrendIcon = p.trend === 'up' ? TrendingUp : p.trend === 'down' ? TrendingDown : Minus;
              const trendCls = p.trend === 'up' ? 'text-gold-400' : p.trend === 'down' ? 'text-flame-500' : 'text-muted';
              const delta = p.prev_max != null ? p.current_max - p.prev_max : null;
              const deltaTxt = delta == null ? '' : delta > 0 ? `+${delta.toFixed(1).replace('.0','')}kg` : delta < 0 ? `${delta.toFixed(1).replace('.0','')}kg` : '=';
              return (
                <li key={p.exercise_name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-700/40">
                  <TrendIcon size={14} className={trendCls} />
                  <span className="text-sm font-semibold truncate flex-1">{p.exercise_name}</span>
                  <span className="tabular-nums text-sm font-bold">{p.current_max.toFixed(1).replace('.0','')}kg</span>
                  {delta != null && delta !== 0 && (
                    <span className={`text-[10px] tabular-nums font-bold ${trendCls}`}>{deltaTxt}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {snap.progression.length === 0 && (
            <p className="text-xs text-muted text-center py-4">Treina mais para ver tendências.</p>
          )}
        </div>
      )}

      {snap.volumeByWeek.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-flame-400" />
            <span className="label">volume · 6 semanas · por grupo</span>
          </div>
          <div className="h-56 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snap.volumeByWeek} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#242424" strokeDasharray="3 3" />
                <XAxis dataKey="weekLabel" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: '#121212', border: '1px solid #2e2e2e', borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number, key: string) => [`${Math.round(value)}kg·rep`, GROUP_LABELS[key as MuscleGroup] ?? key]}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
                {(Object.keys(GROUP_COLOR) as MuscleGroup[]).map((g) => {
                  const used = snap.volumeByWeek.some((w) => (w as Record<string, unknown>)[g]);
                  if (!used) return null;
                  return (
                    <Bar key={g} dataKey={g} stackId="vol" fill={GROUP_COLOR[g]} name={GROUP_LABELS[g]} radius={[4, 4, 0, 0]} />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-muted text-center mt-1">volume = peso × reps somado por semana</p>
        </div>
      )}

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
