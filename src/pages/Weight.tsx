import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, Scale, Target, X } from 'lucide-react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import ProgressBar from '@/components/ProgressBar';
import { getCurrentUser } from '@/lib/auth';
import { listWeights, logWeight } from '@/lib/repo';
import { fmtDate, todayISO } from '@/lib/utils';
import type { User, WeightLog } from '@/types';

export default function WeightPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  async function refresh(u: User) {
    setLogs(await listWeights(u.id));
  }

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      await refresh(u);
      setLoading(false);
    })();
  }, [navigate]);

  const chartData = useMemo(() =>
    logs.map((l) => ({ date: l.date, kg: Number(l.weight_kg), bf: l.body_fat_pct ? Number(l.body_fat_pct) : null }))
  , [logs]);

  const stats = useMemo(() => {
    if (logs.length === 0) return null;
    const last = Number(logs[logs.length - 1].weight_kg);
    const first = Number(logs[0].weight_kg);
    const totalDelta = last - first;
    const wkAgo = logs.length >= 2 ? Number(logs[logs.length - 2].weight_kg) : last;
    const weeklyDelta = last - wkAgo;
    const last4 = logs.slice(-4);
    const avg4 = last4.reduce((a, b) => a + Number(b.weight_kg), 0) / last4.length;
    return { last, first, totalDelta, weeklyDelta, avg4 };
  }, [logs]);

  if (loading || !user) return <><Header title="PESO" /><Loading /></>;

  const targetPct = stats
    ? Math.min(100, Math.max(0, ((stats.last - Number(user.start_weight_kg)) / (Number(user.target_weight_kg) - Number(user.start_weight_kg))) * 100))
    : 0;

  return (
    <div className="px-5 max-w-md mx-auto space-y-4">
      <Header title="PESO" subtitle="domingo, em jejum" right={
        <button onClick={() => setShowAdd(true)} className="p-2 rounded-xl bg-flame-500/15 border border-flame-400/40 text-flame-400 active:scale-95">
          <Plus size={18} />
        </button>
      } />

      {logs.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="Sem registos"
          description="Regista o teu primeiro peso para começar a ver a evolução."
          action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus size={14} /> Registar peso</button>}
        />
      ) : (
        <>
          <div className="card">
            <div className="flex items-baseline gap-3">
              <div className="flex-1">
                <span className="label">atual</span>
                <p className="stat-num text-flame-400">{stats!.last.toFixed(1)}<span className="text-base text-muted ml-1">kg</span></p>
              </div>
              <div className="text-right">
                <p className="label">semana</p>
                <p className={`text-xl font-bold tabular-nums ${stats!.weeklyDelta > 0 ? 'text-emerald-400' : stats!.weeklyDelta < 0 ? 'text-flame-400' : 'text-muted'}`}>
                  {stats!.weeklyDelta > 0 ? '+' : ''}{stats!.weeklyDelta.toFixed(1)} kg
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <Tile label="início" value={`${stats!.first.toFixed(1)} kg`} />
              <Tile label="média 4s" value={`${stats!.avg4.toFixed(1)} kg`} />
              <Tile label="total" value={`${stats!.totalDelta > 0 ? '+' : ''}${stats!.totalDelta.toFixed(1)} kg`} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-gold-400" />
              <span className="label">caminho até alvo</span>
              <span className="ml-auto text-xs tabular-nums text-muted">{user.start_weight_kg} → <span className="text-gold-400 font-bold">{user.target_weight_kg}</span> kg</span>
            </div>
            <ProgressBar value={targetPct} target={100} color="gold" />
            <p className="text-xs text-muted mt-2">{targetPct.toFixed(0)}% feito</p>
          </div>

          <div className="card">
            <h3 className="label mb-2">evolução</h3>
            <div className="h-56 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#242424" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#888" fontSize={10} tickFormatter={(d) => fmtDate(d, 'd MMM')} />
                  <YAxis stroke="#888" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{ background: '#121212', border: '1px solid #2e2e2e', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="kg" stroke="#FF6B35" strokeWidth={2.5} dot={{ r: 3, fill: '#FF6B35' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <section>
            <h3 className="label px-1 mb-2">histórico</h3>
            <ul className="space-y-1.5">
              {[...logs].reverse().map((l) => (
                <li key={l.id} className="card !p-3 flex items-center gap-3">
                  <div className="w-12 text-center">
                    <p className="font-display text-2xl leading-none">{Number(l.weight_kg).toFixed(1)}</p>
                    <p className="text-[10px] text-muted">kg</p>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{fmtDate(l.date)}</p>
                    {(l.body_fat_pct != null || l.muscle_pct != null) && (
                      <p className="text-xs text-muted">
                        {l.body_fat_pct != null && <>BF {l.body_fat_pct}% </>}
                        {l.muscle_pct != null && <>· Mass {l.muscle_pct}%</>}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {showAdd && <AddWeight user={user} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); refresh(user); }} />}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-700/50 rounded-lg p-2 text-center">
      <p className="text-[10px] text-muted uppercase tracking-wider">{label}</p>
      <p className="font-bold tabular-nums">{value}</p>
    </div>
  );
}

function AddWeight({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState('');
  const [bf, setBf] = useState('');
  const [mass, setMass] = useState('');
  const [busy, setBusy] = useState(false);
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
        className="card w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl">Registar peso</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Data</label><input type="date" className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="label">Peso (kg)</label><input type="number" inputMode="decimal" step="0.1" className="input mt-1 text-2xl text-center font-bold" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75.5" autoFocus /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">% Gordura (opcional)</label><input type="number" inputMode="decimal" step="0.1" className="input mt-1" value={bf} onChange={(e) => setBf(e.target.value)} placeholder="15.0" /></div>
            <div><label className="label">% Massa (opcional)</label><input type="number" inputMode="decimal" step="0.1" className="input mt-1" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="42.0" /></div>
          </div>
          <button
            disabled={busy || !weight}
            onClick={async () => {
              setBusy(true);
              try {
                await logWeight(
                  user.id, date, Number(weight),
                  bf ? Number(bf) : undefined,
                  mass ? Number(mass) : undefined,
                );
                onSaved();
              } finally { setBusy(false); }
            }}
            className="btn-gold w-full"
          >
            <Scale size={16} /> {busy ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
