import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Target, Settings as SettingsIcon, Info, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { sql } from '@/lib/db';
import Loading from '@/components/Loading';
import type { User } from '@/types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tc, setTc] = useState('');
  const [tp, setTp] = useState('');
  const [tw, setTw] = useState('');
  const [sw, setSw] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      setTc(String(u.target_calories));
      setTp(String(u.target_protein));
      setTw(String(u.target_weight_kg));
      setSw(String(u.start_weight_kg));
    })();
  }, [navigate]);

  async function save() {
    if (!user) return;
    setBusy(true);
    try {
      await sql`update users set
        target_calories = ${Number(tc)},
        target_protein = ${Number(tp)},
        target_weight_kg = ${Number(tw)},
        start_weight_kg = ${Number(sw)}
        where id = ${user.id}`;
      setSaved(true); setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  if (!user) return <Loading />;

  return (
    <div className="px-5 max-w-md mx-auto pb-10">
      <header className="pt-12 pb-3 flex items-center gap-2" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-ink-700/60 border border-ink-500/60 active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-3xl flex items-center gap-2"><SettingsIcon size={20} /> Definições</h1>
      </header>

      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-gold-400" />
          <h2 className="label">objetivos</h2>
        </div>
        <div>
          <label className="label">Calorias diárias (kcal)</label>
          <input type="number" inputMode="numeric" className="input mt-1" value={tc} onChange={(e) => setTc(e.target.value)} />
        </div>
        <div>
          <label className="label">Proteína diária (g)</label>
          <input type="number" inputMode="numeric" className="input mt-1" value={tp} onChange={(e) => setTp(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Peso início (kg)</label>
            <input type="number" inputMode="decimal" step="0.1" className="input mt-1" value={sw} onChange={(e) => setSw(e.target.value)} />
          </div>
          <div>
            <label className="label">Alvo (kg)</label>
            <input type="number" inputMode="decimal" step="0.1" className="input mt-1" value={tw} onChange={(e) => setTw(e.target.value)} />
          </div>
        </div>
        <button onClick={save} disabled={busy} className={`w-full ${saved ? 'btn-gold' : 'btn-primary'}`}>
          {saved ? '✓ Guardado' : busy ? 'A guardar…' : 'Guardar objetivos'}
        </button>
      </section>

      <section className="card mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-muted" />
          <h2 className="label">conta</h2>
        </div>
        <p className="text-sm">
          Ligado como <span className="font-bold text-flame-400">{user.name}</span>
        </p>
        <button onClick={() => { logout(); navigate('/login', { replace: true }); }} className="btn-ghost w-full mt-2 text-flame-300">
          <LogOut size={14} /> Sair (logout)
        </button>
      </section>

      <p className="text-center text-[10px] text-muted mt-6 uppercase tracking-[0.3em]">🔒☀️ locked summer · v0.1</p>
    </div>
  );
}
