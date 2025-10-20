import path from 'path';
import fs from 'fs-extra';

export async function generateStaticSite(project: any, pages: any[]): Promise<string> {
  const exportDir = path.join(__dirname, '../../export', project.slug);

  // Clean and create export directory
  await fs.remove(exportDir);
  await fs.ensureDir(exportDir);

  // Generate package.json
  await generatePackageJson(exportDir, project);

  // Generate Next.js config
  await generateNextConfig(exportDir);

  // Generate theme config
  await generateThemeConfig(exportDir, project.theme);

  // Generate app directory structure
  const appDir = path.join(exportDir, 'app');
  await fs.ensureDir(appDir);

  // Generate layout
  await generateLayout(appDir, project);

  // Generate pages
  for (const page of pages) {
    await generatePage(appDir, page);
  }

  // Generate components
  await generateComponents(exportDir);

  // Generate styles
  await generateStyles(exportDir, project.theme);

  // Generate README
  await generateReadme(exportDir, project);

  return exportDir;
}

async function generatePackageJson(exportDir: string, project: any) {
  const packageJson = {
    name: project.slug,
    version: '1.0.0',
    description: project.description || `Documentation for ${project.name}`,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      export: 'next build && next export',
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^18.2.0',
      typescript: '^5.3.0',
      autoprefixer: '^10.4.16',
      postcss: '^8.4.32',
      tailwindcss: '^3.4.0',
    },
  };

  await fs.writeJson(path.join(exportDir, 'package.json'), packageJson, { spaces: 2 });
}

async function generateNextConfig(exportDir: string) {
  const config = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
`;

  await fs.writeFile(path.join(exportDir, 'next.config.js'), config);
}

async function generateThemeConfig(exportDir: string, theme: any) {
  const configDir = path.join(exportDir, 'config');
  await fs.ensureDir(configDir);
  await fs.writeJson(path.join(configDir, 'theme.json'), theme, { spaces: 2 });
}

async function generateLayout(appDir: string, project: any) {
  const layout = `import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description || 'Documentation'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`;

  await fs.writeFile(path.join(appDir, 'layout.tsx'), layout);

  const homePage = `export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">${project.name}</h1>
      <p className="text-gray-600">${project.description || 'Welcome to the documentation'}</p>
    </main>
  )
}
`;

  await fs.writeFile(path.join(appDir, 'page.tsx'), homePage);
}

async function generatePage(appDir: string, page: any) {
  const pageDir = path.join(appDir, page.slug.slice(1) || 'index');
  await fs.ensureDir(pageDir);

  const pageContent = `import DocRenderer from '@/components/DocRenderer'

const pageData = ${JSON.stringify(page, null, 2)}

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <DocRenderer blocks={pageData.blocks} />
    </main>
  )
}
`;

  await fs.writeFile(path.join(pageDir, 'page.tsx'), pageContent);
}

async function generateComponents(exportDir: string) {
  const componentsDir = path.join(exportDir, 'components');
  await fs.ensureDir(componentsDir);

  const docRenderer = `interface Block {
  type: string
  content: string
  lang?: string
  variant?: string
  meta?: Record<string, any>
}

interface DocRendererProps {
  blocks: Block[]
}

export default function DocRenderer({ blocks }: DocRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            const Tag = \`h\${block.meta?.depth || 1}\` as any
            return <Tag key={index} className="font-bold mt-6 mb-4">{block.content}</Tag>
          
          case 'paragraph':
            return <p key={index} className="mb-4">{block.content}</p>
          
          case 'code':
            return (
              <pre key={index} className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4">
                <code className={\`language-\${block.lang}\`}>{block.content}</code>
              </pre>
            )
          
          case 'note':
          case 'warning':
          case 'info':
          case 'danger':
            return (
              <div key={index} className={\`p-4 mb-4 rounded-lg border-l-4 \${
                block.variant === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                block.variant === 'danger' ? 'bg-red-50 border-red-500' :
                block.variant === 'info' ? 'bg-blue-50 border-blue-500' :
                'bg-green-50 border-green-500'
              }\`}>
                {block.content}
              </div>
            )
          
          case 'blockquote':
            return (
              <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic mb-4">
                {block.content}
              </blockquote>
            )
          
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside mb-4">
                {block.content.split('\\n').map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          
          default:
            return <div key={index}>{block.content}</div>
        }
      })}
    </div>
  )
}
`;

  await fs.writeFile(path.join(componentsDir, 'DocRenderer.tsx'), docRenderer);
}

async function generateStyles(exportDir: string, theme: any) {
  const appDir = path.join(exportDir, 'app');
  
  const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: ${theme?.primary || '#3ECF8E'};
  --secondary: ${theme?.secondary || '#1F1F1F'};
  --background: ${theme?.background || '#FFFFFF'};
  --foreground: ${theme?.foreground || '#1F1F1F'};
  --accent: ${theme?.accent || '#3ECF8E'};
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: ${theme?.font || 'Inter'}, sans-serif;
}
`;

  await fs.writeFile(path.join(appDir, 'globals.css'), globals);

  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
}
`;

  await fs.writeFile(path.join(exportDir, 'tailwind.config.js'), tailwindConfig);

  // PostCSS config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  await fs.writeFile(path.join(exportDir, 'postcss.config.js'), postcssConfig);
}

async function generateReadme(exportDir: string, project: any) {
  const readme = `# ${project.name}

${project.description || 'Documentation site generated by Doxify'}

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

\`\`\`bash
npm run build
\`\`\`

## Export Static Site

\`\`\`bash
npm run export
\`\`\`

---

Generated by [Doxify](https://github.com/doxify) 🚀
`;

  await fs.writeFile(path.join(exportDir, 'README.md'), readme);
}
