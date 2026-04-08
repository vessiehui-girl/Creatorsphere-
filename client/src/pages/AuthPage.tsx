import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h1>
        {error && <p className="mb-4 text-red-400 text-sm text-center">{error}</p>}
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
            className={`w-full p-2 rounded bg-blue-600 hover:bg-blue-700 ${loading ? 'opacity-50' : 'opacity-100'}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button onClick={toggleMode} className="mt-4 text-blue-400 hover:underline w-full text-center">
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;