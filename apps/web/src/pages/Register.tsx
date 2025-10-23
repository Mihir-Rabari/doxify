import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FileText, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Input, Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    registerMutation.mutate({ name, email, password });
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
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">Start building beautiful documentation</p>
        </div>

        {/* Register Card */}
        <div className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Input
              label="Full Name"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />

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
              helperText="At least 6 characters"
              required
              minLength={6}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              isLoading={registerMutation.isPending}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <Link to="/" className="block text-sm text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500 dark:text-neutral-500 mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
