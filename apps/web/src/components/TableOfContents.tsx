import { useTableOfContents } from '@/hooks/useTableOfContents';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
  onItemClick?: (id: string) => void;
}

export default function TableOfContents({ content, onItemClick }: TableOfContentsProps) {
  const toc = useTableOfContents(content);

  if (toc.length === 0) {
    return (
      <div className="p-4 text-center">
        <List className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-neutral-600 opacity-50" />
        <p className="text-sm text-gray-500 dark:text-neutral-500">
          No headings yet
        </p>
        <p className="text-xs text-gray-400 dark:text-neutral-600 mt-1">
          Add headings to see them here
        </p>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.querySelector(`[data-toc-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onItemClick?.(id);
  };

  return (
    <div className="space-y-0.5">
      {toc.map((item, index) => (
        <a
          key={index}
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          className={`
            block py-1.5 px-3 text-sm rounded-lg transition-colors cursor-pointer
            hover:bg-gray-50 dark:hover:bg-neutral-800
            text-gray-700 dark:text-neutral-300 
            hover:text-emerald-600 dark:hover:text-emerald-400
            ${item.level === 1 ? 'font-medium' : ''}
          `}
          style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
          title={item.text}
        >
          <span className="truncate block">{item.text}</span>
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
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white dark:bg-[#0C0C0C] border-l border-gray-200 dark:border-neutral-800 overflow-y-auto flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <List className="w-4 h-4" />
          On This Page
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <TableOfContents content={content} />
      </div>
    </div>
  );
}
