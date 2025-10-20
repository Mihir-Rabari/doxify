import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
