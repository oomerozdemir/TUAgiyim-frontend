import { useEffect, useRef, useState } from "react";

// Kullanılacak görseller dizisi
const HERO_IMAGES = [
  "/images/yeniSezon.png", // 1. Resim
  "/images/2.png",   // 2. Resim
];

export default function HeroSection() {
  const bgRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- AKILLI ZAMANLAYICI ---
  useEffect(() => {
    let timeoutId;

    const runSlider = () => {
      // İlk değişim mi? (activeIndex === 0)
      // Eğer ilk resimdeysek 2 saniye bekle, değilse 5 saniye bekle.
      const delay = activeIndex === 0 ? 3000 : 5000;

      timeoutId = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      }, delay);
    };

    runSlider();

    // Temizlik: Component unmount olduğunda veya index değiştiğinde sayacı temizle
    return () => clearTimeout(timeoutId);
  }, [activeIndex]); // activeIndex her değiştiğinde bu effect tekrar çalışır ve yeni süreyi ayarlar.

  // --- PARALLAX EFEKTİ ---
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !bgRef.current) return;
    
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * 0.25;
        if(bgRef.current) {
            bgRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center overflow-hidden"
    >
      {/* ARKA PLAN WRAPPER */}
      <div ref={bgRef} className="absolute inset-0 z-0 w-full h-full">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            // Animasyon süresini biraz daha yumuşattım (2500ms)
            className={`absolute inset-0 bg-center bg-cover transition-all duration-[2500ms] ease-in-out will-change-transform
              ${index === activeIndex ? "opacity-100 scale-110" : "opacity-0 scale-100"}
            `}
            style={{ 
              backgroundImage: `url(${img})`, 
              backgroundRepeat: "no-repeat" 
            }}
          />
        ))}
      </div>

      {/* KARARTMA FİLMİ */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* İÇERİK */}
      <div className="relative z-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl sm:text-6xl md:text-5xl font-light tracking-wide text-cream drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
       RUHUNUZA DOKUNAN TASARIMLAR
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-cream/95 font-light max-w-2xl mx-auto">
          Geleneksel zanaata modern bir nefes.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="/urunler"
            className="inline-flex items-center rounded-full border border-cream px-8 py-3 text-base font-medium text-cream hover:bg-gold/90 hover:text-black transition-all duration-300 hover:scale-105"
          >
            KOLEKSİYONU KEŞFET
          </a>
        </div>
      </div>

      {/* ALT GEÇİŞ EFEKTİ */}
       <div className="absolute bottom-16 inset-x-0 z-10 h-28 bg-gradient-to-b from-transparent to-cream/80" />
      <div className="absolute bottom-0 inset-x-0 z-10 h-16 bg-cream" />
    </section>
  );
}