import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

interface Block {
  type: string;
  content: string;
  lang?: string;
  variant?: string;
  meta?: Record<string, any>;
}

interface ParsedContent {
  metadata: Record<string, any>;
  blocks: Block[];
  raw: string;
}

export async function parse(content: string, format: string = 'mdx'): Promise<ParsedContent> {
  // Extract frontmatter
  const { data: metadata, content: markdownContent } = matter(content);

  // Parse markdown to AST
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkDirective);

  const tree = processor.parse(markdownContent);
  const blocks: Block[] = [];

  // Convert AST to structured blocks
  visit(tree, (node: any) => {
    switch (node.type) {
      case 'heading':
        blocks.push({
          type: 'heading',
          content: toString(node),
          meta: {
            depth: node.depth,
          },
        });
        break;

      case 'paragraph':
        blocks.push({
          type: 'paragraph',
          content: toString(node),
        });
        break;

      case 'code':
        blocks.push({
          type: 'code',
          content: node.value || '',
          lang: node.lang || 'text',
          meta: node.meta ? { meta: node.meta } : undefined,
        });
        break;

      case 'blockquote':
        blocks.push({
          type: 'blockquote',
          content: toString(node),
        });
        break;

      case 'list':
        blocks.push({
          type: 'list',
          content: toString(node),
          meta: {
            ordered: node.ordered || false,
          },
        });
        break;

      case 'containerDirective':
      case 'leafDirective':
      case 'textDirective':
        // Handle custom directives like :::note, :::warning
        const directiveName = node.name || 'note';
        blocks.push({
          type: directiveName,
          content: toString(node),
          variant: directiveName,
          meta: node.attributes || {},
        });
        break;

      case 'image':
        blocks.push({
          type: 'image',
          content: node.url || '',
          meta: {
            alt: node.alt || '',
            title: node.title || '',
          },
        });
        break;

      case 'link':
        blocks.push({
          type: 'link',
          content: toString(node),
          meta: {
            url: node.url || '',
            title: node.title || '',
          },
        });
        break;

      case 'table':
        blocks.push({
          type: 'table',
          content: toString(node),
        });
        break;
    }
  });

  return {
    metadata,
    blocks,
    raw: content,
  };
}
