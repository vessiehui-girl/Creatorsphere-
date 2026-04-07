import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, navigate] = useLocation();

    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const activeMutation = isLogin ? loginMutation : registerMutation;
    const isLoading = activeMutation.isPending;
    const errorMessage = activeMutation.error?.message ?? null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        activeMutation.reset();
        activeMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    navigate('/');
                },
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl mb-4 text-center font-bold">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                {errorMessage && (
                    <p className="mb-4 text-red-400 text-sm text-center">{errorMessage}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-2 rounded bg-blue-600 hover:bg-blue-700 transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        loginMutation.reset();
                        registerMutation.reset();
                    }}
                    className="mt-4 text-blue-400 hover:underline w-full text-center"
                >
                    {isLogin ? 'Create an account' : 'Already have an account?'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;