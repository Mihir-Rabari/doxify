import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Doxify</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* User Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-bg-tertiary rounded-xl border border-gray-200 dark:border-dark-border-primary">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">{user?.name}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
