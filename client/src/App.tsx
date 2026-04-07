// client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { useCurrentUser } from './hooks/useCurrentUser';

const App: React.FC = () => {
    const { data: user, isLoading, error } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    const isAuthenticated = !!user && !error;

    return (
        <Routes>
            <Route
                path="/auth"
                element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
            />
            <Route
                path="/"
                element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />}
            />
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />}
            />
        </Routes>
    );
};

export default App;