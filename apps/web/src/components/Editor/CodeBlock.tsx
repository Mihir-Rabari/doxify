import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { Check, Copy, Wand2 } from 'lucide-react';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'plaintext', label: 'Plain Text' },
];

export default function CodeBlock({ node, updateAttributes, extension }: any) {
  const [copied, setCopied] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const language = node.attrs.language || 'plaintext';

  // Auto-detect language when code content changes and language is plaintext
  useEffect(() => {
    const code = node.textContent?.trim();
    
    // Only auto-detect if:
    // 1. Language is plaintext
    // 2. There's actual code content
    // 3. Code has more than 10 characters (to avoid false detections)
    if (language === 'plaintext' && code && code.length > 10) {
      const timeoutId = setTimeout(() => {
        try {
          const result = lowlight.highlightAuto(code);
          if (result.data && result.data.language && result.data.language !== 'plaintext') {
            updateAttributes({ language: result.data.language });
          }
        } catch (error) {
          // Silently fail - user can manually select language
        }
      }, 1000); // Wait 1 second after typing stops

      return () => clearTimeout(timeoutId);
    }
  }, [node.textContent, language, updateAttributes]);

  // Manual auto-detect language
  const handleAutoDetect = () => {
    setDetecting(true);
    const code = node.textContent;
    
    try {
      // Use lowlight's automatic detection
      const result = lowlight.highlightAuto(code);
      if (result.data && result.data.language) {
        updateAttributes({ language: result.data.language });
      }
    } catch (error) {
      console.error('Language detection failed:', error);
    } finally {
      setTimeout(() => setDetecting(false), 500);
    }
  };

  const handleCopy = async () => {
    const code = node.textContent.replace(/\n$/, ''); // Remove trailing newline
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({ language: e.target.value });
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative group">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 py-2 rounded-t-lg">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="text-xs bg-transparent text-gray-600 dark:text-neutral-400 border-none outline-none cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            contentEditable={false}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Auto-detect button */}
          <button
            onClick={handleAutoDetect}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded transition-colors"
            contentEditable={false}
            title="Auto-detect language"
          >
            <Wand2 className={`w-3 h-3 ${detecting ? 'animate-spin' : ''}`} />
            {detecting ? 'Detecting...' : 'Auto'}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded transition-colors"
          contentEditable={false}
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
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
