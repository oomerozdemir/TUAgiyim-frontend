import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import ProductCard from "../components/ProductCard";

const tl = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const SORTS = [
  { v: "createdAt:desc", label: "En yeni" },
  { v: "createdAt:asc", label: "En eski" },
  { v: "price:asc", label: "Fiyat (Artan)" },
  { v: "price:desc", label: "Fiyat (Azalan)" },
  { v: "name:asc", label: "İsim (A→Z)" },
  { v: "name:desc", label: "İsim (Z→A)" },
];

export default function AllProductsPage() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({
    items: [],
    page: 1,
    pageSize: 24,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const { setItems: setBreadcrumb } = useBreadcrumbs();

  const page = Number(sp.get("page") || 1);
  const pageSize = Number(sp.get("pageSize") || 24);
  const sort = sp.get("sort") || "createdAt:desc";
  const q = sp.get("q") || "";

  useEffect(() => {
    setBreadcrumb([{ label: "Anasayfa", to: "/" }, { label: "Tüm Ürünler" }]);
  }, [setBreadcrumb]);

  // Debounce arama
  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp);
      if (qInput) next.set("q", qInput);
      else next.delete("q");
      next.set("page", "1"); // arama değişince ilk sayfaya dön
      setSp(next, { replace: true });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  // Ürünleri çek
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(
          `/api/products?search=${encodeURIComponent(
            q
          )}&page=${page}&pageSize=${pageSize}&sort=${encodeURIComponent(
            sort
          )}&me=true`
        );
        if (mounted) {
          setData({
            items: Array.isArray(data?.items) ? data.items : [],
            page: Number(data?.page) || page,
            pageSize: Number(data?.pageSize) || pageSize,
            total: Number(data?.total) || 0,
            totalPages: Number(data?.totalPages) || 1,
          });
        }
      } catch (e) {
        if (mounted)
          setData((d) => ({ ...d, items: [], total: 0, totalPages: 1 }));
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, pageSize, sort]);

  const canPrev = page > 1;
  const canNext = page < data.totalPages;

  const change = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) =>
      v === null ? next.delete(k) : next.set(k, String(v))
    );
    setSp(next, { replace: true });
  };

  const topInfo = useMemo(() => {
    const start = (data.page - 1) * data.pageSize + 1;
    const end = Math.min(data.page * data.pageSize, data.total);
    if (!data.total) return "0 sonuç";
    return `${start}–${end} / ${data.total} ürün`;
  }, [data.page, data.pageSize, data.total]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Başlık + filtreler */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Tüm Ürünler</h1>
          <div className="text-sm text-black/60 mt-1">{topInfo}</div>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Ürün veya açıklama ara…"
            className="px-3 py-2 w-full sm:w-64 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <select
            value={sort}
            onChange={(e) => change({ sort: e.target.value, page: 1 })}
            className="px-3 py-2 rounded-lg border border-beige bg-white"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={String(pageSize)}
            onChange={(e) =>
              change({ pageSize: Number(e.target.value), page: 1 })
            }
            className="px-3 py-2 rounded-lg border border-beige bg-white"
          >
            {[12, 24, 36, 48].map((n) => (
              <option key={n} value={n}>
                {n} / sayfa
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="text-black/60">Yükleniyor…</div>
      ) : !data.items.length ? (
        <div className="text-black/60">Hiç ürün bulunamadı.</div>
      ) : (
        <>
          {/* ProductCard grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                tl={tl}
                showFavorite={true}
                showCartButton={true}
              />
            ))}
          </div>

          {/* Sayfalama */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              className="px-3 py-2 rounded-lg border border-beige bg-white disabled:opacity-50"
              onClick={() => canPrev && change({ page: page - 1 })}
              disabled={!canPrev}
            >
              ← Önceki
            </button>
            <div className="text-sm text-black/70">
              Sayfa {data.page} / {data.totalPages}
            </div>
            <button
              className="px-3 py-2 rounded-lg border border-beige bg-white disabled:opacity-50"
              onClick={() => canNext && change({ page: page + 1 })}
              disabled={!canNext}
            >
              Sonraki →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
