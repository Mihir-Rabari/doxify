import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronRight, Sun, Moon, Settings, Copy, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/ui/Loading';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  theme: any;
  publishSettings: {
    seoTitle?: string;
    seoDescription?: string;
    favicon?: string;
  };
}

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  section: string;
  order: number;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function PublicDocumentation() {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch project
  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: ['public-project', slug],
    queryFn: async () => {
      const response = await api.get(`/api/view/${slug}`);
      return response.data.project as Project;
    },
  });

  // Fetch navigation
  const { data: navigationData } = useQuery({
    queryKey: ['public-navigation', slug],
    queryFn: async () => {
      const response = await api.get(`/api/view/${slug}/navigation`);
      return response.data.navigation;
    },
    enabled: !!slug,
  });

  // Fetch current page or first page
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['public-page', slug, pageSlug],
    queryFn: async () => {
      if (pageSlug) {
        const response = await api.get(`/api/view/${slug}/pages/${pageSlug}`);
        return response.data.page as Page;
      } else {
        // Get first page
        const response = await api.get(`/api/view/${slug}/pages`);
        return response.data.pages[0] as Page;
      }
    },
    enabled: !!slug,
  });

  // Update document title
  useEffect(() => {
    if (projectData) {
      const title = pageData 
        ? `${pageData.title} - ${projectData.name}`
        : projectData.publishSettings.seoTitle || projectData.name;
      document.title = title;
    }
  }, [projectData, pageData]);

  // Extract and enhance table of contents from page content
  const tableOfContents = useMemo(() => {
    if (!pageData?.content) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pageData.content;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3');
    const toc: TocItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';
      const id = heading.id || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      
      toc.push({ id, text, level });
    });
    
    return toc;
  }, [pageData]);

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const headings = contentRef.current.querySelectorAll('h1, h2, h3');
      let currentHeading = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        }
      });
      
      setActiveHeading(currentHeading);
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [pageData]);

  // Add IDs to headings in content
  useEffect(() => {
    if (!contentRef.current || !pageData?.content) return;
    
    const headings = contentRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        heading.id = `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      }
    });
  }, [pageData]);

  if (isProjectLoading) {
    return <Loading />;
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Documentation Not Found
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            This documentation is not published or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-neutral-100">
      {/* TOP HEADER BAR - Sticky with shadow */}
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
            <Link to={`/sites/${slug}`} className="hover:text-neutral-200 transition-colors duration-150">
              {projectData.name}
            </Link>
            {pageData && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-neutral-300 font-medium">{pageData.title}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Copy Page Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!', {
                duration: 2000,
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
              });
            }}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Open in New Tab */}
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

          {/* Settings/Project Info */}
          <Link
            to={`/project/${projectData._id}/settings`}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-lg transition-all duration-150 ease-in-out"
            title="Project settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - Navigation (260px fixed) */}
        <aside className="w-[260px] h-full border-r border-neutral-800/50 bg-[#0D0D0D] flex flex-col shadow-lg shadow-black/5">
          {/* Search Bar at Top */}
          <div className="p-4 border-b border-neutral-800/50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 pl-9 pr-12 text-sm text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all duration-200"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-neutral-500 bg-neutral-800/80 rounded border border-neutral-700 font-mono">⌘K</kbd>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {navigationData &&
              Object.entries(navigationData).map(([section, pages]: [string, any]) => (
                <div key={section}>
                  <p className="px-3 py-1 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                    {section}
                  </p>
                  <div className="mt-2 space-y-0.5">
                    {pages
                      .filter((page: any) =>
                        searchQuery
                          ? page.title.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((page: any) => {
                        const cleanSlug = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug;
                        const isActive = pageData?.slug === page.slug;
                        return (
                          <Link
                            key={page.slug}
                            to={`/sites/${slug}/${cleanSlug}`}
                            className={`group relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150 ease-in-out ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 font-medium shadow-sm'
                                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-500 rounded-r" />
                            )}
                            <span className="truncate">{page.title}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-800/50 px-4 py-3">
            <p className="text-xs text-neutral-600">
              Powered by <span className="text-neutral-400 font-medium hover:text-emerald-400 transition-colors cursor-pointer">Doxify</span>
            </p>
          </div>
        </aside>

        {/* CONTENT AREA WITH TOC */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN DOCS PANEL */}
          <main 
            ref={contentRef}
            className="flex-1 px-8 md:px-12 lg:px-20 py-16 bg-[#0A0A0A] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
          >
            {isPageLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : pageData ? (
              <article className="max-w-3xl mx-auto animate-in fade-in duration-300">
                <div
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-50
                    prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:leading-[1.1] prose-h1:font-extrabold
                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-neutral-800/30
                    prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:font-semibold
                    prose-p:text-neutral-400 prose-p:leading-relaxed prose-p:text-[15px] prose-p:mb-6
                    prose-a:text-emerald-400 prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:transition-colors prose-a:duration-150
                    prose-strong:text-neutral-200 prose-strong:font-semibold
                    prose-code:text-emerald-400 prose-code:bg-neutral-900/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] prose-code:before:content-[''] prose-code:after:content-[''] prose-code:border prose-code:border-neutral-800/50
                    prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-neutral-800/50 prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:p-4
                    prose-ul:text-neutral-400 prose-ul:leading-relaxed
                    prose-ol:text-neutral-400 prose-ol:leading-relaxed
                    prose-li:marker:text-neutral-600 prose-li:my-1
                    prose-blockquote:border-l-2 prose-blockquote:border-l-emerald-500/50 prose-blockquote:text-neutral-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-neutral-900/20 prose-blockquote:py-1 prose-blockquote:rounded-r
                    prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-neutral-800/30
                    prose-hr:border-neutral-800/30 prose-hr:my-12
                    prose-table:border-collapse prose-table:w-full
                    prose-th:bg-neutral-900/50 prose-th:border prose-th:border-neutral-800 prose-th:p-2 prose-th:text-left prose-th:text-neutral-300
                    prose-td:border prose-td:border-neutral-800 prose-td:p-2 prose-td:text-neutral-400
                  "
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              </article>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl mb-4">👀</div>
                <p className="text-neutral-500 text-lg">No content available</p>
                <p className="text-neutral-600 text-sm mt-2">This page hasn't been written yet</p>
              </div>
            )}
          </main>

          {/* RIGHT PANEL - Table of Contents (240px fixed, sticky) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-[240px] border-l border-neutral-800/50 bg-[#0D0D0D] overflow-y-auto shadow-lg shadow-black/5">
              <div className="px-5 py-6 sticky top-12">
                <p className="text-neutral-500 text-[11px] font-semibold mb-4 uppercase tracking-wider">
                  On This Page
                </p>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`block text-xs py-1.5 transition-all duration-150 ease-in-out rounded-md ${
                        activeHeading === item.id
                          ? 'text-emerald-400 font-medium bg-emerald-500/5 -ml-2 pl-2 pr-2 border-l-2 border-emerald-500'
                          : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30 -ml-2 pl-2 pr-2'
                      } ${
                        item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-5' : 'pl-8'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
