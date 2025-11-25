import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function LastViewedProducts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastViewedProducts");
      if (raw) {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
      }
    } catch (e) {
      console.error("Last viewed read error:", e);
    }
  }, []);

  if (!items.length) return null;

  const tl = (n) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  return (
    <section className="bg-cream flex flex-col items-center py-10">
      <div className="max-w-[1600px] mx-auto w-full px-8">

        {/* Başlık */}
        <h2 className="text-2xl font-semibold mb-8">
          Son Gezilen Ürünler
        </h2>

        {/* GRID – HomeProducts ile birebir aynı görünüm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((p, i) => (
            <ProductCard
              key={p.id ?? i}
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
