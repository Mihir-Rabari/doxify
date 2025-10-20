import { useTableOfContents } from '@/hooks/useTableOfContents';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const toc = useTableOfContents(content);

  if (toc.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4">
        No headings found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {toc.map((item, index) => (
        <a
          key={index}
          href={`#${item.id}`}
          className={`
            block py-1.5 px-3 text-sm rounded-lg transition-colors
            hover:bg-gray-100 dark:hover:bg-gray-800
            text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400
          `}
          style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
        >
          {item.text}
        </a>
      ))}
    </div>
  );
}

interface TocSidebarProps {
  content: string;
  isOpen: boolean;
}

export function TocSidebar({ content, isOpen }: TocSidebarProps) {
  const toc = useTableOfContents(content);

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <List className="w-4 h-4" />
          Table of Contents
        </div>
      </div>
      <div className="p-2">
        <TableOfContents content={content} />
      </div>
    </div>
  );
}
