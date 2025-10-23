import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const LANGUAGES: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  swift: 'Swift',
  kotlin: 'Kotlin',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  sql: 'SQL',
  bash: 'Bash',
  shell: 'Shell',
  plaintext: 'Plain Text',
};

export default function ReadOnlyCodeBlock({ node }: any) {
  const [copied, setCopied] = useState(false);
  const language = node.attrs.language || 'plaintext';
  const languageLabel = LANGUAGES[language] || language;

  const handleCopy = async () => {
    const code = node.textContent.replace(/\n$/, ''); // Remove trailing newline
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative group">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 py-2 rounded-t-lg">
        {/* Language Label (Read-only) */}
        <div className="text-xs text-gray-600 dark:text-neutral-400 font-medium">
          {languageLabel}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="!bg-gray-50 dark:!bg-[#0a0a0a] !rounded-t-none !mt-0 !mb-4">
        <NodeViewContent as={"code" as any} />
      </pre>
    </NodeViewWrapper>
  );
}
