import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ImageOff, ArrowLeftRight, Dumbbell, Target, Zap } from 'lucide-react';
import {
  getExerciseDemo, getExerciseDetails,
  MUSCLE_PT_LABELS, EQUIPMENT_PT_LABELS, FORCE_PT_LABELS, LEVEL_PT_LABELS, MECHANIC_PT_LABELS,
  type ExerciseDetails,
} from '@/lib/exercises';
import { getInstructionsPT } from '@/lib/instructions-pt';

interface Props {
  exerciseName: string;
  onClose: () => void;
}

/**
 * Modal de demonstração de um exercício.
 * Imagens do free-exercise-db (Apache 2.0). Mostra:
 * 1. Stop-motion das 2 frames (início/fim) com crossfade suave 500ms
 * 2. Side-by-side estático para análise detalhada
 * 3. Chips PT: equipamento, músculos primários/secundários, força, nível, mecânica
 * 4. Lista numerada de instruções passo-a-passo
 */
export default function ExerciseDemoModal({ exerciseName, onClose }: Props) {
  const demo = getExerciseDemo(exerciseName);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [imgError, setImgError] = useState<{ start: boolean; end: boolean }>({ start: false, end: false });
  const [details, setDetails] = useState<ExerciseDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Slower alternation (1200ms) for clearer visualization, smoother crossfade (500ms).
  useEffect(() => {
    if (!demo || imgError.start || imgError.end) return;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 1200);
    return () => clearInterval(id);
  }, [demo, imgError]);

  // Lazy-load full details (instructions, muscles, equipment) once cached.
  useEffect(() => {
    let cancelled = false;
    setLoadingDetails(true);
    getExerciseDetails(exerciseName).then((d) => {
      if (cancelled) return;
      setDetails(d);
      setLoadingDetails(false);
    });
    return () => { cancelled = true; };
  }, [exerciseName]);

  const ptMuscle = (m: string) => MUSCLE_PT_LABELS[m.toLowerCase()] ?? m;
  const ptEquipment = (e: string) => EQUIPMENT_PT_LABELS[e.toLowerCase()] ?? e;
  const ptForce = (f: string | null) => f ? (FORCE_PT_LABELS[f] ?? f) : null;
  const ptLevel = (l: string) => LEVEL_PT_LABELS[l] ?? l;
  const ptMechanic = (m: string | null) => m ? (MECHANIC_PT_LABELS[m] ?? m) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur flex items-end md:items-center justify-center px-3 pb-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md max-h-[92dvh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 gap-2 shrink-0">
          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-tight truncate">{exerciseName}</h3>
            <p className="text-[11px] text-muted uppercase tracking-wider">como fazer</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60 shrink-0"><X size={16} /></button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto -mx-1 px-1 flex-1">
          {!demo && <DemoFallback name={exerciseName} />}

          {demo && (
            <div className="space-y-3">
              {/* Big stop-motion com Ken Burns effect:
                  - Crossfade 500ms entre os 2 frames (1200ms cycle)
                  - Cada frame tem zoom + drift sutil enquanto está visível
                  - Frame inactivo está em estado "rest" (scale 1.0, sem drift)
                  - Frame activo anima até scale 1.06 com translate diagonal
                  Resultado: ilusão de movimento contínuo entre as 2 poses,
                  sem style mismatch nem custos extra. */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-700">
                {!imgError.start && (
                  <img
                    src={demo.start}
                    alt={`${exerciseName} - posição inicial`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all ease-in-out transform-gpu ${
                      frame === 0
                        ? 'opacity-100 duration-[1200ms] scale-[1.06] translate-x-[-1.5%] translate-y-[-1%]'
                        : 'opacity-0 duration-500 scale-100 translate-x-0 translate-y-0'
                    }`}
                    onError={() => setImgError((e) => ({ ...e, start: true }))}
                  />
                )}
                {!imgError.end && (
                  <img
                    src={demo.end}
                    alt={`${exerciseName} - posição final`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all ease-in-out transform-gpu ${
                      frame === 1
                        ? 'opacity-100 duration-[1200ms] scale-[1.06] translate-x-[1.5%] translate-y-[1%]'
                        : 'opacity-0 duration-500 scale-100 translate-x-0 translate-y-0'
                    }`}
                    onError={() => setImgError((e) => ({ ...e, end: true }))}
                  />
                )}
                {(imgError.start && imgError.end) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted gap-2">
                    <ImageOff size={32} />
                    <p className="text-sm">imagem não disponível</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 pill bg-black/60 text-white/80 text-[10px]">
                  <ArrowLeftRight size={10} className="inline mr-1" /> {frame === 0 ? 'início' : 'fim'}
                </div>
              </div>

              {/* Side-by-side static for analysis */}
              {!imgError.start && !imgError.end && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-ink-700">
                    <img src={demo.start} alt="início" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 pill bg-black/60 text-white text-[9px]">1 · início</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-ink-700">
                    <img src={demo.end} alt="fim" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 pill bg-black/60 text-white text-[9px]">2 · fim</span>
                  </div>
                </div>
              )}

              {/* Chips: equipment + force + level + mechanic */}
              {details && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="pill bg-flame-500/15 text-flame-300 border border-flame-400/30">
                    <Dumbbell size={11} className="inline mr-1" /> {ptEquipment(details.equipment)}
                  </span>
                  {ptForce(details.force) && (
                    <span className="pill bg-ink-700 text-white/80">{ptForce(details.force)}</span>
                  )}
                  {ptMechanic(details.mechanic) && (
                    <span className="pill bg-ink-700 text-white/80">{ptMechanic(details.mechanic)}</span>
                  )}
                  <span className="pill bg-ink-700 text-muted">{ptLevel(details.level)}</span>
                </div>
              )}

              {/* Muscles trabalhados */}
              {details && (
                <div className="card !p-3 bg-ink-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={13} className="text-flame-400" />
                    <span className="label">músculos trabalhados</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted w-16 shrink-0">primários</span>
                      {details.primaryMuscles.map((m) => (
                        <span key={m} className="pill bg-flame-500/20 text-flame-300 border border-flame-400/40">{ptMuscle(m)}</span>
                      ))}
                    </div>
                    {details.secondaryMuscles.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted w-16 shrink-0">secundários</span>
                        {details.secondaryMuscles.map((m) => (
                          <span key={m} className="pill bg-ink-700 text-white/70">{ptMuscle(m)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instruções passo-a-passo (PT preferido, EN fallback) */}
              {details && (() => {
                const pt = getInstructionsPT(details.id);
                const steps = pt ?? details.instructions;
                if (!steps || steps.length === 0) return null;
                return (
                  <div className="card !p-3 bg-ink-800/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={13} className="text-flame-400" />
                      <span className="label">como executar</span>
                      {!pt && (
                        <span className="ml-auto pill bg-ink-700 text-muted text-[9px]">EN</span>
                      )}
                    </div>
                    <ol className="space-y-2">
                      {steps.map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-flame-500/20 border border-flame-400/40 text-flame-300 text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-white/85">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()}

              {loadingDetails && !details && (
                <p className="text-[11px] text-muted text-center py-2">A carregar detalhes…</p>
              )}

              <p className="text-[10px] text-muted text-center pt-1">
                fonte: free-exercise-db · {details && getInstructionsPT(details.id) ? 'instruções traduzidas' : 'instruções em inglês'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DemoFallback({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4 gap-3">
      <div className="p-4 rounded-2xl bg-ink-700/50 border border-ink-500/60">
        <ImageOff size={28} className="text-muted" />
      </div>
      <div>
        <p className="font-semibold">Sem demonstração para "{name}"</p>
        <p className="text-xs text-muted mt-1 max-w-xs">Este exercício ainda não tem imagem mapeada. Adiciono se me passares o nome canónico (ex: o nome em inglês usado em apps de gym).</p>
      </div>
    </div>
  );
}
