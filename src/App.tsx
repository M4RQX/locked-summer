import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import WorkoutHome from '@/pages/Workout';
import WorkoutSession from '@/pages/WorkoutSession';
import FoodPage from '@/pages/Food';
import WeightPage from '@/pages/Weight';
import PhotosPage from '@/pages/Photos';
import StatsPage from '@/pages/Stats';
import SettingsPage from '@/pages/Settings';
import PlanEditor from '@/pages/PlanEditor';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { getSession } from '@/lib/auth';

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const [hasSession] = useState(() => Boolean(getSession()));
  const location = useLocation();
  if (!hasSession) return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <div className="min-h-dvh flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-safe md:pb-10">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  // tiny effect: lock viewport from horizontal scroll
  useEffect(() => { document.documentElement.style.overflowX = 'hidden'; }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedShell><Dashboard /></ProtectedShell>} />
          <Route path="/treino" element={<ProtectedShell><WorkoutHome /></ProtectedShell>} />
          <Route path="/treino/plano" element={<ProtectedShell><PlanEditor /></ProtectedShell>} />
          <Route path="/treino/:id" element={<ProtectedShell><WorkoutSession /></ProtectedShell>} />
          <Route path="/comida" element={<ProtectedShell><FoodPage /></ProtectedShell>} />
          <Route path="/peso" element={<ProtectedShell><WeightPage /></ProtectedShell>} />
          <Route path="/fotos" element={<ProtectedShell><PhotosPage /></ProtectedShell>} />
          <Route path="/stats" element={<ProtectedShell><StatsPage /></ProtectedShell>} />
          <Route path="/settings" element={<ProtectedShell><SettingsPage /></ProtectedShell>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
