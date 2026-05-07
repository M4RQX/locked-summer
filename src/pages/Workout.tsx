import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Play, History, ChevronRight, Calendar, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { PLANS, nextDayType } from '@/lib/plans';
import { getCurrentUser } from '@/lib/auth';
import { getRecentWorkouts, getLastWorkoutDayType, startWorkout, deleteWorkout } from '@/lib/repo';
import { fmtDate, todayISO } from '@/lib/utils';
import type { DayType, User, Workout } from '@/types';

export default function WorkoutHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recent, setRecent] = useState<Workout[]>([]);
  const [next, setNext] = useState<DayType>('A');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<DayType | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      const [rec, last] = await Promise.all([getRecentWorkouts(u.id, 10), getLastWorkoutDayType(u.id)]);
      setRecent(rec);
      setNext(nextDayType(last));
      setLoading(false);
    })();
  }, [navigate]);

  async function start(dayType: DayType) {
    if (!user) return;
    setStarting(dayType);
    const w = await startWorkout(user.id, dayType, todayISO());
    navigate(`/treino/${w.id}`);
  }

  if (loading || !user) return <><Header title="TREINO" /><Loading /></>;

  return (
    <div className="px-5 md:px-8 space-y-4 max-w-md md:max-w-3xl xl:max-w-4xl mx-auto">
      <Header title="TREINO" subtitle="3x semana · bulk muscular" />

      <div className="grid grid-cols-3 gap-2">
        {PLANS.map((p) => {
          const isNext = p.type === next;
          return (
            <motion.button
              key={p.type}
              whileTap={{ scale: 0.97 }}
              onClick={() => start(p.type)}
              disabled={starting !== null}
              className={`card p-3 text-left flex flex-col gap-1 ${isNext ? 'border-flame-400/60 ring-1 ring-flame-500/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl">{p.type}</span>
                {isNext && <span className="pill bg-flame-500 text-white">próx</span>}
              </div>
              <p className="text-[11px] text-muted leading-tight">{p.subtitle}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-flame-400 text-xs font-bold uppercase tracking-wider">
                <Play size={11} />{starting === p.type ? '…' : 'começar'}
              </div>
            </motion.button>
          );
        })}
      </div>

      <section>
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="label flex items-center gap-1.5"><History size={12} /> histórico</h2>
          <span className="text-xs text-muted">{recent.length} treinos</span>
        </div>

        {recent.length === 0 ? (
          <div className="card text-center py-8 text-muted text-sm">
            <Dumbbell className="mx-auto text-flame-400 mb-2" size={20} />
            ainda não tens treinos. carrega num dos dias acima.
          </div>
        ) : (
          <ul className="space-y-2">
            {recent.map((w) => (
              <li key={w.id} className="card flex items-center gap-3">
                <button
                  onClick={() => navigate(`/treino/${w.id}`)}
                  className="flex-1 flex items-center gap-3 text-left active:scale-[0.99] transition min-w-0"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-2xl ${w.completed_at ? 'bg-gold-500/15 text-gold-400' : 'bg-flame-500/15 text-flame-400'}`}>
                    {w.day_type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold flex items-center gap-1.5"><Calendar size={13} className="text-muted" />{fmtDate(w.date)}</p>
                    <p className="text-xs text-muted">
                      {w.completed_at ? `concluído · ${w.duration_minutes ?? '-'}min` : 'em curso'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-muted" />
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!window.confirm(`Apagar treino ${w.day_type} de ${fmtDate(w.date)}? Esta acção é irreversível.`)) return;
                    await deleteWorkout(w.id);
                    setRecent((rs) => rs.filter((x) => x.id !== w.id));
                  }}
                  className="p-2 rounded-lg text-muted hover:text-flame-400 active:scale-90 transition"
                  title="Apagar treino"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
