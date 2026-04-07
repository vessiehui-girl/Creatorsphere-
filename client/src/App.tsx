// client/src/App.tsx

import React from 'react';
import { Switch, Route, Redirect } from 'wouter';
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
        <Switch>
            <Route path="/auth">
                {isAuthenticated ? <Redirect to="/" /> : <AuthPage />}
            </Route>
            <Route path="/">
                {isAuthenticated ? <HomePage /> : <Redirect to="/auth" />}
            </Route>
            <Route>
                <Redirect to={isAuthenticated ? '/' : '/auth'} />
            </Route>
        </Switch>
    );
};

export default App;