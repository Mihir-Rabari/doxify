import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, FileText } from 'lucide-react';

interface SearchBarProps {
  pages: any[];
  onSelectPage: (pageId: string) => void;
}

interface SearchResult {
  page: any;
  score: number;
  matchedIn: 'title' | 'content';
  preview?: string;
}

export default function SearchBar({ pages, onSelectPage }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Fuzzy search with scoring
  const calculateScore = (text: string, query: string): number => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    // Exact match - highest score
    if (lowerText === lowerQuery) return 100;
    
    // Starts with query - high score
    if (lowerText.startsWith(lowerQuery)) return 80;
    
    // Contains query as whole word - medium-high score
    if (new RegExp(`\\b${lowerQuery}\\b`).test(lowerText)) return 60;
    
    // Contains query - medium score
    if (lowerText.includes(lowerQuery)) return 40;
    
    // Fuzzy match - calculate based on character matches
    let score = 0;
    let queryIndex = 0;
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }
    return queryIndex === lowerQuery.length ? (score / lowerQuery.length) * 20 : 0;
  };

  // Optimized search with useMemo
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchQuery = debouncedQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    pages.forEach((page) => {
      const titleScore = calculateScore(page.title, searchQuery);
      const contentScore = page.content ? calculateScore(page.content, searchQuery) : 0;
      
      // Only include if there's a match
      if (titleScore > 0 || contentScore > 0) {
        const matchedIn = titleScore >= contentScore ? 'title' : 'content';
        const score = Math.max(titleScore, contentScore);
        
        // Extract preview snippet from content
        let preview = '';
        if (matchedIn === 'content' && page.content) {
          const index = page.content.toLowerCase().indexOf(searchQuery);
          if (index !== -1) {
            const start = Math.max(0, index - 30);
            const end = Math.min(page.content.length, index + searchQuery.length + 70);
            preview = (start > 0 ? '...' : '') + 
                     page.content.substring(start, end).replace(/<[^>]*>/g, '') + 
                     (end < page.content.length ? '...' : '');
          }
        }
        
        searchResults.push({ page, score, matchedIn, preview });
      }
    });

    // Sort by score (highest first)
    return searchResults.sort((a, b) => b.score - a.score);
  }, [debouncedQuery, pages]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation in results
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
        handleSelect(results[selectedIndex].page._id);
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

  const handleSelect = (pageId: string) => {
    onSelectPage(pageId);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 transition-colors"
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
                {debouncedQuery && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pages found for "{debouncedQuery}"</p>
                    <p className="text-xs mt-2">Try different keywords</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <button
                        key={result.page._id}
                        ref={(el) => (resultsRef.current[index] = el)}
                        onClick={() => handleSelect(result.page._id)}
                        className={`w-full px-4 py-3 text-left transition-colors group ${
                          index === selectedIndex
                            ? 'bg-emerald-50 dark:bg-emerald-500/10'
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            index === selectedIndex 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-400 dark:text-neutral-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium transition-colors ${
                              index === selectedIndex
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                            }`}>
                              {result.page.title}
                            </div>
                            {result.matchedIn === 'title' && result.page.section && (
                              <div className="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">
                                in {result.page.section}
                              </div>
                            )}
                            {result.preview && (
                              <div className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2 mt-1">
                                {result.preview}
                              </div>
                            )}
                            {result.matchedIn === 'content' && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-500 mt-1">
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
                  <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-2">Quick Search</p>
                    <p className="text-sm">Start typing to search pages by title or content</p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">↵</kbd>
                        <span>Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">ESC</kbd>
                        <span>Close</span>
                      </div>
                    </div>
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
