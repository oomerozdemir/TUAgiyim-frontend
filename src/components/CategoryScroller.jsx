import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Kategorileri yatay chip'lerle gösterir.
 * - `activeSlug`: aktif kategori
 * - `showAll`: başta "Tümü" chip'i
 */
export default function CategoryScroller({ activeSlug = "", showAll = true }) {
  const [cats, setCats] = useState([]);
  const scrollerRef = useRef(null);
  const { pathname } = useLocation();
  const { slug } = useParams();

  // kategorileri al
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        setCats(Array.isArray(data?.items) ? data.items : data); 
      } catch (e) {
        console.error("Kategoriler alınamadı:", e);
      }
    })();
  }, []);

  const scrollBy = (x) => scrollerRef.current?.scrollBy({ left: x, behavior: "smooth" });

  const isActive = (s) => (activeSlug || slug) === s;

  return (
    <div className="w-full flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy(-280)}
        className="shrink-0 w-8 h-8 grid place-items-center rounded-md border border-beige/60 bg-white hover:bg-gold/90 hover:text-black transition"
        aria-label="Sola kaydır"
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={scrollerRef}
        className="flex-1 overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-3 min-w-max px-1">
          {showAll && (
            <Link
              to="/kategoriler"
              className={`px-4 py-2 rounded-full border text-sm transition ${
                pathname.startsWith("/kategoriler") && !activeSlug
                  ? "bg-black text-white border-black"
                  : "bg-white border-beige/60 text-black hover:bg-gold/90"
              }`}
            >
              Tümü
            </Link>
          )}

          {cats.map((c) => (
            <Link
              key={c.id}
              to={`/kategori/${c.slug}`}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                isActive(c.slug)
                  ? "bg-black text-white border-black"
                  : "bg-white border-beige/60 text-black hover:bg-gold/90"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollBy(280)}
        className="shrink-0 w-8 h-8 grid place-items-center rounded-md border border-beige/60 bg-white hover:bg-gold/90 hover:text-black transition"
        aria-label="Sağa kaydır"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
