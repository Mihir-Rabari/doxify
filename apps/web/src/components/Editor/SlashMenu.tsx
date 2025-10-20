import { Editor } from '@tiptap/react';
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
}

interface SlashMenuProps {
  editor: Editor;
  onSelect: () => void;
}

export default function SlashMenu({ editor, onSelect }: SlashMenuProps) {
  const items: SlashMenuItem[] = [
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: <Heading1 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Heading2 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Heading3 className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: <List className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: <ListOrdered className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: 'Task List',
      description: 'Track tasks with a checklist',
      icon: <CheckSquare className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet',
      icon: <Code className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: <Quote className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: <Minus className="w-5 h-5" />,
      command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  const handleSelect = (item: SlashMenuItem) => {
    item.command(editor);
    onSelect();
  };

  return (
    <div className="w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSelect(item)}
            className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
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
