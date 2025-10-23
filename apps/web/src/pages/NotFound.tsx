import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui';

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
          <Link to="/dashboard">
            <Button variant="primary" icon={Home}>
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
