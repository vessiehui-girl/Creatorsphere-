// client/src/App.tsx

import React from 'react';
import { Switch, Route, Redirect } from 'wouter';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import useAuth from './hooks/useAuth';

const App: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        {currentUser ? <HomePage /> : <Redirect to="/auth" />}
      </Route>
      <Redirect to="/auth" />
    </Switch>
  );
};

export default App;