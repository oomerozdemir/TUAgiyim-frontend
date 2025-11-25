import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import ProductCard from "../components/ProductCard"; // Kart yapısını korumak için eklendi
import { HeartOff } from "lucide-react"; 

// Para birimi formatlayıcı
const tl = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setItems: setBreadcrumb } = useBreadcrumbs();

  // Breadcrumb Ayarı
  useEffect(() => {
    setBreadcrumb([{ label: "Anasayfa", to: "/" }, { label: "Favorilerim" }]);
  }, [setBreadcrumb]);

  // Favorileri Çekme
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/api/favorites");
        const payload = res?.data;

        let normalized = [];
        // Backend yapısına göre veriyi düzenle
        if (Array.isArray(payload)) {
          normalized = payload.map((f) => {
             const p = f?.product;
             if(!p) return null;
             // Favoriler sayfasındayız, o yüzden kalp dolu gelmeli
             return { ...p, isFavorited: true }; 
          }).filter(Boolean);
        } else if (payload && Array.isArray(payload.items)) {
          normalized = payload.items.map(p => ({...p, isFavorited: true}));
        }

        if (mounted) setItems(normalized);
      } catch (err) {
        console.error("Favoriler alınamadı:", err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Yükleniyor Durumu
  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 border-4 border-beige border-t-gold rounded-full animate-spin"></div>
           <p className="text-black/50 font-light tracking-wider text-sm animate-pulse">Favorileriniz Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Boş Durum (Favori Yoksa)
  if (!items.length) {
    return (
      <div className="bg-cream min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-white border border-beige/60 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <HeartOff strokeWidth={1} size={40} className="text-gold/60" />
        </div>
        <h2 className="text-3xl font-serif text-black mb-4">Listeniz Henüz Boş</h2>
        <p className="text-black/60 max-w-md mx-auto mb-10 font-light leading-relaxed">
          Gözünüze çarpan ürünleri kalp ikonuna tıklayarak buraya ekleyebilir, dilediğiniz zaman satın alabilirsiniz.
        </p>
        <Link 
            to="/urunler" 
            className="inline-flex items-center justify-center bg-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] hover:bg-gold transition-all duration-300 uppercase shadow-lg hover:shadow-gold/20"
        >
            Koleksiyonu Keşfet
        </Link>
      </div>
    );
  }

  // Dolu Durum
  return (
    <section className="bg-cream min-h-screen pb-20 pt-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-beige/40 pb-6 gap-4">
            <div>
                <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
                    İstek Listesi
                </span>
                <h1 className="text-3xl md:text-5xl font-light font-serif text-black">
                    Favorilerim
                </h1>
            </div>
            <div className="text-sm font-medium text-black/40 bg-white/50 px-4 py-2 rounded-full border border-beige/30">
                Toplam <span className="text-black font-bold">{items.length}</span> ürün
            </div>
        </div>

        {/* Ürün Grid'i - ProductCard Kullanımı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {items.map((product, index) => (
            <div 
                key={product.id} 
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }} // Sıralı animasyon
            >
                <ProductCard
                  product={product}
                  tl={tl}
                  showFavorite={true}   // Favori butonu görünsün (çıkarma işlemi için)
                  showCartButton={true} // Sepete ekleme butonu görünsün
                />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}