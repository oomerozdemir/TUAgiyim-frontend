import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import CategoryScroller from "../components/CategoryScroller";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import ProductCard from "../components/ProductCard";
import { ArrowRight } from "lucide-react";
import SEO from "../components/Seo";
import Footer from "../components/Footer";

const tl = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function CategoriesPage() {
  const [cats, setCats] = useState(null);   // kategoriler
  const [prods, setProds] = useState(null); // ürünler (slug varsa)
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const activeQuery = searchParams.get("c");
  const activeSlug = slug || activeQuery || "";

  const { setItems: setBreadcrumb } = useBreadcrumbs();

  // --- DÜZELTME BAŞLANGICI ---
  // activeCatName tanımı YUKARI TAŞINDI
  const activeCatName = useMemo(() => {
    if (!cats || !activeSlug) return null;
    return cats.find((c) => c.slug === activeSlug)?.name || activeSlug;
  }, [cats, activeSlug]);

  // Artık activeCatName tanımlı olduğu için burada güvenle kullanılabilir
  const pageTitle = activeSlug ? (activeCatName || activeSlug) : "Kategoriler";
  const pageDesc = activeSlug 
    ? `TUA Giyim ${activeCatName} koleksiyonunu keşfedin. En şık parçalar burada.`
    : "TUA Giyim tüm kategoriler. Elbise, Bluz, Ceket ve daha fazlası.";
  // --- DÜZELTME BİTİŞİ ---

  // 1. Kategorileri Yükle
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/categories");
        const normalized = Array.isArray(data?.items) ? data.items : data;
        setCats(Array.isArray(normalized) ? normalized : []);
      } catch (e) {
        console.error(e);
        setCats([]);
      }
    })();
  }, []);

  // 2. Ürünleri Yükle (Kategori seçiliyse)
  useEffect(() => {
    if (!activeSlug) { setProds(null); return; }
    setProds(null); // Yükleniyor durumuna geç
    (async () => {
      try {
        // me=true: favori durumunu da çekmek için
        const { data } = await api.get(
          `/api/products?categorySlug=${activeSlug}&page=1&pageSize=24&sort=createdAt:desc&me=true`
        );
        setProds(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        console.error(e);
        setProds([]);
      }
    })();
  }, [activeSlug]);

  // 3. Breadcrumb Ayarı
  useEffect(() => {
    if (activeSlug) {
      setBreadcrumb([
        { label: "Anasayfa", to: "/" },
        { label: "Kategoriler", to: "/kategoriler" },
        { label: activeCatName || activeSlug },
      ]);
    } else {
      setBreadcrumb([
        { label: "Anasayfa", to: "/" },
        { label: "Kategoriler" },
      ]);
    }
  }, [activeSlug, activeCatName, setBreadcrumb]);

  // Yüklenme Durumu
  const loading = cats === null; 
  
  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
         <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-beige border-t-gold rounded-full animate-spin"></div>
            <span className="text-black/40 text-sm tracking-widest">YÜKLENİYOR</span>
         </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={pageTitle} description={pageDesc} />
    
    <section className="bg-cream min-h-screen pb-20 pt-8">
      <div className="max-w-[1600px] mx-auto px-6">
        
        {/* --- BAŞLIK VE FİLTRE ALANI --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 border-b border-beige/40 pb-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-2 block">
              {activeSlug ? "Koleksiyon" : "Keşfet"}
            </span>
            <h1 className="text-3xl md:text-4xl font-light font-serif text-black uppercase">
              {activeSlug ? (activeCatName || activeSlug) : "Tüm Kategoriler"}
            </h1>
          </div>

          {/* Kategori Scroller (Yatay Menü) */}
          <div className="lg:max-w-2xl w-full animate-in fade-in slide-in-from-right-4 duration-700">
            <CategoryScroller activeSlug={activeSlug} />
          </div>
        </div>

        {/* --- DURUM 1: KATEGORİ SEÇİLİ DEĞİLSE (KATEGORİ LİSTESİ) --- */}
        {!activeSlug && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cats.map((c, index) => (
              <Link
                key={c.id}
                to={`/kategori/${c.slug}`}
                className="group relative h-[500px] overflow-hidden rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Görsel */}
                <div className="absolute inset-0 bg-beige/20">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20 font-serif text-4xl">TUA</div>
                  )}
                </div>

                {/* Karartma Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* İçerik */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                  <h3 className="text-3xl text-white font-serif tracking-wide mb-2 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    {c.name}
                  </h3>
                  <div className="h-[1px] w-12 bg-gold mb-4 group-hover:w-24 transition-all duration-500" />
                  
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-white tracking-[0.2em] uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Koleksiyonu İncele <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* --- DURUM 2: KATEGORİ SEÇİLİ (ÜRÜN LİSTESİ) --- */}
        {activeSlug && (
          <>
            {/* Yükleniyor... */}
            {prods === null ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="space-y-3">
                          <div className="aspect-[3/4] bg-black/5 rounded-sm"></div>
                          <div className="h-4 bg-black/5 w-3/4 rounded"></div>
                          <div className="h-4 bg-black/5 w-1/4 rounded"></div>
                      </div>
                  ))}
               </div>
            ) : !prods.length ? (
              <div className="py-20 text-center border border-beige/40 rounded-xl bg-white/50">
                <p className="text-black/50 text-lg font-light">Bu kategoride henüz ürün bulunmuyor.</p>
                <Link to="/urunler" className="inline-block mt-4 text-gold hover:underline font-medium">
                    Tüm Ürünlere Göz At
                </Link>
              </div>
            ) : (
              // ÜRÜN GRİDİ (ProductCard Kullanımı)
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {prods.map((p, index) => (
                  <div 
                    key={p.id} 
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard 
                        product={p} 
                        tl={tl} 
                        showFavorite={true}
                        showCartButton={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
    <Footer />
        </>
  );
}