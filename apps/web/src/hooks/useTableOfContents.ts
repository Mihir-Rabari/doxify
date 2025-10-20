import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function useTableOfContents(content: string) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    // Parse markdown headings
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({ id, text, level });
    }

    setToc(headings);
  }, [content]);

  return toc;
}
