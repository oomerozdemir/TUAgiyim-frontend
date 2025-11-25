import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../lib/api"; // ✅ API kütüphanesini import ettik

export default function HomeProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        // ✅ api.get kullanarak token'ın header'a eklenmesini sağladık
        // ✅ 'me=true' parametresi ile backend'in favori durumunu kontrol etmesini istedik
        const { data } = await api.get(
          "/api/products?page=1&pageSize=5&sort=createdAt:desc&featured=true&me=true"
        );
        
        if (mounted) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (e) {
        console.error("HomeProducts error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const tl = (n) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  // Yükleniyor durumu için iskelet (skeleton) veya boş div
  if (loading) return <div className="py-20"></div>;
  
  if (!items.length) return null;

  return (
    <section className="bg-cream flex flex-col items-center">
      <div className="max-w-[1600px] w-full mx-auto px-8 py-10">
        {/* Üst bilgi satırı */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <p className="text-sm text-black/70 leading-relaxed max-w-md">
            En çok beğenilen ürünleri senin için özenle seçtik.
          </p>
          <Link
            to="/urunler"
            className="inline-block font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            TÜMÜNÜ GÖR
          </Link>
        </div>

        {/* Ürün kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.slice(0, 5).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              tl={tl}
              showFavorite={true}
              showCartButton={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}