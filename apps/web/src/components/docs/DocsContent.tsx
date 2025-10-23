import { forwardRef } from 'react';
import Loading from '../ui/Loading';

interface DocsContentProps {
  content?: string;
  isLoading: boolean;
}

const DocsContent = forwardRef<HTMLDivElement, DocsContentProps>(
  ({ content, isLoading }, ref) => {
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
        className="flex-1 px-8 md:px-12 lg:px-20 py-16 bg-[#0A0A0A] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
      >
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
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </main>
    );
  }
);

DocsContent.displayName = 'DocsContent';

export default DocsContent;
