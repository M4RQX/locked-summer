import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Pencil, X, Search, Dumbbell, Save,
} from 'lucide-react';
import Loading from '@/components/Loading';
import { getCurrentUser } from '@/lib/auth';
import {
  listUserDayPlans, createDayPlan, updateDayPlan, deleteDayPlan, reorderDayPlans,
  addPlanExercise, updatePlanExercise, deletePlanExercise, reorderPlanExercises,
  type UserDayPlanWithExercises, type UserDayPlanExercise,
} from '@/lib/repo';
import { searchExercises, GROUP_LABELS, type Exercise } from '@/lib/exercises';
import type { User } from '@/types';

export default function PlanEditor() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<UserDayPlanWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserDayPlanWithExercises | null>(null);

  const refresh = useCallback(async (u: User) => {
    const p = await listUserDayPlans(u.id);
    setPlans(p);
    setEditing((prev) => prev ? (p.find((x) => x.id === prev.id) ?? null) : null);
  }, []);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      const p = await listUserDayPlans(u.id);
      setPlans(p);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading || !user) return <Loading />;

  return (
    <div className="px-5 md:px-8 max-w-md md:max-w-3xl mx-auto pb-24">
      <header className="pt-12 pb-3 flex items-center justify-between gap-2" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <button onClick={() => navigate('/treino')} className="p-2 rounded-xl bg-ink-700/60 border border-ink-500/60 active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="font-display text-3xl leading-none">PLANO</h1>
          <p className="text-xs text-muted uppercase tracking-widest">edita dias e exercícios</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="space-y-3 mt-4">
        {plans.length === 0 && (
          <div className="card text-center py-8">
            <Dumbbell className="mx-auto text-flame-400 mb-2" size={24} />
            <p className="text-muted text-sm">sem dias. cria o primeiro.</p>
          </div>
        )}
        {plans.map((p, idx) => (
          <DayCard
            key={p.id}
            plan={p}
            canMoveUp={idx > 0}
            canMoveDown={idx < plans.length - 1}
            onMove={async (dir) => {
              const newOrder = [...plans];
              const target = idx + (dir === 'up' ? -1 : 1);
              [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
              setPlans(newOrder);
              await reorderDayPlans(user.id, newOrder.map((x) => x.id));
              await refresh(user);
            }}
            onEdit={() => setEditing(p)}
            onDelete={async () => {
              if (!window.confirm(`Apagar dia "${p.code}: ${p.title}"? Treinos passados continuam no histórico.`)) return;
              await deleteDayPlan(p.id);
              await refresh(user);
            }}
          />
        ))}

        <CreateDayInline
          existingCodes={plans.map((p) => p.code.toLowerCase())}
          onCreate={async (code, title, subtitle) => {
            await createDayPlan(user.id, code, title, subtitle || undefined);
            await refresh(user);
          }}
        />
      </div>

      <AnimatePresence>
        {editing && (
          <DayDetailModal
            plan={editing}
            allPlanCodes={plans.filter((p) => p.id !== editing.id).map((p) => p.code.toLowerCase())}
            onClose={() => setEditing(null)}
            onSavedMeta={async (code, title, subtitle) => {
              await updateDayPlan(editing.id, code, title, subtitle);
              await refresh(user);
            }}
            onAddExercise={async (name, sets, reps) => {
              await addPlanExercise(editing.id, name, sets, reps);
              await refresh(user);
            }}
            onUpdateExercise={async (id, name, sets, reps) => {
              await updatePlanExercise(id, name, sets, reps);
              await refresh(user);
            }}
            onDeleteExercise={async (id) => {
              await deletePlanExercise(id);
              await refresh(user);
            }}
            onReorderExercises={async (ids) => {
              await reorderPlanExercises(editing.id, ids);
              await refresh(user);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Day card in list ----------
function DayCard({
  plan, canMoveUp, canMoveDown, onMove, onEdit, onDelete,
}: {
  plan: UserDayPlanWithExercises;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (dir: 'up' | 'down') => Promise<void>;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  return (
    <motion.div layout className="card">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-0.5">
          <button onClick={() => canMoveUp && onMove('up')} disabled={!canMoveUp}
            className="p-1 rounded text-muted hover:text-flame-400 disabled:opacity-30">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => canMoveDown && onMove('down')} disabled={!canMoveDown}
            className="p-1 rounded text-muted hover:text-flame-400 disabled:opacity-30">
            <ChevronDown size={14} />
          </button>
        </div>
        <button onClick={onEdit} className="flex-1 min-w-0 text-left">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-flame-400">{plan.code}</span>
            <h3 className="font-semibold truncate">{plan.title}</h3>
          </div>
          {plan.subtitle && <p className="text-xs text-muted truncate">{plan.subtitle}</p>}
          <p className="text-[11px] text-muted/70 mt-0.5">{plan.exercises.length} exercícios</p>
        </button>
        <div className="flex flex-col gap-1.5">
          <button onClick={onEdit} className="p-2 rounded-lg bg-flame-500/15 text-flame-400 active:scale-95">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg text-muted hover:text-flame-400 active:scale-95">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Inline create new day ----------
function CreateDayInline({
  existingCodes, onCreate,
}: {
  existingCodes: string[];
  onCreate: (code: string, title: string, subtitle: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-ghost w-full border-dashed">
        <Plus size={14} /> Novo dia
      </button>
    );
  }

  const codeConflict = code.trim() !== '' && existingCodes.includes(code.trim().toLowerCase());

  return (
    <div className="card-glow space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Novo dia</h3>
        <button onClick={() => { setOpen(false); setCode(''); setTitle(''); setSubtitle(''); }} className="p-1.5 rounded-lg bg-ink-700/60">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="label">Código</label>
          <input
            className="input mt-1 text-center font-display text-2xl !py-2"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="D"
            autoFocus
          />
        </div>
        <div className="col-span-2">
          <label className="label">Título</label>
          <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dia D" />
        </div>
      </div>
      <div>
        <label className="label">Subtítulo (grupo muscular)</label>
        <input className="input mt-1" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="ex: Peito + Tríceps" />
      </div>
      {codeConflict && <p className="text-xs text-flame-300">Já existe um dia com código "{code}".</p>}
      <button
        disabled={busy || !code.trim() || !title.trim() || codeConflict}
        onClick={async () => {
          setBusy(true);
          try {
            await onCreate(code.trim().toUpperCase(), title.trim(), subtitle.trim());
            setOpen(false); setCode(''); setTitle(''); setSubtitle('');
          } finally { setBusy(false); }
        }}
        className="btn-primary w-full"
      >
        <Plus size={14} /> {busy ? 'a criar…' : 'Criar dia'}
      </button>
    </div>
  );
}

// ---------- Day detail (edit metadata + exercises) ----------
function DayDetailModal({
  plan, allPlanCodes, onClose, onSavedMeta, onAddExercise, onUpdateExercise, onDeleteExercise, onReorderExercises,
}: {
  plan: UserDayPlanWithExercises;
  allPlanCodes: string[];
  onClose: () => void;
  onSavedMeta: (code: string, title: string, subtitle: string | null) => Promise<void>;
  onAddExercise: (name: string, sets: number, reps: string) => Promise<void>;
  onUpdateExercise: (id: string, name: string, sets: number, reps: string) => Promise<void>;
  onDeleteExercise: (id: string) => Promise<void>;
  onReorderExercises: (ids: string[]) => Promise<void>;
}) {
  const [code, setCode] = useState(plan.code);
  const [title, setTitle] = useState(plan.title);
  const [subtitle, setSubtitle] = useState(plan.subtitle ?? '');
  const [showPicker, setShowPicker] = useState(false);
  const [editingEx, setEditingEx] = useState<UserDayPlanExercise | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);

  const dirty = code !== plan.code || title !== plan.title || (subtitle ?? '') !== (plan.subtitle ?? '');
  const codeConflict = allPlanCodes.includes(code.trim().toLowerCase());

  async function saveMeta() {
    if (!dirty) return;
    if (codeConflict) {
      window.alert(`Código "${code}" já existe noutro dia.`);
      return;
    }
    setSavingMeta(true);
    try {
      await onSavedMeta(code.trim().toUpperCase(), title.trim(), subtitle.trim() || null);
    } finally { setSavingMeta(false); }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-end md:items-center justify-center px-3 pb-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md max-h-[90dvh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl">Editar dia</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="label">Código</label>
            <input
              className="input mt-1 text-center font-display text-2xl !py-2"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <div className="col-span-2">
            <label className="label">Título</label>
            <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="label">Subtítulo</label>
          <input className="input mt-1" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="grupo muscular" />
        </div>
        {dirty && (
          <button onClick={saveMeta} disabled={savingMeta || codeConflict} className="btn-gold mb-3 !py-2 text-sm">
            <Save size={13} /> {savingMeta ? 'a guardar…' : codeConflict ? `Código "${code}" já existe` : 'Guardar alterações ao dia'}
          </button>
        )}

        <div className="flex items-center justify-between mb-2 mt-2">
          <h4 className="label">exercícios ({plan.exercises.length})</h4>
          <button onClick={() => setShowPicker(true)} className="btn-primary !py-1.5 !text-xs">
            <Plus size={12} /> adicionar
          </button>
        </div>

        <ul className="overflow-y-auto flex-1 -mx-1 space-y-1.5">
          {plan.exercises.length === 0 && (
            <li className="text-center text-muted text-sm py-4">— sem exercícios —</li>
          )}
          {plan.exercises.map((ex, i) => (
            <li key={ex.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-700/50">
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={i === 0}
                  onClick={async () => {
                    const arr = [...plan.exercises];
                    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                    await onReorderExercises(arr.map((x) => x.id));
                  }}
                  className="p-0.5 text-muted hover:text-flame-400 disabled:opacity-30"
                ><ChevronUp size={12} /></button>
                <button
                  disabled={i === plan.exercises.length - 1}
                  onClick={async () => {
                    const arr = [...plan.exercises];
                    [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                    await onReorderExercises(arr.map((x) => x.id));
                  }}
                  className="p-0.5 text-muted hover:text-flame-400 disabled:opacity-30"
                ><ChevronDown size={12} /></button>
              </div>
              <button onClick={() => setEditingEx(ex)} className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm truncate">{ex.exercise_name}</p>
                <p className="text-[11px] text-muted">{ex.target_sets} × {ex.target_reps}</p>
              </button>
              <button onClick={() => onDeleteExercise(ex.id)} className="p-1.5 text-muted hover:text-flame-400">
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {showPicker && (
            <ExercisePicker
              existingNames={new Set(plan.exercises.map((e) => e.exercise_name.toLowerCase()))}
              onClose={() => setShowPicker(false)}
              onPick={async (name, sets, reps) => {
                await onAddExercise(name, sets, reps);
                setShowPicker(false);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingEx && (
            <EditExerciseModal
              exercise={editingEx}
              onClose={() => setEditingEx(null)}
              onSave={async (name, sets, reps) => {
                await onUpdateExercise(editingEx.id, name, sets, reps);
                setEditingEx(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ---------- Exercise picker (search + sets/reps) ----------
function ExercisePicker({
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

  const results = useMemo(() => searchExercises(q, 50), [q]);
  const showCustom = q.trim().length >= 3 && results.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur flex items-end justify-center px-3 pb-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md max-h-[85dvh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl flex items-center gap-2">
            <Dumbbell size={18} className="text-flame-400" /> Adicionar exercício
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>

        {!picked && (
          <>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input pl-10" placeholder="ex: supino, lat, agachamento…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
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
                      {already && <p className="text-[10px] text-muted">já está no plano</p>}
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && q.trim().length === 0 && (
                <li className="text-muted text-sm text-center py-4">começa a escrever…</li>
              )}
              {showCustom && (
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
            <SetsReps sets={sets} setSets={setSets} reps={reps} setReps={setReps} />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setPicked(null); setCustomName(''); }} className="btn-ghost">voltar</button>
              <button
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const s = Math.max(1, Math.min(20, Number(sets) || 3));
                    await onPick(customName || picked.name, s, reps || '8-12');
                  } finally { setBusy(false); }
                }}
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

// ---------- Edit existing exercise ----------
function EditExerciseModal({
  exercise, onClose, onSave,
}: {
  exercise: UserDayPlanExercise;
  onClose: () => void;
  onSave: (name: string, sets: number, reps: string) => Promise<void>;
}) {
  const [name, setName] = useState(exercise.exercise_name);
  const [sets, setSets] = useState(String(exercise.target_sets));
  const [reps, setReps] = useState(exercise.target_reps);
  const [busy, setBusy] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur flex items-end justify-center px-3 pb-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl">Editar exercício</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Nome</label>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <SetsReps sets={sets} setSets={setSets} reps={reps} setReps={setReps} />
          <button
            disabled={busy || !name.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                const s = Math.max(1, Math.min(20, Number(sets) || 3));
                await onSave(name.trim(), s, reps || '8-12');
              } finally { setBusy(false); }
            }}
            className="btn-primary w-full"
          >
            <Save size={14} /> {busy ? 'a guardar…' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Shared sets/reps input
function SetsReps({ sets, setSets, reps, setReps }: { sets: string; setSets: (v: string) => void; reps: string; setReps: (v: string) => void }) {
  return (
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
  );
}
