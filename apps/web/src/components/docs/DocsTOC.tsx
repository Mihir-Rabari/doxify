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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="hidden xl:block w-[240px] border-l border-neutral-800/50 bg-[#0D0D0D] overflow-y-auto shadow-lg shadow-black/5">
      <div className="px-5 py-6 sticky top-12">
        <p className="text-neutral-500 text-[11px] font-semibold mb-4 uppercase tracking-wider">
          On This Page
        </p>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block text-xs py-1.5 transition-all duration-150 ease-in-out rounded-md ${
                activeHeading === item.id
                  ? 'text-emerald-400 font-medium bg-emerald-500/5 -ml-2 pl-2 pr-2 border-l-2 border-emerald-500'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30 -ml-2 pl-2 pr-2'
              } ${
                item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-5' : 'pl-8'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
