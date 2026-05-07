import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Play, History, ChevronRight, Calendar, Trash2, Pencil } from 'lucide-react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { getCurrentUser } from '@/lib/auth';
import {
  getRecentWorkouts, getLastWorkoutDayType, startWorkout, deleteWorkout,
  listUserDayPlans, type UserDayPlanWithExercises,
} from '@/lib/repo';
import { fmtDate, todayISO } from '@/lib/utils';
import type { User, Workout } from '@/types';

export default function WorkoutHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recent, setRecent] = useState<Workout[]>([]);
  const [plans, setPlans] = useState<UserDayPlanWithExercises[]>([]);
  const [nextCode, setNextCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login', { replace: true }); return; }
      setUser(u);
      const [rec, last, pl] = await Promise.all([
        getRecentWorkouts(u.id, 10),
        getLastWorkoutDayType(u.id),
        listUserDayPlans(u.id),
      ]);
      setRecent(rec);
      setPlans(pl);
      // determine next plan: rotation through user's plans by code, fallback to first
      if (pl.length > 0) {
        const idx = last ? pl.findIndex((p) => p.code === last) : -1;
        setNextCode(idx >= 0 ? pl[(idx + 1) % pl.length].code : pl[0].code);
      }
      setLoading(false);
    })();
  }, [navigate]);

  async function start(dayCode: string) {
    if (!user) return;
    setStarting(dayCode);
    const w = await startWorkout(user.id, dayCode as 'A' | 'B' | 'C', todayISO());
    navigate(`/treino/${w.id}`);
  }

  if (loading || !user) return <><Header title="TREINO" /><Loading /></>;

  const subtitleText = plans.length === 0
    ? 'sem plano — cria o primeiro dia'
    : `${plans.length}× semana · ${plans.reduce((acc, p) => acc + p.exercises.length, 0)} exerc.`;

  return (
    <div className="px-5 md:px-8 space-y-4 max-w-md md:max-w-3xl xl:max-w-4xl mx-auto">
      <Header title="TREINO" subtitle={subtitleText} right={
        <button
          onClick={() => navigate('/treino/plano')}
          className="p-2 rounded-xl bg-flame-500/15 border border-flame-400/40 text-flame-400 active:scale-95"
          title="Editar plano de treino"
        >
          <Pencil size={16} />
        </button>
      } />

      {plans.length === 0 ? (
        <div className="card text-center py-8">
          <Dumbbell className="mx-auto text-flame-400 mb-3" size={28} />
          <h2 className="font-display text-2xl mb-1">sem dias definidos</h2>
          <p className="text-muted text-sm mb-4">cria o teu plano para começar</p>
          <button onClick={() => navigate('/treino/plano')} className="btn-primary">
            <Pencil size={14} /> criar plano
          </button>
        </div>
      ) : (
        <div className={`grid gap-2 ${plans.length <= 3 ? 'grid-cols-3' : plans.length <= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {plans.map((p) => {
            const isNext = p.code === nextCode;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => start(p.code)}
                disabled={starting !== null}
                className={`card p-3 text-left flex flex-col gap-1 ${isNext ? 'border-flame-400/60 ring-1 ring-flame-500/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl">{p.code}</span>
                  {isNext && <span className="pill bg-flame-500 text-white">próx</span>}
                </div>
                <p className="text-[11px] text-muted leading-tight line-clamp-2">{p.subtitle ?? p.title}</p>
                <p className="text-[10px] text-muted/60 mt-0.5">{p.exercises.length} exerc.</p>
                <div className="mt-1 inline-flex items-center gap-1 text-flame-400 text-xs font-bold uppercase tracking-wider">
                  <Play size={11} />{starting === p.code ? '…' : 'começar'}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

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
