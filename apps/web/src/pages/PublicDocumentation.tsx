import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Loading from '../components/ui/Loading';
import DocsHeader from '../components/docs/DocsHeader';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsContent from '../components/docs/DocsContent';
import DocsTOC from '../components/docs/DocsTOC';

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
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent?.trim() || '';
      
      if (!text) return; // Skip empty headings
      
      // Generate clean ID from text
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')     // Replace spaces with dashes
        .replace(/-+/g, '-')      // Replace multiple dashes with single
        .trim();
      
      toc.push({ id, text, level });
    });
    
    return toc;
  }, [pageData]);

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const headings = contentRef.current.querySelectorAll('h1, h2, h3');
      
      // Find the heading closest to the top of the viewport
      let currentHeading = '';
      let closestDistance = Infinity;
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100); // 100px offset from top
        
        if (rect.top <= 150 && distance < closestDistance) {
          closestDistance = distance;
          currentHeading = heading.id;
        }
      });
      
      // If no heading is above the threshold, use the first one
      if (!currentHeading && headings.length > 0) {
        currentHeading = (headings[0] as HTMLElement).id;
      }
      
      setActiveHeading(currentHeading);
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      handleScroll(); // Call once on mount
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [pageData]);

  // Add IDs to headings in content (must match TOC IDs)
  useEffect(() => {
    if (!contentRef.current || !pageData?.content) return;
    
    const headings = contentRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => {
      const text = heading.textContent?.trim() || '';
      
      if (text && !heading.id) {
        // Use same ID generation as TOC
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        heading.id = id;
      }
    });
    
    // Trigger initial scroll spy after IDs are set
    setTimeout(() => {
      const event = new Event('scroll');
      contentRef.current?.dispatchEvent(event);
    }, 100);
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
      {/* TOP HEADER */}
      <DocsHeader
        projectName={projectData.name}
        projectSlug={slug!}
        projectId={projectData._id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <DocsSidebar
          projectName={projectData.name}
          projectDescription={projectData.description}
          projectSlug={slug!}
          navigationData={navigationData || {}}
          currentPageSlug={pageData?.slug}
        />

        {/* CONTENT & TOC */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN CONTENT */}
          <DocsContent
            ref={contentRef}
            content={pageData?.content}
            isLoading={isPageLoading}
            projectName={projectData.name}
            projectSlug={slug!}
            pageTitle={pageData?.title}
          />

          {/* TABLE OF CONTENTS */}
          <DocsTOC items={tableOfContents} activeHeading={activeHeading} />
        </div>
      </div>
    </div>
  );
}
