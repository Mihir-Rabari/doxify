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
    <div className="flex flex-col h-screen bg-[#0D0D0D] text-neutral-100">
      {/* TOP HEADER BAR */}
      <header className="h-12 border-b border-neutral-900 bg-[#0D0D0D] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="text-neutral-100 font-semibold text-sm">Docs</span>
          </Link>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <ChevronRight className="w-3 h-3" />
            <Link to={`/sites/${slug}`} className="hover:text-neutral-200 transition-colors">
              {projectData.name}
            </Link>
            {pageData && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-neutral-200">{pageData.title}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 rounded-md transition-all"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - Navigation (240px fixed, narrower) */}
        <aside className="w-[240px] h-full border-r border-neutral-900 bg-[#0D0D0D] flex flex-col">
          {/* Search Bar at Top */}
          <div className="p-3 border-b border-neutral-900">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border-0 rounded-md px-3 py-1.5 pl-9 text-sm text-neutral-300 placeholder-neutral-500 focus:ring-1 focus:ring-neutral-700 focus:outline-none transition-all"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-xs text-neutral-500 bg-neutral-800 rounded border border-neutral-700">⌘K</kbd>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {navigationData &&
              Object.entries(navigationData).map(([section, pages]: [string, any]) => (
                <div key={section} className="mb-4">
                  <p className="px-3 py-1.5 text-xs text-neutral-500 font-medium uppercase tracking-wider">
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
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all ${
                              isActive
                                ? 'bg-neutral-800/50 text-neutral-100 font-medium'
                                : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/30'
                            }`}
                          >
                            <span className="truncate">{page.title}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-900 px-3 py-2">
            <p className="text-xs text-neutral-600">
              Powered by <span className="text-neutral-400 font-medium">Doxify</span>
            </p>
          </div>
        </aside>

        {/* CONTENT AREA WITH TOC */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN DOCS PANEL */}
          <main 
            ref={contentRef}
            className="flex-1 px-16 py-12 bg-[#0D0D0D] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
          >
            {isPageLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : pageData ? (
              <article className="max-w-3xl mx-auto">
                <div
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-100
                    prose-h1:text-5xl prose-h1:mb-4 prose-h1:mt-0 prose-h1:leading-tight
                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4
                    prose-p:text-neutral-400 prose-p:leading-relaxed prose-p:text-base
                    prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                    prose-strong:text-neutral-200 prose-strong:font-semibold
                    prose-code:text-emerald-400 prose-code:bg-neutral-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
                    prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-lg prose-pre:shadow-lg
                    prose-ul:text-neutral-400
                    prose-ol:text-neutral-400
                    prose-li:marker:text-neutral-600
                    prose-blockquote:border-l-2 prose-blockquote:border-l-neutral-700 prose-blockquote:text-neutral-500 prose-blockquote:pl-4
                    prose-img:rounded-lg prose-img:shadow-2xl
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

          {/* RIGHT PANEL - Table of Contents (220px fixed) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-[220px] border-l border-neutral-900 bg-[#0D0D0D] overflow-y-auto">
              <div className="px-4 py-6 sticky top-0">
                <p className="text-neutral-500 text-xs font-semibold mb-3 uppercase tracking-wider">
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
                      className={`block text-xs py-1 transition-colors ${
                        activeHeading === item.id
                          ? 'text-neutral-200 font-medium'
                          : 'text-neutral-500 hover:text-neutral-300'
                      } ${
                        item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-3' : 'pl-6'
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
