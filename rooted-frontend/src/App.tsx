import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store';
import AppShell from './components/layout/AppShell';

// Lazy loaded pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Diagnosis = React.lazy(() => import('./pages/Diagnosis'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Goals = React.lazy(() => import('./pages/Goals'));
const History = React.lazy(() => import('./pages/History'));
const Insights = React.lazy(() => import('./pages/Insights'));
const Playground = React.lazy(() => import('./pages/Playground'));

function PageSkeleton() {
  return (
    <div className="h-[60vh] flex items-center justify-center motion-breathe">
      {/* A simple placeholder mimicking a seed waiting to sprout */}
      <div className="w-4 h-4 rounded-full bg-sage-300" />
    </div>
  );
}

function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-muted motion-breathe">
      <div className="w-6 h-6 rounded-t-full rounded-bl-full bg-sage-500 transform -rotate-45" />
    </div>
  );
}

export default function App() {
  const { isAuthed, checkAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    checkAuth().finally(() => setIsInitializing(false));
  }, [checkAuth]);

  if (isInitializing) {
    return <GlobalLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={!isAuthed ? <Suspense fallback={<GlobalLoader />}><Landing /></Suspense> : <Navigate to="/diagnosis" replace />} />
      <Route path="/welcome" element={!isAuthed ? <Suspense fallback={<GlobalLoader />}><Welcome /></Suspense> : <Navigate to="/diagnosis" replace />} />
      
      {/* Protected Routes wrapped in AppShell */}
      <Route element={isAuthed ? <AppShell /> : <Navigate to="/welcome" replace />}>
        <Route path="/diagnosis" element={<Suspense fallback={<PageSkeleton />}><Diagnosis /></Suspense>} />
        <Route path="/chat" element={<Suspense fallback={<PageSkeleton />}><Chat /></Suspense>} />
        <Route path="/goals" element={<Suspense fallback={<PageSkeleton />}><Goals /></Suspense>} />
        <Route path="/history" element={<Suspense fallback={<PageSkeleton />}><History /></Suspense>} />
        <Route path="/insights" element={<Suspense fallback={<PageSkeleton />}><Insights /></Suspense>} />
      </Route>

      {/* Dev Route */}
      <Route path="/playground" element={<Suspense fallback={<GlobalLoader />}><Playground /></Suspense>} />
    </Routes>
  );
}
