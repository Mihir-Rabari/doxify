import { Editor } from '@tiptap/react';
import { useState, useEffect, useRef } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Code, 
  Quote, 
  Minus,
} from 'lucide-react';

interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
  searchTerms: string[];
}

interface SlashMenuProps {
  editor: Editor;
  query?: string;
  onSelect: () => void;
}

export default function SlashMenu({ editor, query = '', onSelect }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items: SlashMenuItem[] = [
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: <Heading1 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      searchTerms: ['heading', 'h1', 'title', 'big'],
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Heading2 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      searchTerms: ['heading', 'h2', 'subtitle', 'medium'],
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Heading3 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      searchTerms: ['heading', 'h3', 'small'],
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: <List className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
      searchTerms: ['bullet', 'list', 'ul', 'unordered'],
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: <ListOrdered className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      searchTerms: ['numbered', 'list', 'ol', 'ordered', 'number'],
    },
    {
      title: 'Task List',
      description: 'Track tasks with a checklist',
      icon: <CheckSquare className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
      searchTerms: ['task', 'todo', 'checklist', 'checkbox', 'check'],
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet',
      icon: <Code className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      searchTerms: ['code', 'block', 'snippet', 'pre'],
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: <Quote className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      searchTerms: ['quote', 'blockquote', 'cite'],
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: <Minus className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().setHorizontalRule().run(),
      searchTerms: ['divider', 'hr', 'line', 'separator', 'horizontal'],
    },
  ];

  // Filter items based on query
  const filteredItems = items.filter((item) => {
    const searchQuery = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.searchTerms.some((term) => term.includes(searchQuery))
    );
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleSelect = (item: SlashMenuItem) => {
    item.command(editor);
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (filteredItems.length === 0) {
    return (
      <div className="w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden p-4">
        <p className="text-sm text-gray-500 dark:text-neutral-500 text-center">
          No results found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div 
      className="w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {filteredItems.map((item, index) => (
          <button
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => handleSelect(item)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${
              index === selectedIndex
                ? 'bg-emerald-50 dark:bg-emerald-500/10'
                : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
              index === selectedIndex
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10'
            }`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${
                index === selectedIndex
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {item.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-neutral-500 truncate">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
