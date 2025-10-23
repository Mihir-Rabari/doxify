import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Loading from '../ui/Loading';
import PublicDocViewer from './PublicDocViewer';

interface DocsContentProps {
  content?: string;
  isLoading: boolean;
  projectName: string;
  projectSlug: string;
  pageTitle?: string;
}

const DocsContent = forwardRef<HTMLDivElement, DocsContentProps>(
  ({ content, isLoading, projectName, projectSlug, pageTitle }, ref) => {
    if (isLoading) {
      return (
        <main className="flex-1 px-8 md:px-12 lg:px-20 py-16 bg-[#0A0A0A] overflow-y-auto flex items-center justify-center">
          <Loading />
        </main>
      );
    }

    if (!content) {
      return (
        <main className="flex-1 px-8 md:px-12 lg:px-20 py-16 bg-[#0A0A0A] overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl mb-4">👀</div>
            <p className="text-neutral-500 text-lg">No content available</p>
            <p className="text-neutral-600 text-sm mt-2">This page hasn't been written yet</p>
          </div>
        </main>
      );
    }

    return (
      <main
        ref={ref}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent bg-[#0A0A0A]"
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 px-8 md:px-12 lg:px-20 pt-8 pb-4">
            <Link to={`/sites/${projectSlug}`} className="hover:text-neutral-200 transition-colors duration-150">
              {projectName}
            </Link>
            {pageTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-neutral-300 font-medium">{pageTitle}</span>
              </>
            )}
          </div>

          {/* Public Documentation Viewer */}
          <div className="px-8 md:px-12 lg:px-20 pb-12">
            <PublicDocViewer content={content} />
          </div>
        </div>
      </main>
    );
  }
);

DocsContent.displayName = 'DocsContent';

export default DocsContent;
