import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useRegister } from '@/hooks/useRegister';

export default function Signup() {
  const navigate = useNavigate();
  const register = useRegister();

  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    register.mutate(data, {
      onSuccess: () => navigate('/onboarding/platforms'),
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400 mb-8">Join Creatorsphere today</p>
        <AuthForm
          mode="signup"
          onSubmit={handleSubmit}
          isLoading={register.isPending}
          error={register.error?.message}
        />
        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
