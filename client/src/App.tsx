// client/src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage'; // Assuming you have an AuthPage component
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import { checkAuth } from './auth'; // function to check auth status

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
    useEffect(() => {
        const initializeAuth = async () => {
            const authStatus = await checkAuth(); // Replace with your actual auth checking logic
            setIsAuthenticated(authStatus);
        };
        initializeAuth();
    }, []);
  
    if (isAuthenticated === null) {
        // Loading state while checking authentication
        return <div>Loading...</div>;
    }
  
    const ProtectedRoute = ({ component: Component, ...rest }: any) => (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/auth" />
                )
            }
        />
    );
  
    return (
        <Router>
            <Switch>
                <ProtectedRoute path="/" exact component={HomePage} />
                <Route path="/auth" component={AuthPage} />
                <Redirect to="/auth" />
            </Switch>
        </Router>
    );
};

export default App;