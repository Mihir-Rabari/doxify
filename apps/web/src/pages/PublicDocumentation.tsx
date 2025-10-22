import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Menu, X, Search, Home, List } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocOpen, setTocOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Extract table of contents from page content
  const tableOfContents = useMemo(() => {
    if (!pageData?.content) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pageData.content;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3');
    const toc: TocItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      
      // Add ID to heading if not present
      if (!heading.id) {
        heading.id = id;
      }
      
      toc.push({ id: heading.id || id, text, level });
    });
    
    return toc;
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
    <div className="flex h-screen bg-gray-50 dark:bg-[#0B0B0B]">
      {/* Sidebar - Navigation */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0C0C0C] transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <Link to={`/sites/${slug}`} className="flex items-center gap-3 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-gray-900 dark:text-white truncate">{projectData.name}</h1>
              {projectData.description && (
                <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">{projectData.description}</p>
              )}
            </div>
          </Link>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {navigationData &&
            Object.entries(navigationData).map(([section, pages]: [string, any]) => (
              <div key={section} className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase mb-2">
                  {section}
                </h3>
                <div className="space-y-1">
                  {pages
                    .filter((page: any) =>
                      searchQuery
                        ? page.title.toLowerCase().includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((page: any) => {
                      // Remove leading slash from page slug if present
                      const pageSlug = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug;
                      return (
                      <Link
                        key={page.slug}
                        to={`/sites/${slug}/${pageSlug}`}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          pageData?.slug === page.slug
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {page.title}
                      </Link>
                    );
                    })}
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
          <a
            href="https://doxify.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 dark:text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
          >
            Powered by <span className="font-semibold">Doxify</span>
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-14 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0B0B0B] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {pageData && (
              <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {pageData.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <List className="w-4 h-4" />
              On this page
            </button>
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {isPageLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : pageData ? (
              <article className="max-w-4xl mx-auto px-8 py-12">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              </article>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 dark:text-neutral-400">No content available</p>
              </div>
            )}
          </main>

          {/* Table of Contents Sidebar */}
          {tocOpen && tableOfContents.length > 0 && (
            <aside className="hidden lg:block w-64 border-l border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0C0C0C] overflow-y-auto">
              <div className="p-6 sticky top-0">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase mb-4 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  On This Page
                </h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                        item.level === 1
                          ? 'font-medium text-gray-900 dark:text-white'
                          : item.level === 2
                          ? 'pl-4 text-gray-700 dark:text-neutral-300'
                          : 'pl-8 text-gray-600 dark:text-neutral-400'
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
