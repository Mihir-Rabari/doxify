import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';

export async function render(content: string, format: string = 'mdx'): Promise<string> {
  // Remove frontmatter for rendering
  const { content: markdownContent } = matter(content);

  // Custom directive transformer
  const directiveTransformer = () => {
    return (tree: any) => {
      visit(tree, (node: any) => {
        if (
          node.type === 'containerDirective' ||
          node.type === 'leafDirective' ||
          node.type === 'textDirective'
        ) {
          const data = node.data || (node.data = {});
          const hName = node.name || 'div';
          const hProperties = node.attributes || {};
          
          // Add classes based on directive type
          hProperties.className = `doxify-${hName} ${hProperties.className || ''}`.trim();

          data.hName = 'div';
          data.hProperties = hProperties;
        }
      });
    };
  };

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(directiveTransformer)
    .use(remarkRehype)
    .use(rehypeStringify);

  const result = await processor.process(markdownContent);
  return String(result);
}
