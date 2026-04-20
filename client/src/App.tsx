import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

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
import CheckScreen from '@/screens/CheckScreen';
import ResetScreen from '@/screens/ResetScreen';
import ActScreen from '@/screens/ActScreen';
import ResultScreen from '@/screens/ResultScreen';
import { createInitialLoopState, loopReducer, stageToPath } from '@/state/LoopStore';

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell>
      {children}
      <BottomNav />
    </MobileShell>
  );
}

const App: React.FC = () => {
  const location = useLocation();
  const isLoopRoute = ['/check', '/reset', '/act', '/result'].includes(location.pathname);
  const { data: user, isLoading } = useCurrentUser();
  const [loopState, dispatchLoop] = React.useReducer(loopReducer, undefined, createInitialLoopState);

  if (!isLoopRoute && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        Loading…
      </div>
    );
  }

  const isAuthed = !!user;

  return (
    <>
      <Routes>
        <Route
          path="/check"
          element={
            loopState.stage === 'CHECK' ? (
              <CheckScreen
                onComplete={(primarySignalTriggered, additionalTriggeredSignals) =>
                  dispatchLoop({ type: 'COMPLETE_CHECK', primarySignalTriggered, additionalTriggeredSignals })}
              />
            ) : (
              <Navigate to={stageToPath(loopState.stage)} replace />
            )
          }
        />
        <Route
          path="/reset"
          element={
            loopState.stage === 'RESET' ? (
              <ResetScreen
                onComplete={(action, outcomeAndConstraint) =>
                  dispatchLoop({ type: 'COMPLETE_RESET', action, outcomeAndConstraint })}
              />
            ) : (
              <Navigate to={stageToPath(loopState.stage)} replace />
            )
          }
        />
        <Route
          path="/act"
          element={
            loopState.stage === 'ACT' ? (
              <ActScreen action={loopState.action} onComplete={() => dispatchLoop({ type: 'COMPLETE_ACT' })} />
            ) : (
              <Navigate to={stageToPath(loopState.stage)} replace />
            )
          }
        />
        <Route
          path="/result"
          element={
            loopState.stage === 'RESULT' ? (
              <ResultScreen
                onComplete={(result, variableChange) =>
                  dispatchLoop({ type: 'COMPLETE_RESULT', result, variableChange })}
              />
            ) : (
              <Navigate to={stageToPath(loopState.stage)} replace />
            )
          }
        />
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
      <VercelAnalytics />
    </>
  );
};

export default App;
