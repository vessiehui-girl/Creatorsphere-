import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                toast.success(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
                // Redirect logic can go here, e.g., using useHistory or navigate from react-router
            }, 2000);
        } catch (error) {
            setLoading(false);
            toast.error('An error occurred!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        className={`w-full p-2 rounded bg-blue-600 hover:bg-blue-700 ${loading ? 'opacity-50' : 'opacity-100'}`} 
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button onClick={toggleMode} className="mt-4 text-blue-400 hover:underline">{isLogin ? 'Create an account' : 'Already have an account?'}</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AuthPage;