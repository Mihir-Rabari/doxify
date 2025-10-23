import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { PublicCodeBlockExtension } from './PublicCodeBlockExtension';
import '../Editor/editor-styles.css';

const lowlight = createLowlight(common);

interface PublicDocViewerProps {
  content: string;
}

export default function PublicDocViewer({ content }: PublicDocViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CustomCodeBlock instead
      }),
      Typography,
      Link.configure({
        openOnClick: true, // Allow clicking links in read-only mode
        HTMLAttributes: {
          class: 'text-emerald-400 hover:text-emerald-300 underline cursor-pointer transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      PublicCodeBlockExtension.configure({
        lowlight,
      }),
    ],
    content,
    editable: false, // Read-only mode
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-invert max-w-none focus:outline-none px-2',
      },
    },
  });

  // Update content when it changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      queueMicrotask(() => {
        editor.commands.setContent(content);
      });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="public-doc-viewer">
      <EditorContent editor={editor} />
    </div>
  );
}
