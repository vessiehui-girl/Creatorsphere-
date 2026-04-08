import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">C</span>
        </div>
        <h1 className="text-4xl font-bold text-white">Creatorsphere</h1>
        <p className="text-gray-400 mt-3 text-lg max-w-xs">Your all-in-one creator toolkit. Manage, schedule, and grow.</p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/signup')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition"
        >
          Create Account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="border border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold py-4 rounded-xl text-lg transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
