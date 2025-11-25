import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CategoriesShowcase() {
  const [items, setItems] = useState(null);
  const [isVisible, setIsVisible] = useState(false); 
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // 1. Veri Çekme
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/categories");
        setItems(data);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  // 2. Scroll Animasyonu (DÜZELTİLDİ)
  // Bu effect artık [items] değiştiğinde, yani veriler yüklenip
  // gerçek DOM elemanı oluştuğunda çalışacak.
  useEffect(() => {
    if (!items) return; // Veriler henüz yoksa bekle

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [items]); // <--- ÖNEMLİ: items bağımlılığı eklendi

  // YÜKLENİRKEN (Skeleton Loading)
  if (items === null) {
    return (
      <section className="bg-cream flex flex-col items-center">
        <div className="max-w-[1600px] w-full mx-auto px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-black/5 animate-pulse rounded-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const cards = (items || []).slice(0, 3);

  return (
    <section 
      ref={sectionRef} 
      className="bg-cream flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-[1600px] w-full mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c, index) => (
            <button
              key={c.id}
              onClick={() => navigate(`/kategori/${c.slug}`)}
              className={`
                group relative w-full overflow-hidden transition-all duration-700 ease-out transform
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"} 
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
              aria-label={c.name}
            >
              {/* KART GÖRSELİ */}
              <div className="aspect-[4/5] w-full bg-beige/20 relative">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center bg-beige/40 text-black/50">
                    Görsel yok
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              </div>

              {/* Başlık */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <h3 className="text-white text-3xl md:text-4xl font-semibold tracking-wider uppercase drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-4">
                  {c.name}
                </h3>
              </div>

              {/* Alt Buton */}
              <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                <div className="flex items-center gap-2 text-white font-medium tracking-wide text-sm border-b border-white pb-1">
                  KEŞFET
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}