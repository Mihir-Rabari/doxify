import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Particles } from '@/components/ui/particles';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    registerMutation.mutate({ name: name.trim(), email: email.trim().toLowerCase(), password });
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
              <p className="text-gray-600 dark:text-gray-400">Start building beautiful docs in minutes</p>
            </div>
          </div>

          {/* Register Form */}
          <Card className="shadow-2xl border-2 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                Get started for free
              </CardTitle>
              <CardDescription>No credit card required • 14-day free trial</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
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
                  minLength={6}
                />
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="group w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  ← Back to home
                </Link>
              </div>

              <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
