import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Home, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/ui/Loading';

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
    <div className="flex h-screen bg-[#0B0D0F] text-neutral-100">
      {/* LEFT SIDEBAR - Navigation (280px fixed) */}
      <aside className="w-[280px] h-screen border-r border-neutral-900 bg-[#0B0D0F] flex flex-col">
        {/* Project Header */}
        <div className="p-4">
          <Link to={`/sites/${slug}`} className="flex items-center gap-3 mb-6 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {projectData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-neutral-100 font-semibold text-sm truncate">{projectData.name}</h1>
              {projectData.description && (
                <p className="text-neutral-500 text-xs truncate">{projectData.description}</p>
              )}
            </div>
          </Link>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111315] border border-neutral-800 rounded-lg px-3 py-2 pl-9 text-sm text-neutral-300 placeholder-neutral-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
          {navigationData &&
            Object.entries(navigationData).map(([section, pages]: [string, any]) => (
              <div key={section}>
                <p className="text-xs text-neutral-500 mb-2 font-semibold uppercase tracking-wider">
                  {section}
                </p>
                <div className="space-y-0.5">
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
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150 ease-in-out ${
                            isActive
                              ? 'bg-white/5 text-neutral-100 font-medium'
                              : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/5'
                          }`}
                        >
                          {isActive && <ChevronRight className="w-3 h-3 text-emerald-500" />}
                          <span className="truncate">{page.title}</span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-900 p-4">
          <p className="text-xs text-neutral-600 text-center">
            Powered by <span className="text-neutral-300 font-medium">Doxify</span>
          </p>
        </div>
      </aside>

      {/* CENTER - Main Content + Right TOC */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between border-b border-neutral-900 bg-[#0E1012] px-6 py-3 shrink-0">
          <h1 className="text-neutral-100 font-semibold text-base truncate">
            {pageData?.title || projectData.name}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-white/5 rounded-lg transition-all duration-150"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Content Area with TOC */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN DOCS PANEL */}
          <main 
            ref={contentRef}
            className="flex-1 px-12 py-10 bg-[#0B0D0F] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
          >
            {isPageLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : pageData ? (
              <article className="max-w-3xl">
                <div
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-semibold prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-neutral-800
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-neutral-300 prose-p:leading-relaxed
                    prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-neutral-100 prose-strong:font-semibold
                    prose-code:text-emerald-400 prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
                    prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl
                    prose-ul:text-neutral-300
                    prose-ol:text-neutral-300
                    prose-li:marker:text-neutral-500
                    prose-blockquote:border-l-emerald-500 prose-blockquote:text-neutral-400 prose-blockquote:italic
                  "
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              </article>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500">No content available</p>
              </div>
            )}
          </main>

          {/* RIGHT PANEL - Table of Contents (240px fixed) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block w-[240px] border-l border-neutral-900 bg-[#0B0D0F] overflow-y-auto">
              <div className="p-5 sticky top-0">
                <p className="text-neutral-500 text-xs font-semibold mb-4 uppercase tracking-wider">
                  On This Page
                </p>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`block text-sm transition-all duration-150 ease-in-out ${
                        activeHeading === item.id
                          ? 'text-emerald-400 font-medium'
                          : 'text-neutral-400 hover:text-neutral-100'
                      } ${
                        item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8'
                      }`}
                      style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}
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
