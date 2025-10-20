import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FileText, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Particles } from '@/components/ui/particles';
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
      toast.success('Login successful!');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <Particles className="absolute inset-0" quantity={50} />
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-md opacity-50" />
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Doxify
              </span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to continue building amazing docs</p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="shadow-2xl border-2 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
              <CardDescription>Enter your credentials to access your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="group w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                    Sign up for free
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
