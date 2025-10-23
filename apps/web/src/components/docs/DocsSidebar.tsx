import { Link } from 'react-router-dom';

interface SidebarItemProps {
  title: string;
  slug: string;
  isActive: boolean;
  projectSlug: string;
}

function SidebarItem({ title, slug, isActive, projectSlug }: SidebarItemProps) {
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  
  return (
    <Link
      to={`/sites/${projectSlug}/${cleanSlug}`}
      className={`group relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150 ease-in-out ${
        isActive
          ? 'bg-emerald-500/10 text-emerald-400 font-medium shadow-sm'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-500 rounded-r" />
      )}
      <span className="truncate">{title}</span>
    </Link>
  );
}

interface DocsSidebarProps {
  projectName: string;
  projectDescription?: string;
  projectSlug: string;
  navigationData: Record<string, any[]>;
  currentPageSlug?: string;
}

export default function DocsSidebar({
  projectSlug,
  navigationData,
  currentPageSlug,
}: DocsSidebarProps) {
  return (
    <aside className="w-[260px] h-full border-r border-neutral-800/50 bg-[#0D0D0D] flex flex-col shadow-lg shadow-black/5">
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {navigationData &&
          Object.entries(navigationData).map(([section, pages]) => (
            <div key={section}>
              <p className="px-3 py-1 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                {section}
              </p>
              <div className="mt-2 space-y-0.5">
                {pages.map((page: any) => (
                    <SidebarItem
                      key={page.slug}
                      title={page.title}
                      slug={page.slug}
                      isActive={currentPageSlug === page.slug}
                      projectSlug={projectSlug}
                    />
                  ))}
              </div>
            </div>
          ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-800/50 px-4 py-3">
        <p className="text-xs text-neutral-600">
          Powered by{' '}
          <span className="text-neutral-400 font-medium hover:text-emerald-400 transition-colors cursor-pointer">
            Doxify
          </span>
        </p>
      </div>
    </aside>
  );
}
