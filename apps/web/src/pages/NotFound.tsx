import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-emerald-500" />
        </div>
        
        <h1 className="text-9xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="h-10 px-4 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
