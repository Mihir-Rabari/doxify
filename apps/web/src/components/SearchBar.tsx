import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  pages: any[];
  onSelectPage: (pageId: string) => void;
}

export default function SearchBar({ pages, onSelectPage }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = pages.filter((page) =>
      page.title.toLowerCase().includes(searchQuery) ||
      page.content?.toLowerCase().includes(searchQuery)
    );

    setResults(filtered);
  }, [query, pages]);

  const handleSelect = (pageId: string) => {
    onSelectPage(pageId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">Search pages...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-neutral-900 rounded border border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-500">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
                <Search className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages by title or content..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                    No pages found for "{query}"
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((page) => (
                      <button
                        key={page._id}
                        onClick={() => handleSelect(page._id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors group"
                      >
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {page.title}
                        </div>
                        {page.content && (
                          <div className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-1 mt-1">
                            {page.content.substring(0, 100)}...
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start typing to search pages...</p>
                    <p className="text-xs mt-2">Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">ESC</kbd> to close</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
