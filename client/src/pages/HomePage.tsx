import React from 'react';
import useAuth from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Creatorsphere</h1>
      {currentUser && (
        <p className="mb-6 text-gray-300">Logged in as {currentUser.email}</p>
      )}
      <button
        onClick={() => logout()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default HomePage;
