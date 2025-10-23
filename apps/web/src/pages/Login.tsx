import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0A0A0A] border-r border-neutral-800">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xl font-semibold text-white">Doxify</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-400">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-300">Password</label>
                <Link to="/forgot-password" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent text-white placeholder-neutral-500 transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loginMutation.isPending}
              className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-500 hover:text-emerald-400 font-medium">
                Sign Up Now
              </Link>
            </p>
          </div>

          <p className="mt-8 text-xs text-neutral-500 text-center">
            By continuing, you agree to Doxify's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right Side - Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0B0B] items-center justify-center p-12">
        <div className="max-w-2xl">
          <blockquote className="text-4xl font-light text-white leading-relaxed mb-8">
            "I built Doxify because I needed a better way to document my projects. As an indie dev, I make tools that solve my own problems - and this one turned out pretty damn good."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-semibold">
              M
            </div>
            <div>
              <p className="text-white font-medium">Mihir Rabari</p>
              <p className="text-neutral-400 text-sm">Indie Developer • Building tools I need</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
