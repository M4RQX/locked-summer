import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, X, Sparkles, ArrowLeftRight } from 'lucide-react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { getCurrentUser } from '@/lib/auth';
import { listPhotos, addPhoto, deletePhoto } from '@/lib/repo';
import { fmtDate, todayISO } from '@/lib/utils';
import type { PhotoAngle, ProgressPhoto, User } from '@/types';

const ANGLES: { key: PhotoAngle; label: string }[] = [
  { key: 'front', label: 'Frente' },
  { key: 'side', label: 'Lado' },
  { key: 'back', label: 'Costas' },
];

// Compress image client-side before storing as data URL.
async function fileToCompressedDataUrl(file: File, maxDim = 1024, quality = 0.78): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}

export default function PhotosPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [angle, setAngle] = useState<PhotoAngle>('front');
  const [adding, setAdding] = useState<PhotoAngle | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [comparing, setComparing] = useState<{ a: ProgressPhoto; b: ProgressPhoto } | null>(null);

  async function refresh(u: User) {
    setPhotos(await listPhotos(u.id));
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

  if (loading || !user) return <><Header title="FOTOS" /><Loading /></>;

  const byAngle = photos.filter((p) => p.angle === angle);

  return (
    <div className="px-5 max-w-md mx-auto space-y-4">
      <Header title="FOTOS" subtitle="progresso visual · privado" />

      <div className="grid grid-cols-3 gap-2">
        {ANGLES.map((a) => (
          <button
            key={a.key}
            onClick={() => setAngle(a.key)}
            className={`card !p-3 text-center ${angle === a.key ? 'border-flame-400/60 ring-1 ring-flame-500/30 text-flame-400' : ''}`}
          >
            <p className="font-display text-xl">{a.label}</p>
            <p className="text-[11px] text-muted">{photos.filter((p) => p.angle === a.key).length} fotos</p>
          </button>
        ))}
      </div>

      <div className="card flex items-center gap-2">
        <button onClick={() => { setAdding(angle); fileRef.current?.click(); }} className="btn-primary flex-1">
          <Plus size={14} /> Adicionar foto ({ANGLES.find((a) => a.key === angle)?.label})
        </button>
        <input
          ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !adding) return;
            try {
              const dataUrl = await fileToCompressedDataUrl(file);
              await addPhoto(user.id, todayISO(), adding, dataUrl);
              await refresh(user);
            } finally {
              setAdding(null);
              if (fileRef.current) fileRef.current.value = '';
            }
          }}
        />
      </div>

      {byAngle.length === 0 ? (
        <EmptyState icon={Camera} title="Sem fotos ainda" description="Tira a primeira foto e regista o ponto de partida." />
      ) : (
        <>
          {byAngle.length >= 2 && (
            <div className="card flex items-center gap-3">
              <Sparkles size={16} className="text-gold-400" />
              <p className="text-xs text-muted flex-1">Toca em duas fotos para comparar lado a lado.</p>
              <button
                onClick={() => setComparing({ a: byAngle[byAngle.length - 1], b: byAngle[0] })}
                className="btn-gold !py-2 !text-xs"
              >
                <ArrowLeftRight size={12} /> 1ª vs Última
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {byAngle.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!comparing) setComparing({ a: p, b: p });
                  else if (comparing.a.id === p.id) setComparing(null);
                  else setComparing({ ...comparing, b: p });
                }}
                className="relative rounded-2xl overflow-hidden bg-ink-700 aspect-[3/4] active:scale-[0.99]"
              >
                <img src={p.photo_data} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs font-bold">{fmtDate(p.date, 'd MMM yyyy')}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {comparing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={() => setComparing(null)}
          >
            <div className="flex items-center justify-between px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-2xl">Comparar</h3>
              <button onClick={() => setComparing(null)} className="p-2 rounded-lg bg-ink-700/60"><X size={18} /></button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1 p-1" onClick={(e) => e.stopPropagation()}>
              {[comparing.a, comparing.b].map((p, i) => (
                <div key={i} className="relative">
                  <img src={p.photo_data} alt="" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
                    <p className="text-xs font-bold">{fmtDate(p.date, 'd MMM yyyy')}</p>
                  </div>
                  <button
                    onClick={async () => { await deletePhoto(p.id); await refresh(user); setComparing(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-flame-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
