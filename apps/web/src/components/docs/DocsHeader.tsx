import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Sun, Moon, Settings, Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface DocsHeaderProps {
  projectName: string;
  projectSlug: string;
  projectId: string;
  onSearchClick: () => void;
}

export default function DocsHeader({ projectName, projectSlug, projectId, onSearchClick }: DocsHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchClick]);

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
      {/* Left - Logo */}
      <div className="flex items-center gap-3 w-[200px]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-neutral-100 font-semibold text-sm">Docs</span>
        </Link>
      </div>

      {/* Center - Search Button */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-2 px-2.5 py-1 text-xs text-neutral-400 bg-neutral-900/50 border border-neutral-800 rounded-md hover:bg-neutral-800/50 hover:border-neutral-700 transition-all duration-200"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left">Search docs...</span>
          <kbd className="px-1.5 py-0.5 text-[9px] text-neutral-500 bg-neutral-800/80 rounded border border-neutral-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex items-center gap-1 w-[200px] justify-end">
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
