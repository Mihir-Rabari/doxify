import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, FileText } from 'lucide-react';
import { searchService, SearchResult } from '../../services/searchService';

interface PublicSearchBarProps {
  projectId: string;
  projectSlug: string;
  onSelectPage: (pageSlug: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PublicSearchBar({ projectId, projectSlug, onSelectPage, isOpen, onClose }: PublicSearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut: Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Backend search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const response = await searchService.searchPages(projectId, debouncedQuery, { limit: 20 });
        setResults(response.results);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery, projectId]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex].slug);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = resultsRef.current[selectedIndex];
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleSelect = (pageSlug: string) => {
    onSelectPage(pageSlug);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
        <div className="bg-[#0D0D0D] rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-neutral-800">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {debouncedQuery && results.length === 0 && !isSearching ? (
              <div className="p-6 text-center text-neutral-400">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pages found for "{debouncedQuery}"</p>
                <p className="text-xs mt-1.5 text-neutral-500">Try different keywords</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-1.5">
                {results.map((result, index) => (
                  <button
                    key={result._id}
                    ref={(el) => (resultsRef.current[index] = el)}
                    onClick={() => handleSelect(result.slug)}
                    className={`w-full px-3.5 py-2.5 text-left transition-colors group ${
                      index === selectedIndex
                        ? 'bg-emerald-500/10'
                        : 'hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        index === selectedIndex 
                          ? 'text-emerald-400' 
                          : 'text-neutral-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium transition-colors ${
                          index === selectedIndex
                            ? 'text-emerald-400'
                            : 'text-white group-hover:text-emerald-400'
                        }`}>
                          {result.title}
                        </div>
                        {result.matchedIn === 'title' && result.section && (
                          <div className="text-xs text-neutral-500 mt-0.5">
                            in {result.section}
                          </div>
                        )}
                        {result.preview && (
                          <div className="text-xs text-neutral-400 line-clamp-2 mt-0.5">
                            {result.preview}
                          </div>
                        )}
                        {result.matchedIn === 'content' && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Matched in content
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-neutral-400">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium mb-1.5">Quick Search</p>
                <p className="text-xs text-neutral-500">Start typing to search pages by title or content</p>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-[10px]">↑↓</kbd>
                    <span className="text-neutral-500">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-[10px]">↵</kbd>
                    <span className="text-neutral-500">Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-[10px]">ESC</kbd>
                    <span className="text-neutral-500">Close</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
