import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const { data, isLoading, error } = useQuery('currentUser', fetchCurrentUser);

    const loginMutation = useMutation(login, {
        onSuccess: (data) => {
            setCurrentUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
        }
    });

    const registerMutation = useMutation(register, {
        onSuccess: (data) => {
            setCurrentUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
        }
    });

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('user');
    };

    const checkAuth = () => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username, password) => {
        return await loginMutation.mutateAsync({ username, password });
    };

    const register = async (username, password) => {
        return await registerMutation.mutateAsync({ username, password });
    };

    return { currentUser, isLoading, error, login, logout, register };
};

const fetchCurrentUser = async () => {
    const response = await fetch('/api/currentUser');
    if (!response.ok) throw new Error('Error fetching current user');
    return response.json();
};

const login = async ({ username, password }) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Error logging in');
    return response.json();
};

const register = async ({ username, password }) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Error registering');
    return response.json();
};

export default useAuth;