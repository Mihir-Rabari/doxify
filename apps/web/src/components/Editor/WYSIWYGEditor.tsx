import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { SlashCommand, renderSlashMenu } from './SlashCommandExtension';
import { CustomCodeBlock } from './CodeBlockExtension';
import './editor-styles.css';
import 'tippy.js/dist/tippy.css';

const lowlight = createLowlight(common);

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function WYSIWYGEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...', 
  editable = true 
}: WYSIWYGEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-500 hover:text-emerald-600 underline cursor-pointer',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CustomCodeBlock.configure({
        lowlight,
      }),
      SlashCommand.configure({
        suggestion: {
          ...renderSlashMenu(),
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-6',
      },
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="wysiwyg-editor h-full">
      <EditorContent editor={editor} />
    </div>
  );
}
