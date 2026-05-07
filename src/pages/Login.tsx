import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ChevronDown, Lock, Loader2 } from 'lucide-react';
import { listUserNames, login, getSession } from '@/lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate('/', { replace: true });
    listUserNames().then((ns) => {
      setUsers(ns);
      setName((prev) => prev || ns[0] || '');
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const u = await login(name, password);
      if (!u) {
        setErr('Password errada. Tenta outra vez.');
      } else {
        navigate('/', { replace: true });
      }
    } catch (e: unknown) {
      console.error(e);
      setErr('Erro de ligação à base de dados. Verifica o secret VITE_DATABASE_URL.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* sunset glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-flame-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[24rem] h-[24rem] rounded-full bg-gold-500/10 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-flame-500 to-flame-400 shadow-flame-strong mb-4"
          >
            <Flame size={40} className="text-white" />
          </motion.div>
          <h1 className="font-display text-5xl tracking-wider leading-none">LOCKED SUMMER</h1>
          <p className="text-muted text-xs mt-2 uppercase tracking-[0.3em] font-bold">🔒☀️ in for summer</p>
        </div>

        <form onSubmit={onSubmit} className="card-glow space-y-4">
          <div>
            <label className="label">Quem és?</label>
            <div className="relative mt-1">
              <select
                className="input appearance-none pr-10 cursor-pointer"
                value={name} onChange={(e) => setName(e.target.value)}
                disabled={users.length === 0}
              >
                {users.length === 0 && <option>A carregar…</option>}
                {users.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password" inputMode="text" autoComplete="current-password"
                className="input pl-10" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {err && <div className="text-sm text-flame-300 bg-flame-500/10 border border-flame-500/30 rounded-lg px-3 py-2">{err}</div>}

          <button type="submit" disabled={loading || !password} className="btn-primary w-full text-base py-4">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Flame size={18} />}
            {loading ? 'A entrar…' : 'Locked in'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted uppercase tracking-[0.25em]">no days off</p>
      </motion.div>
    </div>
  );
}
