import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FileText, ArrowRight, Mail, Lock } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Input, Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Invalid credentials');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <FileText className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">Doxify</span>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-8 mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">Sign in to continue to your workspace</p>
        </div>

        {/* Login Card */}
        <div className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              isLoading={loginMutation.isPending}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                Sign up
              </Link>
            </p>
            <Link to="/" className="block text-sm text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
