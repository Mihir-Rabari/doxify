interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocsTOCProps {
  items: TocItem[];
  activeHeading: string;
}

export default function DocsTOC({ items, activeHeading }: DocsTOCProps) {
  if (items.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Scroll to element with offset for sticky header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="hidden xl:block w-[240px] border-l border-neutral-800/50 bg-[#0D0D0D] overflow-y-auto shadow-lg shadow-black/5">
      <div className="px-5 py-6 sticky top-12">
        <p className="text-neutral-500 text-[11px] font-semibold mb-4 uppercase tracking-wider">
          On This Page
        </p>
        <nav className="space-y-0.5">
          {items.map((item) => {
            const isActive = activeHeading === item.id;
            const paddingLeft = item.level === 1 ? 'pl-3' : item.level === 2 ? 'pl-6' : 'pl-9';
            
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  block text-xs py-2 px-3 rounded-md transition-all duration-200 ease-in-out
                  relative
                  ${paddingLeft}
                  ${
                    isActive
                      ? 'text-emerald-400 font-medium bg-emerald-500/10'
                      : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-500 rounded-r" />
                )}
                <span className="line-clamp-2">{item.text}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
