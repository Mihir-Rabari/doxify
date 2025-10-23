import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState, useEffect, useRef } from 'react';
import { Check, Copy, Wand2 } from 'lucide-react';
import { ModelOperations } from '@vscode/vscode-languagedetection';

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

// Language mapping from VSCode detection to lowlight/highlight.js names
const LANGUAGE_MAP: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'sh': 'bash',
  'cs': 'csharp',
  'c++': 'cpp',
  'c': 'cpp',
  'rs': 'rust',
  'go': 'go',
  'php': 'php',
  'java': 'java',
  'kt': 'kotlin',
  'swift': 'swift',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'md': 'markdown',
  'sql': 'sql',
};

export default function CodeBlock({ node, updateAttributes }: any) {
  const [copied, setCopied] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const detectorRef = useRef<ModelOperations | null>(null);
  const language = node.attrs.language || 'plaintext';

  // Initialize language detector
  useEffect(() => {
    const initDetector = async () => {
      try {
        detectorRef.current = new ModelOperations();
      } catch (error) {
        console.error('Failed to initialize language detector:', error);
      }
    };
    initDetector();
  }, []);

  // Auto-detect language when code content changes and language is plaintext
  useEffect(() => {
    const code = node.textContent?.trim();
    
    if (language === 'plaintext' && code && code.length > 20 && detectorRef.current) {
      const timeoutId = setTimeout(async () => {
        try {
          const results = await detectorRef.current!.runModel(code);
          if (results && results.length > 0) {
            const topResult = results[0];
            const detectedLang = LANGUAGE_MAP[topResult.languageId] || topResult.languageId;
            
            if (topResult.confidence > 0.2 && detectedLang !== 'plaintext') {
              updateAttributes({ language: detectedLang });
            }
          }
        } catch (error) {
          // Silently fail
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [node.textContent, language, updateAttributes]);

  // Manual auto-detect language
  const handleAutoDetect = async () => {
    if (!detectorRef.current) return;
    
    setDetecting(true);
    const code = node.textContent;
    
    try {
      const results = await detectorRef.current.runModel(code);
      if (results && results.length > 0) {
        const topResult = results[0];
        const detectedLang = LANGUAGE_MAP[topResult.languageId] || topResult.languageId;
        updateAttributes({ language: detectedLang });
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
        <NodeViewContent as={"code" as any} />
      </pre>
    </NodeViewWrapper>
  );
}
