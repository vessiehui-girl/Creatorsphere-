import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import OnboardingPlatforms from '@/pages/OnboardingPlatforms';
import Home from '@/pages/Home';
import CreatePost from '@/pages/CreatePost';
import Vault from '@/pages/Vault';
import Planner from '@/pages/Planner';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';

import MobileShell from '@/components/layout/MobileShell';
import BottomNav from '@/components/layout/BottomNav';

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell>
      {children}
      <BottomNav />
    </MobileShell>
  );
}

const App: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        Loading…
      </div>
    );
  }

  const isAuthed = !!user;

  return (
    <Routes>
      <Route path="/" element={isAuthed ? <Navigate to="/app/home" replace /> : <Landing />} />
      <Route path="/login" element={isAuthed ? <Navigate to="/app/home" replace /> : <Login />} />
      <Route path="/signup" element={isAuthed ? <Navigate to="/app/home" replace /> : <Signup />} />
      <Route
        path="/onboarding/platforms"
        element={isAuthed ? <OnboardingPlatforms /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/home"
        element={isAuthed ? <AppShell><Home /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/create"
        element={isAuthed ? <AppShell><CreatePost /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/vault"
        element={isAuthed ? <AppShell><Vault /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/planner"
        element={isAuthed ? <AppShell><Planner /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/analytics"
        element={isAuthed ? <AppShell><Analytics /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/app/me"
        element={isAuthed ? <AppShell><Profile /></AppShell> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={isAuthed ? '/app/home' : '/'} replace />} />
    </Routes>
  );
};

export default App;
