import { Link } from 'react-router-dom';
import { ChevronRight, Copy, ExternalLink, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface DocsHeaderProps {
  projectName: string;
  projectSlug: string;
  projectId: string;
  pageTitle?: string;
}

export default function DocsHeader({ projectName, projectSlug, projectId, pageTitle }: DocsHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', {
      duration: 2000,
      style: {
        background: '#1F2937',
        color: '#fff',
        border: '1px solid #374151',
      },
    });
  };

  return (
    <header className="h-12 border-b border-neutral-800/50 bg-[#0D0D0D]/95 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-50 shadow-lg shadow-black/5">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-neutral-100 font-semibold text-sm">Docs</span>
        </Link>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/sites/${projectSlug}`} className="hover:text-neutral-200 transition-colors duration-150">
            {projectName}
          </Link>
          {pageTitle && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-neutral-300 font-medium">{pageTitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Copy Page Link */}
        <button
          onClick={handleCopyLink}
          className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
          title="Copy link"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Open Dashboard */}
        <Link
          to="/dashboard"
          target="_blank"
          className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
          title="Open dashboard"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <Link
          to={`/project/${projectId}/settings`}
          className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
          title="Project settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
