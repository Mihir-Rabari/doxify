import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function useTableOfContents(content: string) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!content) {
      setToc([]);
      return;
    }

    // Parse HTML headings from TipTap editor
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const headings: TocItem[] = Array.from(headingElements).map((heading) => {
      const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2, etc.
      const text = heading.textContent?.trim() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return { id, text, level };
    });

    setToc(headings);
  }, [content]);

  return toc;
}
