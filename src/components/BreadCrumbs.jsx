import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="breadcrumb" className="w-full py-4">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          
          return (
            <li key={i} className="flex items-center gap-2">
              {it.to && !isLast ? (
                <Link
                  to={it.to}
                  className="text-black/40 hover:text-gold transition-colors duration-300"
                >
                  {it.label}
                </Link>
              ) : (
                <span className="text-black cursor-default">
                  {it.label}
                </span>
              )}
              
              {/* Ayırıcı (Slash) */}
              {!isLast && (
                <span className="text-gold/50 text-[10px] font-light px-1">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}