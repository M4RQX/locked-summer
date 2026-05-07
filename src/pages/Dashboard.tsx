import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Scale, TrendingUp, Users, Quote } from 'lucide-react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import Loading from '@/components/Loading';
import { getCurrentUser, getUserByName } from '@/lib/auth';
import { getRecentWorkouts, getLastWorkoutDayType, getMealsForDay, totalsFromMeals, getLatestWeight, getStreakDays } from '@/lib/repo';
import { nextDayType, getPlan } from '@/lib/plans';
import { randomQuote } from '@/lib/quotes';
import { todayISO } from '@/lib/utils';
import type { User } from '@/types';

interface Snapshot {
  user: User;
  next: { type: 'A' | 'B' | 'C'; title: string; subtitle: string };
  todayKcal: number;
  todayProtein: number;
  weightKg: number | null;
  streak: number;
  lastWorkoutDate?: string;
}

async function buildSnapshot(user: User): Promise<Snapshot> {
  const [last, meals, weight, streak] = await Promise.all([
    getLastWorkoutDayType(user.id),
    getMealsForDay(user.id, todayISO()),
    getLatestWeight(user.id),
    getStreakDays(user.id),
  ]);
  const totals = totalsFromMeals(meals);
  const nextType = nextDayType(last);
  const plan = getPlan(nextType);
  const recent = await getRecentWorkouts(user.id, 1);
  return {
    user,
    next: { type: nextType, title: plan.title, subtitle: plan.subtitle },
    todayKcal: Math.round(totals.kcal),
    todayProtein: Math.round(totals.protein_g),
    weightKg: weight ? Number(weight.weight_kg) : null,
    streak,
    lastWorkoutDate: recent[0]?.date,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Snapshot | null>(null);
  const [partner, setPartner] = useState<Snapshot | null>(null);
  const [showPartner, setShowPartner] = useState(false);
  const [loading, setLoading] = useState(true);
  const quote = useMemo(() => randomQuote(new Date().getDate()), []);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) { navigate('/login', { replace: true }); return; }
        const snap = await buildSnapshot(user);
        setMe(snap);
        const partnerName = user.name === 'Emanuel' ? 'Tiago' : 'Emanuel';
        const partnerUser = await getUserByName(partnerName);
        if (partnerUser) setPartner(await buildSnapshot(partnerUser));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <><Header title="LOCKED" subtitle="a carregar" /><Loading /></>;
  if (!me) return null;

  const weightDelta = me.weightKg != null ? me.weightKg - Number(me.user.start_weight_kg) : 0;
  const weightTargetPct = me.weightKg != null
    ? Math.min(100, Math.max(0, ((me.weightKg - Number(me.user.start_weight_kg)) / (Number(me.user.target_weight_kg) - Number(me.user.start_weight_kg))) * 100))
    : 0;

  const view = showPartner && partner ? partner : me;

  return (
    <div className="px-5 space-y-4 max-w-md mx-auto">
      <Header
        title={`Olá, ${me.user.name}`}
        subtitle={showPartner && partner ? `🔁 a ver ${partner.user.name}` : 'Locked in'}
        right={partner ? (
          <button
            onClick={() => setShowPartner((v) => !v)}
            className={`p-2 rounded-xl border active:scale-95 transition ${showPartner ? 'bg-flame-500/15 border-flame-400/50 text-flame-400' : 'bg-ink-700/60 border-ink-500/60 text-muted'}`}
            aria-label="alternar perfil"
          >
            <Users size={18} />
          </button>
        ) : null}
      />

      {/* Frase motivacional */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="card-glow flex items-start gap-3"
      >
        <Quote size={18} className="text-gold-400 shrink-0 mt-0.5" />
        <p className="font-display text-2xl leading-tight">{quote}</p>
      </motion.div>

      {/* Próximo treino */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/treino')}
        className="card w-full text-left relative overflow-hidden border-flame-400/40 ring-1 ring-flame-500/20"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 w-36 h-36 rounded-full bg-flame-500/15 blur-3xl" />
        <div className="flex items-center gap-2 text-flame-400 mb-1">
          <Dumbbell size={14} />
          <span className="label !text-flame-400/80">próximo treino</span>
        </div>
        <h2 className="font-display text-3xl">{view.next.title} · {view.next.subtitle}</h2>
        <p className="text-muted text-xs mt-1">
          {view.lastWorkoutDate ? `último: ${view.lastWorkoutDate}` : 'ainda não treinaste — começa o ciclo'}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 pill bg-flame-500 text-white">
          <Flame size={12} /> Começar
        </div>
      </motion.button>

      {/* Calorias hoje */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-flame-400" />
          <span className="label">comida hoje</span>
        </div>
        <ProgressBar value={view.todayKcal} target={Number(view.user.target_calories)} label="kcal" unit="" />
        <div className="mt-3">
          <ProgressBar value={view.todayProtein} target={Number(view.user.target_protein)} color="gold" label="proteína" unit="g" />
        </div>
      </div>

      {/* Peso */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Scale}
          label="Peso"
          value={view.weightKg != null ? view.weightKg.toFixed(1) : '—'}
          unit="kg"
          hint={view.weightKg != null ? `${weightDelta >= 0 ? '+' : ''}${weightDelta.toFixed(1)}kg desde início` : 'sem registos'}
          tone="gold"
          onClick={() => navigate('/peso')}
        />
        <StatCard
          icon={TrendingUp}
          label="Streak"
          value={view.streak}
          unit={view.streak === 1 ? 'dia' : 'dias'}
          hint="consecutivos a registar"
        />
      </div>

      {/* Progresso até alvo de peso */}
      {view.weightKg != null && (
        <div className="card">
          <div className="flex items-baseline justify-between mb-2">
            <span className="label">caminho até alvo</span>
            <span className="text-sm tabular-nums text-muted">
              {view.user.start_weight_kg}kg → <span className="text-gold-400 font-bold">{view.user.target_weight_kg}kg</span>
            </span>
          </div>
          <ProgressBar value={weightTargetPct} target={100} color="gold" />
          <p className="text-xs text-muted mt-2">{weightTargetPct.toFixed(0)}% do caminho</p>
        </div>
      )}
    </div>
  );
}
