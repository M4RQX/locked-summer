import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Flame, Plus, Trash2, History as HistoryIcon, Trophy, X } from 'lucide-react';
import Loading from '@/components/Loading';
import { getCurrentUser } from '@/lib/auth';
import { getWorkout, getWorkoutSets, logSet, deleteSet, finishWorkout, getExerciseHistory } from '@/lib/repo';
import { getPlan } from '@/lib/plans';
import { fmtDate } from '@/lib/utils';
import type { ExercisePlan, User, Workout, WorkoutSet } from '@/types';

export default function WorkoutSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinish, setShowFinish] = useState(false);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<Record<string, Array<{ date: string; weight_kg: number; reps: number }>>>({});
  const [openHistory, setOpenHistory] = useState<string | null>(null);

  const plan = workout ? getPlan(workout.day_type) : null;

  const refresh = useCallback(async () => {
    if (!id) return;
    const [w, s] = await Promise.all([getWorkout(id), getWorkoutSets(id)]);
    setWorkout(w);
    setSets(s);
  }, [id]);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      await refresh();
      setLoading(false);
    })();
  }, [navigate, refresh]);

  // Load history on demand per exercise
  useEffect(() => {
    if (!user || !plan) return;
    plan.exercises.forEach(async (ex) => {
      if (history[ex.name]) return;
      const h = await getExerciseHistory(user.id, ex.name, 6);
      setHistory((prev) => ({ ...prev, [ex.name]: h }));
    });
  }, [user, plan, history]);

  const setsByExercise = useMemo(() => {
    const map: Record<string, WorkoutSet[]> = {};
    for (const s of sets) (map[s.exercise_name] ??= []).push(s);
    return map;
  }, [sets]);

  if (loading || !workout || !plan || !user) return <Loading />;
  if (workout.user_id !== user.id) {
    return <div className="p-6 text-muted">Não tens acesso a este treino.</div>;
  }

  return (
    <div className="px-5 max-w-md mx-auto pb-24">
      <header className="pt-12 pb-3 flex items-center justify-between gap-2" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-ink-700/60 border border-ink-500/60 active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="font-display text-3xl leading-none">DIA {workout.day_type}</h1>
          <p className="text-xs text-muted uppercase tracking-widest">{plan.subtitle} · {fmtDate(workout.date, 'd MMM')}</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="space-y-3">
        {plan.exercises.map((ex) => (
          <ExerciseBlock
            key={ex.name}
            exercise={ex}
            sets={setsByExercise[ex.name] ?? []}
            history={history[ex.name] ?? []}
            historyOpen={openHistory === ex.name}
            onToggleHistory={() => setOpenHistory(openHistory === ex.name ? null : ex.name)}
            onAdd={async (weight, reps) => {
              const next = (setsByExercise[ex.name]?.length ?? 0) + 1;
              await logSet(workout.id, ex.name, next, weight, reps);
              await refresh();
            }}
            onDelete={async (setId) => { await deleteSet(setId); refresh(); }}
          />
        ))}
      </div>

      <div className="mt-6">
        {workout.completed_at ? (
          <div className="card flex items-center gap-2 text-gold-400 justify-center font-semibold">
            <Trophy size={18} /> Treino concluído · {workout.duration_minutes ?? '-'}min
          </div>
        ) : (
          <button onClick={() => setShowFinish(true)} className="btn-primary w-full text-base py-4">
            <Check size={18} /> Concluir treino
          </button>
        )}
      </div>

      <AnimatePresence>
        {showFinish && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-end md:items-center justify-center px-4 pb-6"
            onClick={() => setShowFinish(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="card-glow w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-2xl">Concluir treino</h3>
                <button onClick={() => setShowFinish(false)} className="p-1.5 rounded-lg bg-ink-700/60"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="label">Duração (min)</label>
                  <input type="number" inputMode="numeric" className="input mt-1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
                </div>
                <div>
                  <label className="label">Notas</label>
                  <textarea className="input mt-1 min-h-20 resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder='ex: "fui-me abaixo no supino"' />
                </div>
                <button
                  className="btn-gold w-full text-base py-3"
                  onClick={async () => {
                    await finishWorkout(workout.id, Number(duration) || 0, notes);
                    setShowFinish(false);
                    await refresh();
                  }}
                >
                  <Flame size={16} /> LOCKED
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface BlockProps {
  exercise: ExercisePlan;
  sets: WorkoutSet[];
  history: Array<{ date: string; weight_kg: number; reps: number }>;
  historyOpen: boolean;
  onToggleHistory: () => void;
  onAdd: (weight: number, reps: number) => Promise<void>;
  onDelete: (setId: string) => Promise<void>;
}

function ExerciseBlock({ exercise, sets, history, historyOpen, onToggleHistory, onAdd, onDelete }: BlockProps) {
  const [w, setW] = useState('');
  const [r, setR] = useState('');
  const [busy, setBusy] = useState(false);
  const targetSets = exercise.sets;
  const done = sets.length;

  // suggest last weight as default
  const lastWeight = sets[sets.length - 1]?.weight_kg ?? history[0]?.weight_kg;

  async function add() {
    const wn = Number(w);
    const rn = Number(r);
    if (!wn || !rn) return;
    setBusy(true);
    try {
      await onAdd(wn, rn);
      setW('');
      setR('');
    } finally { setBusy(false); }
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{exercise.name}</h3>
          <p className="text-xs text-muted mt-0.5">
            alvo: <span className="text-white/80 font-semibold">{exercise.sets} × {exercise.reps}</span>
          </p>
        </div>
        <span className={`pill ${done >= targetSets ? 'bg-gold-500/20 text-gold-400' : 'bg-ink-700 text-muted'}`}>
          {done}/{targetSets}
        </span>
      </div>

      {sets.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {sets.map((s) => (
            <li key={s.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${s.is_pr ? 'bg-gold-500/10 border border-gold-500/40 pr-glow' : 'bg-ink-700/50'}`}>
              <span className="font-mono text-xs text-muted w-6">#{s.set_number}</span>
              <span className="font-semibold tabular-nums">{Number(s.weight_kg).toFixed(1).replace('.0', '')} kg</span>
              <span className="text-muted">·</span>
              <span className="font-semibold tabular-nums">{s.reps}</span>
              <span className="text-muted text-xs">reps</span>
              {s.is_pr && (
                <span className="ml-auto pill bg-gold-500 text-ink-900 flex items-center gap-1">
                  <Trophy size={10} /> PR
                </span>
              )}
              <button onClick={() => onDelete(s.id)} className="ml-auto p-1.5 text-muted hover:text-flame-400">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Quick add */}
      <div className="mt-3 grid grid-cols-[1fr,1fr,auto] gap-2">
        <input
          type="number" inputMode="decimal" step="0.5"
          className="input !py-2.5 text-center font-semibold"
          value={w} onChange={(e) => setW(e.target.value)}
          placeholder={lastWeight != null ? `${Number(lastWeight)}kg` : 'kg'}
        />
        <input
          type="number" inputMode="numeric"
          className="input !py-2.5 text-center font-semibold"
          value={r} onChange={(e) => setR(e.target.value)}
          placeholder="reps"
        />
        <button onClick={add} disabled={busy || !w || !r} className="btn-primary !py-2.5 px-4">
          <Plus size={16} />
        </button>
      </div>

      {/* History toggle */}
      <button onClick={onToggleHistory} className="mt-2 flex items-center gap-1.5 text-[11px] text-muted uppercase tracking-wider font-bold hover:text-flame-400">
        <HistoryIcon size={11} /> {historyOpen ? 'esconder' : 'histórico'} ({history.length})
      </button>
      <AnimatePresence>
        {historyOpen && history.length > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 space-y-1"
          >
            {history.map((h, i) => (
              <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-700/40 text-sm">
                <span className="text-muted text-xs w-20">{fmtDate(h.date, 'd MMM')}</span>
                <span className="tabular-nums font-semibold">{Number(h.weight_kg)}kg</span>
                <span className="text-muted">·</span>
                <span className="tabular-nums">{h.reps} reps</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
