import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 bg-gray-100 dark:bg-dark-bg-tertiary rounded-xl hover:bg-gray-200 dark:hover:bg-dark-bg-hover transition-all duration-200 border border-gray-200 dark:border-dark-border-primary group"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
        }`} />
        <Moon className={`absolute inset-0 w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
    </button>
  );
}
