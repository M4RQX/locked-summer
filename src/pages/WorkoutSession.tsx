import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Flame, Plus, Trash2, History as HistoryIcon, Trophy, X, Search, Dumbbell, Info } from 'lucide-react';
import Loading from '@/components/Loading';
import ExerciseDemoModal from '@/components/ExerciseDemoModal';
import { getCurrentUser } from '@/lib/auth';
import {
  getWorkout, getWorkoutSets, logSet, deleteSet, finishWorkout, getExerciseHistory,
  listCustomExercises, addCustomExercise, deleteCustomExercise, updateCustomExercise,
  getDayPlanByCode, type CustomExercise, type UserDayPlanWithExercises,
} from '@/lib/repo';
import { searchExercises, GROUP_LABELS, type Exercise } from '@/lib/exercises';
import { fmtDate } from '@/lib/utils';
import type { ExercisePlan, User, Workout, WorkoutSet } from '@/types';

export default function WorkoutSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [plan, setPlan] = useState<UserDayPlanWithExercises | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [customs, setCustoms] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinish, setShowFinish] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [demoOpen, setDemoOpen] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<Record<string, Array<{ date: string; weight_kg: number; reps: number }>>>({});
  const [openHistory, setOpenHistory] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    const [w, s, c] = await Promise.all([getWorkout(id), getWorkoutSets(id), listCustomExercises(id)]);
    setWorkout(w);
    setSets(s);
    setCustoms(c);
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

  // Load the user's plan for the workout's day_code (DB-backed, edits reflect here on revisit)
  useEffect(() => {
    if (!user || !workout) return;
    let cancelled = false;
    getDayPlanByCode(user.id, workout.day_type).then((p) => {
      if (!cancelled) setPlan(p);
    });
    return () => { cancelled = true; };
  }, [user, workout]);

  // Load history on demand per exercise (plan + custom)
  useEffect(() => {
    if (!user || !plan) return;
    const all = [
      ...plan.exercises.map((e) => e.exercise_name),
      ...customs.map((c) => c.exercise_name),
    ];
    all.forEach(async (name) => {
      if (history[name]) return;
      const h = await getExerciseHistory(user.id, name, 6);
      setHistory((prev) => ({ ...prev, [name]: h }));
    });
  }, [user, plan, customs, history]);

  const setsByExercise = useMemo(() => {
    const map: Record<string, WorkoutSet[]> = {};
    for (const s of sets) (map[s.exercise_name] ??= []).push(s);
    return map;
  }, [sets]);

  if (loading || !workout || !user) return <Loading />;
  if (workout.user_id !== user.id) {
    return <div className="p-6 text-muted">Não tens acesso a este treino.</div>;
  }
  // plan may be null if user deleted it after starting workout — render with empty plan exercises
  const planExercises = plan?.exercises ?? [];
  const subtitleText = plan?.subtitle ?? plan?.title ?? '';

  return (
    <div className="px-5 md:px-8 max-w-md md:max-w-3xl xl:max-w-4xl mx-auto pb-24">
      <header className="pt-12 pb-3 flex items-center justify-between gap-2" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-ink-700/60 border border-ink-500/60 active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="font-display text-3xl leading-none">DIA {workout.day_type}</h1>
          <p className="text-xs text-muted uppercase tracking-widest">{subtitleText} · {fmtDate(workout.date, 'd MMM')}</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="space-y-3">
        {planExercises.map((ex) => {
          const adapted: ExercisePlan = { name: ex.exercise_name, sets: ex.target_sets, reps: ex.target_reps };
          return (
            <ExerciseBlock
              key={ex.id}
              exercise={adapted}
              sets={setsByExercise[ex.exercise_name] ?? []}
              history={history[ex.exercise_name] ?? []}
              historyOpen={openHistory === ex.exercise_name}
              onShowDemo={() => setDemoOpen(ex.exercise_name)}
              onToggleHistory={() => setOpenHistory(openHistory === ex.exercise_name ? null : ex.exercise_name)}
              onAdd={async (weight, reps) => {
                const next = (setsByExercise[ex.exercise_name]?.length ?? 0) + 1;
                await logSet(workout.id, ex.exercise_name, next, weight, reps);
                await refresh();
              }}
              onDelete={async (setId) => { await deleteSet(setId); refresh(); }}
            />
          );
        })}

        {customs.map((c) => (
          <ExerciseBlock
            key={c.id}
            exercise={{ name: c.exercise_name, sets: c.target_sets, reps: c.target_reps }}
            sets={setsByExercise[c.exercise_name] ?? []}
            history={history[c.exercise_name] ?? []}
            historyOpen={openHistory === c.exercise_name}
            isCustom
            onShowDemo={() => setDemoOpen(c.exercise_name)}
            onToggleHistory={() => setOpenHistory(openHistory === c.exercise_name ? null : c.exercise_name)}
            onAdd={async (weight, reps) => {
              const next = (setsByExercise[c.exercise_name]?.length ?? 0) + 1;
              await logSet(workout.id, c.exercise_name, next, weight, reps);
              await refresh();
            }}
            onDelete={async (setId) => { await deleteSet(setId); refresh(); }}
            onUpdateTarget={async (setsT, repsT) => {
              await updateCustomExercise(c.id, setsT, repsT);
              await refresh();
            }}
            onRemoveExercise={async () => {
              if (!window.confirm(`Remover "${c.exercise_name}" do treino? As séries já registadas mantêm-se no histórico.`)) return;
              await deleteCustomExercise(c.id);
              await refresh();
            }}
          />
        ))}

        {!workout.completed_at && (
          <button
            onClick={() => setShowAdd(true)}
            className="btn-ghost w-full text-sm border-dashed"
          >
            <Plus size={14} /> Adicionar exercício
          </button>
        )}
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

      <AnimatePresence>
        {demoOpen && (
          <ExerciseDemoModal exerciseName={demoOpen} onClose={() => setDemoOpen(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <AddExerciseModal
            existingNames={new Set([
              ...planExercises.map((e) => e.exercise_name.toLowerCase()),
              ...customs.map((c) => c.exercise_name.toLowerCase()),
            ])}
            onClose={() => setShowAdd(false)}
            onPick={async (name, sets, reps) => {
              await addCustomExercise(workout.id, name, sets, reps);
              setShowAdd(false);
              await refresh();
            }}
          />
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
  isCustom?: boolean;
  onShowDemo?: () => void;
  onToggleHistory: () => void;
  onAdd: (weight: number, reps: number) => Promise<void>;
  onDelete: (setId: string) => Promise<void>;
  onUpdateTarget?: (targetSets: number, targetReps: string) => Promise<void>;
  onRemoveExercise?: () => Promise<void>;
}

function ExerciseBlock({ exercise, sets, history, historyOpen, isCustom, onShowDemo, onToggleHistory, onAdd, onDelete, onUpdateTarget, onRemoveExercise }: BlockProps) {
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
    <div className={`card ${isCustom ? 'border-flame-400/30' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight flex items-center gap-1.5">
            {exercise.name}
            {isCustom && <span className="pill bg-flame-500/15 text-flame-400 text-[9px]">extra</span>}
          </h3>
          <button
            onClick={() => {
              if (!onUpdateTarget) return;
              const ns = window.prompt(`Séries para "${exercise.name}":`, String(exercise.sets));
              if (!ns) return;
              const nr = window.prompt(`Reps para "${exercise.name}":`, exercise.reps);
              if (!nr) return;
              const setsN = Math.max(1, Math.min(20, Number(ns) || exercise.sets));
              onUpdateTarget(setsN, nr);
            }}
            className={`text-xs text-muted mt-0.5 ${onUpdateTarget ? 'hover:text-flame-400 cursor-pointer' : 'cursor-default'}`}
            disabled={!onUpdateTarget}
          >
            alvo: <span className="text-white/80 font-semibold">{exercise.sets} × {exercise.reps}</span>
            {onUpdateTarget && <span className="ml-1 text-muted/60">✎</span>}
          </button>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onShowDemo && (
            <button onClick={onShowDemo} className="p-1.5 rounded-lg text-muted hover:text-flame-400" title="Como fazer">
              <Info size={14} />
            </button>
          )}
          <span className={`pill ${done >= targetSets ? 'bg-gold-500/20 text-gold-400' : 'bg-ink-700 text-muted'}`}>
            {done}/{targetSets}
          </span>
          {onRemoveExercise && (
            <button onClick={onRemoveExercise} className="p-1.5 rounded-lg text-muted hover:text-flame-400" title="Remover do treino">
              <Trash2 size={13} />
            </button>
          )}
        </div>
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

function AddExerciseModal({
  existingNames, onClose, onPick,
}: {
  existingNames: Set<string>;
  onClose: () => void;
  onPick: (name: string, sets: number, reps: string) => Promise<void>;
}) {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<Exercise | null>(null);
  const [customName, setCustomName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('8-12');
  const [busy, setBusy] = useState(false);

  const hasQuery = q.trim().length > 0;
  const results = useMemo(() => hasQuery ? searchExercises(q, 50) : [], [q, hasQuery]);
  const showCustomFallback = q.trim().length >= 3 && results.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-end justify-center px-3 pb-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md max-h-[85dvh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-2xl flex items-center gap-2">
              <Dumbbell size={18} className="text-flame-400" /> Adicionar exercício
            </h3>
            <p className="text-[11px] text-muted uppercase tracking-wider">escreve, escolhe e vai</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>

        {!picked && (
          <>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="input pl-10"
                placeholder="ex: supino, lat, agachamento, curl…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoFocus
              />
            </div>
            <ul className="overflow-y-auto flex-1 -mx-1 space-y-1.5">
              {results.map((e) => {
                const already = existingNames.has(e.name.toLowerCase());
                return (
                  <li key={e.name}>
                    <button
                      disabled={already}
                      onClick={() => setPicked(e)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl active:scale-[0.99] ${already ? 'bg-ink-700/30 opacity-50' : 'bg-ink-700/50'}`}
                    >
                      <p className="font-semibold text-sm flex items-center justify-between gap-2">
                        <span className="truncate">{e.name}</span>
                        <span className="pill bg-ink-800 text-flame-300/80 text-[10px]">{GROUP_LABELS[e.group]}</span>
                      </p>
                      {already && <p className="text-[10px] text-muted">já está no treino</p>}
                    </button>
                  </li>
                );
              })}
              {!hasQuery && (
                <li className="flex flex-col items-center text-center py-8 px-4 gap-2">
                  <Search size={28} className="text-flame-400/60" />
                  <p className="text-sm font-semibold">Procura um exercício</p>
                  <p className="text-xs text-muted">Catálogo com 200+ exercícios. Tenta "supino", "lat", "agachamento", "rosca", "pernas", "peito"…</p>
                </li>
              )}
              {showCustomFallback && (
                <li className="card !p-3 mt-2 border-dashed border-flame-400/30">
                  <p className="text-xs text-muted mb-2">Não encontrei "{q}". Adiciona como exercício novo:</p>
                  <button
                    onClick={() => { setCustomName(q.trim()); setPicked({ name: q.trim(), group: 'funcional' }); }}
                    className="btn-primary w-full"
                  >
                    <Plus size={14} /> usar "{q}"
                  </button>
                </li>
              )}
            </ul>
          </>
        )}

        {picked && (
          <div className="space-y-3">
            <div className="card !p-3 bg-flame-500/5 border-flame-400/30">
              <p className="font-semibold">{customName || picked.name}</p>
              <p className="text-[11px] text-muted uppercase tracking-wider">{GROUP_LABELS[picked.group]}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Séries</label>
                <div className="flex items-center gap-1 mt-1">
                  {['3', '4', '5'].map((n) => (
                    <button key={n} onClick={() => setSets(n)} className={`flex-1 py-2 rounded-lg border text-sm font-bold ${sets === n ? 'border-flame-400 bg-flame-500/15 text-flame-400' : 'border-ink-500/60 bg-ink-700/50'}`}>
                      {n}
                    </button>
                  ))}
                  <input type="number" inputMode="numeric" className="input !py-2 w-16 text-center" value={sets} onChange={(e) => setSets(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Reps</label>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {['6-8', '8-12', '12-15'].map((n) => (
                    <button key={n} onClick={() => setReps(n)} className={`flex-1 py-2 rounded-lg border text-xs font-bold ${reps === n ? 'border-flame-400 bg-flame-500/15 text-flame-400' : 'border-ink-500/60 bg-ink-700/50'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <input className="input !py-2 mt-1 text-center text-sm" value={reps} onChange={(e) => setReps(e.target.value)} placeholder='ex: "8-12", "5×5", "30s"' />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setPicked(null); setCustomName(''); }} className="btn-ghost">voltar</button>
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    const setsN = Math.max(1, Math.min(20, Number(sets) || 3));
                    await onPick(customName || picked.name, setsN, reps || '8-12');
                  } finally { setBusy(false); }
                }}
                disabled={busy}
                className="btn-primary"
              >
                <Plus size={14} /> {busy ? 'a adicionar…' : 'adicionar'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
