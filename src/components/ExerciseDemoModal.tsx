import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ImageOff, ArrowLeftRight } from 'lucide-react';
import { getExerciseDemo } from '@/lib/exercises';

interface Props {
  exerciseName: string;
  onClose: () => void;
}

/**
 * Modal de demonstração de um exercício.
 * Usa imagens do free-exercise-db (Apache 2.0) servidas via raw.githubusercontent.com.
 * Mostra start/end posture lado a lado e alterna automaticamente como GIF stop-motion.
 */
export default function ExerciseDemoModal({ exerciseName, onClose }: Props) {
  const demo = getExerciseDemo(exerciseName);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [imgError, setImgError] = useState<{ start: boolean; end: boolean }>({ start: false, end: false });

  // Stop-motion alternation between start/end every 900ms (only if we have demo and both images load).
  useEffect(() => {
    if (!demo || imgError.start || imgError.end) return;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 900);
    return () => clearInterval(id);
  }, [demo, imgError]);

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
        className="card w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-tight truncate">{exerciseName}</h3>
            <p className="text-[11px] text-muted uppercase tracking-wider">como fazer</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-ink-700/60 shrink-0"><X size={16} /></button>
        </div>

        {!demo && <DemoFallback name={exerciseName} />}

        {demo && (
          <div className="space-y-3">
            {/* Animated single frame (stop-motion alternating) */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-700">
              {!imgError.start && (
                <img
                  src={demo.start}
                  alt={`${exerciseName} - posição inicial`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${frame === 0 ? 'opacity-100' : 'opacity-0'}`}
                  onError={() => setImgError((e) => ({ ...e, start: true }))}
                />
              )}
              {!imgError.end && (
                <img
                  src={demo.end}
                  alt={`${exerciseName} - posição final`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${frame === 1 ? 'opacity-100' : 'opacity-0'}`}
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

            {/* Side-by-side static for clarity */}
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

            <p className="text-[10px] text-muted text-center">
              fonte: free-exercise-db · Apache 2.0
            </p>
          </div>
        )}
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
