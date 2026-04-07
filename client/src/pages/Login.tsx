import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useLogin } from '@/hooks/useLogin';

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (data: { email: string; password: string }) => {
    login.mutate(data, {
      onSuccess: () => navigate('/app/home'),
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-8">Log in to your account</p>
        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          isLoading={login.isPending}
          error={login.error?.message}
        />
        <p className="text-gray-500 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
