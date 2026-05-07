import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Cookie, UtensilsCrossed, Milk, Plus, Search, Trash2, Zap, X, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ProgressBar from '@/components/ProgressBar';
import { getCurrentUser } from '@/lib/auth';
import { listFoods, getMealsForDay, totalsFromMeals, logMeal, deleteMealLog, addFood, logShakeLocked, SHAKE_LOCKED_FOODS } from '@/lib/repo';
import { todayISO } from '@/lib/utils';
import type { Food, MealLog, MealType, User } from '@/types';

const MEAL_LABELS: Record<MealType, { label: string; icon: typeof Coffee }> = {
  breakfast: { label: 'Pequeno-almoço', icon: Coffee },
  lunch:     { label: 'Almoço',         icon: UtensilsCrossed },
  snack:     { label: 'Snack',          icon: Cookie },
  dinner:    { label: 'Jantar',         icon: UtensilsCrossed },
  shake:     { label: 'Shake LOCKED',   icon: Milk },
};
const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'shake'];

export default function FoodPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [date] = useState(todayISO());
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Array<MealLog & { food: Food }>>([]);
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState<MealType | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async (u: User) => {
    const [fs, ms] = await Promise.all([listFoods(), getMealsForDay(u.id, date)]);
    setFoods(fs);
    setMeals(ms as Array<MealLog & { food: Food }>);
  }, [date]);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      await refresh(u);
      setLoading(false);
    })();
  }, [navigate, refresh]);

  const totals = useMemo(() => totalsFromMeals(meals), [meals]);
  const grouped = useMemo(() => {
    const m: Record<MealType, Array<MealLog & { food: Food }>> = { breakfast: [], lunch: [], snack: [], dinner: [], shake: [] };
    meals.forEach((x) => m[x.meal_type as MealType].push(x));
    return m;
  }, [meals]);

  if (loading || !user) return <><Header title="COMIDA" /><Loading /></>;

  return (
    <div className="px-5 max-w-md mx-auto space-y-4">
      <Header title="COMIDA" subtitle="hoje · bulk em curso" right={
        <button
          onClick={async () => {
            const n = await logShakeLocked(user.id, date);
            await refresh(user);
            if (n > 0) console.info(`+${n} ingredientes do shake LOCKED registados`);
          }}
          className="px-3 py-2 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 text-ink-900 font-bold text-xs uppercase tracking-wider shadow-gold active:scale-95 inline-flex items-center gap-1"
          title="Adiciona os 6 ingredientes do shake LOCKED de uma vez"
        >
          <Zap size={14} /> Shake
        </button>
      } />

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="label">totais hoje</span>
          <span className="text-xs text-muted ml-auto tabular-nums">{Math.round(totals.kcal)} kcal</span>
        </div>
        <ProgressBar value={totals.kcal} target={Number(user.target_calories)} label="kcal" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Macro tone="gold" label="Proteína" value={totals.protein_g} target={Number(user.target_protein)} unit="g" />
          <Macro tone="flame" label="Hidratos" value={totals.carbs_g} target={400} unit="g" />
          <Macro tone="cool" label="Gordura" value={totals.fat_g} target={100} unit="g" />
        </div>
      </div>

      {MEAL_ORDER.map((mt) => {
        const items = grouped[mt];
        const { label, icon: Icon } = MEAL_LABELS[mt];
        const sub = items.reduce((acc, x) => acc + Number(x.food.kcal) * Number(x.portion_multiplier), 0);
        return (
          <section key={mt} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon size={14} className={mt === 'shake' ? 'text-gold-400' : 'text-flame-400'} />
                <h2 className="font-display text-xl">{label}</h2>
              </div>
              <span className="text-xs text-muted tabular-nums">{Math.round(sub)} kcal</span>
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-muted">— ainda nada —</p>
            ) : (
              <ul className="space-y-1.5">
                {items.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-700/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{m.food.name}</p>
                      <p className="text-[11px] text-muted">
                        {Number(m.portion_multiplier) !== 1 && `${m.portion_multiplier}× · `}
                        {Math.round(Number(m.food.kcal) * Number(m.portion_multiplier))} kcal · {Math.round(Number(m.food.protein_g) * Number(m.portion_multiplier))}P
                      </p>
                    </div>
                    <button onClick={async () => { await deleteMealLog(m.id); await refresh(user); }}
                      className="p-2 text-muted hover:text-flame-400">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setPicker(mt)} className="mt-2 w-full btn-ghost !py-2 text-sm">
              <Plus size={14} /> adicionar a {label.toLowerCase()}
            </button>
          </section>
        );
      })}

      <AnimatePresence>
        {picker && (
          <FoodPicker
            mealType={picker}
            foods={foods}
            onClose={() => setPicker(null)}
            onPick={async (foodId, mult) => {
              await logMeal(user.id, date, picker, foodId, mult);
              setPicker(null);
              await refresh(user);
            }}
            onCreate={() => { setCreating(true); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {creating && (
          <CreateFood
            onClose={() => setCreating(false)}
            onCreated={async (f) => {
              setCreating(false);
              setFoods((prev) => [f, ...prev]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Macro({ label, value, target, unit, tone }: { label: string; value: number; target: number; unit: string; tone: 'flame' | 'gold' | 'cool' }) {
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0);
  const ring = tone === 'gold' ? 'text-gold-400' : tone === 'cool' ? 'text-sky-400' : 'text-flame-400';
  return (
    <div className="text-center">
      <p className="label">{label}</p>
      <p className={`stat-num !text-3xl ${ring}`}>{Math.round(value)}<span className="text-sm text-muted ml-0.5">{unit}</span></p>
      <p className="text-[10px] text-muted">{Math.round(pct)}%</p>
    </div>
  );
}

function FoodPicker({
  mealType, foods, onClose, onPick, onCreate,
}: {
  mealType: MealType;
  foods: Food[];
  onClose: () => void;
  onPick: (foodId: string, mult: number) => Promise<void>;
  onCreate: () => void;
}) {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<Food | null>(null);
  const [mult, setMult] = useState('1');

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return foods.filter((f) => f.name.toLowerCase().includes(t)).slice(0, 50);
  }, [q, foods]);

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
        className="card w-full max-w-md max-h-[80dvh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl">{MEAL_LABELS[mealType].label}</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>

        {!picked && (
          <>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input pl-10" placeholder="procurar alimento…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <ul className="overflow-y-auto flex-1 -mx-1 space-y-1.5">
              {filtered.map((f) => (
                <li key={f.id}>
                  <button onClick={() => setPicked(f)} className="w-full text-left px-3 py-2.5 rounded-xl bg-ink-700/50 active:scale-[0.99]">
                    <p className="font-semibold text-sm flex items-center gap-1.5">
                      {SHAKE_LOCKED_FOODS.includes(f.name) && <Lock size={11} className="text-gold-400" />}
                      {f.name}
                    </p>
                    <p className="text-[11px] text-muted">{f.kcal} kcal · {f.protein_g}P · {f.carbs_g}C · {f.fat_g}G {f.default_portion ? `· ${f.default_portion}` : ''}</p>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="text-muted text-sm text-center py-4">nada encontrado</li>}
            </ul>
            <button onClick={onCreate} className="btn-ghost mt-3 w-full"><Plus size={14} /> criar alimento novo</button>
          </>
        )}

        {picked && (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">{picked.name}</h4>
              <p className="text-xs text-muted">{picked.kcal} kcal · {picked.protein_g}g P · {picked.carbs_g}g C · {picked.fat_g}g G {picked.default_portion ? `· por ${picked.default_portion}` : ''}</p>
            </div>
            <div>
              <label className="label">Porção (multiplicador)</label>
              <div className="flex items-center gap-2 mt-1">
                {['0.5', '1', '1.5', '2'].map((p) => (
                  <button key={p} onClick={() => setMult(p)} className={`px-3 py-2 rounded-lg border text-sm font-bold ${mult === p ? 'border-flame-400 bg-flame-500/15 text-flame-400' : 'border-ink-500/60 bg-ink-700/50'}`}>
                    {p}×
                  </button>
                ))}
                <input type="number" inputMode="decimal" step="0.1" className="input flex-1" value={mult} onChange={(e) => setMult(e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-muted">total: <span className="text-white font-bold">{Math.round(Number(picked.kcal) * Number(mult || 0))} kcal</span></p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPicked(null)} className="btn-ghost">voltar</button>
              <button onClick={() => onPick(picked.id, Number(mult) || 1)} className="btn-primary"><Plus size={14} /> adicionar</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CreateFood({ onClose, onCreated }: { onClose: () => void; onCreated: (f: Food) => void }) {
  const [form, setForm] = useState({ name: '', kcal: '', protein_g: '', carbs_g: '', fat_g: '', default_portion: '', category: '' });
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
          <h3 className="font-display text-2xl">Novo alimento</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Nome</label><input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">kcal</label><input type="number" inputMode="decimal" className="input mt-1" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: e.target.value })} /></div>
            <div><label className="label">Porção</label><input className="input mt-1" placeholder="100g, 1 unid" value={form.default_portion} onChange={(e) => setForm({ ...form, default_portion: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="label">Prot.</label><input type="number" inputMode="decimal" className="input mt-1" value={form.protein_g} onChange={(e) => setForm({ ...form, protein_g: e.target.value })} /></div>
            <div><label className="label">Hidr.</label><input type="number" inputMode="decimal" className="input mt-1" value={form.carbs_g} onChange={(e) => setForm({ ...form, carbs_g: e.target.value })} /></div>
            <div><label className="label">Gord.</label><input type="number" inputMode="decimal" className="input mt-1" value={form.fat_g} onChange={(e) => setForm({ ...form, fat_g: e.target.value })} /></div>
          </div>
          <button
            disabled={busy || !form.name || !form.kcal}
            onClick={async () => {
              setBusy(true);
              try {
                const f = await addFood({
                  name: form.name,
                  category: form.category || null,
                  kcal: Number(form.kcal) || 0,
                  protein_g: Number(form.protein_g) || 0,
                  carbs_g: Number(form.carbs_g) || 0,
                  fat_g: Number(form.fat_g) || 0,
                  default_portion: form.default_portion || null,
                });
                onCreated(f);
              } finally { setBusy(false); }
            }}
            className="btn-primary w-full">
            <Plus size={14} /> {busy ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
