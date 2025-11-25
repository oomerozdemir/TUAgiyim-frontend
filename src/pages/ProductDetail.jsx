import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import api from "../lib/api";
import FavoriteButton from "../components/FavoriteButton";
import CategoryScroller from "../components/CategoryScroller";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // ana görsel index
  const { setItems: setBreadcrumb } = useBreadcrumbs();
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        // breadcrumb
        if (data) {
          setBreadcrumb([
            { label: "Anasayfa", to: "/" },
            data.categories?.[0]
              ? { label: data.categories[0].name, to: `/kategori/${data.categories[0].slug}` }
              : { label: "Kategoriler", to: "/kategoriler" },
            { label: data.name },
          ]);
        }
      } catch (err) {
        console.error("Ürün alınamadı:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, setBreadcrumb]);

  // Son gezilen ürünler için localStorage kaydı
  useEffect(() => {
    if (!product) return;

    const entry = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      image: product.images?.[0]?.url || product.image?.url || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      ratingCount: product.ratingCount || 0,
      averageRating: product.averageRating || 0,
      isFavorited: product.isFavorited || false,
      stock: product.stock,
    };

    try {
      let existing = JSON.parse(localStorage.getItem("lastViewedProducts") || "[]");
      existing = existing.filter((p) => p.id !== entry.id);
      existing.unshift(entry);
      localStorage.setItem(
        "lastViewedProducts",
        JSON.stringify(existing.slice(0, 20))
      );
    } catch (e) {
      console.error("lastViewedProducts error:", e);
    }
  }, [product]);

  // ₺ format
  const tl = (n) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })
      .format(Number(n || 0));

  // Renge göre filtreli galeri
  const gallery = useMemo(() => {
    const imgs = product?.images || [];
    if (selectedColorId) {
      const col = imgs.filter((im) => im.colorId === selectedColorId);
      if (col.length) return col;
    }
    return imgs;
  }, [product, selectedColorId]);

  // aktif ana görsel
  const hero = gallery?.[activeIndex]?.url || gallery?.[0]?.url;

  // Renk seçimi değiştiğinde thumbnail index'i sıfırla
  useEffect(() => setActiveIndex(0), [selectedColorId]);

  useEffect(() => {
    if (!product?.id) return;

    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/api/reviews/product/${product.id}`);
        setReviewSummary({
          averageRating: data.averageRating,
          ratingCount: data.ratingCount,
        });
        setReviews(data.reviews || []);
        setMyReview(data.myReview || null);
        setCanReview(data.canReview);
        if (data.myReview) {
          setRating(data.myReview.rating);
          setComment(data.myReview.comment || "");
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchReviews();
  }, [product?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-black/60">Ürün yükleniyor...</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ürün bulunamadı 😢</h2>
      </div>
    );
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (savingReview || rating < 1) return;

    try {
      setSavingReview(true);
      const { data } = await api.post("/api/reviews", {
        productId: product.id,
        rating,
        comment,
      });

      setMyReview(data);

      const res = await api.get(`/api/reviews/product/${product.id}`);
      setReviewSummary({
        averageRating: res.data.averageRating,
        ratingCount: res.data.ratingCount,
      });
      setReviews(res.data.reviews || []);
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.message ||
          "Değerlendirme kaydedilirken bir hata oluştu."
      );
    } finally {
      setSavingReview(false);
    }
  };

  // --- RENK BELİRLEME FONKSİYONU ---
  const getColorHex = (label) => {
    const lower = (label || "").toLocaleLowerCase("tr");
    
    if (lower.includes("siyah") || lower.includes("black")) return "#000000";
    if (lower.includes("beyaz") || lower.includes("white")) return "#ffffff";
    if (lower.includes("kırmızı") || lower.includes("kirmizi") || lower.includes("red") || lower.includes("bordo") || lower.includes("nar") || lower.includes("vişne")) return "#d32f2f";
    if (lower.includes("mavi") || lower.includes("blue") || lower.includes("lacivert") || lower.includes("indigo") || lower.includes("saks") || lower.includes("petrol")) return "#1976d2";
    if (lower.includes("yeşil") || lower.includes("yesil") || lower.includes("green") || lower.includes("haki") || lower.includes("mint") || lower.includes("çağla") || lower.includes("zümrüt")) return "#388e3c";
    if (lower.includes("sarı") || lower.includes("sari") || lower.includes("yellow") || lower.includes("hardal") || lower.includes("limon")) return "#fbc02d";
    if (lower.includes("turuncu") || lower.includes("orange") || lower.includes("kiremit") || lower.includes("bakır") || lower.includes("tarçın")) return "#f57c00";
    if (lower.includes("mor") || lower.includes("purple") || lower.includes("lila") || lower.includes("mürdüm") || lower.includes("lavanta")) return "#7b1fa2";
    if (lower.includes("pembe") || lower.includes("pink") || lower.includes("pudra") || lower.includes("fuşya") || lower.includes("gül")) return "#e91e63";
    if (lower.includes("gri") || lower.includes("grey") || lower.includes("füme") || lower.includes("antrasit") || lower.includes("gümüş")) return "#757575";
    if (lower.includes("bej") || lower.includes("beige") || lower.includes("krem") || lower.includes("ekru") || lower.includes("vizon") || lower.includes("taş") || lower.includes("kum")) return "#f5f5dc";
    if (lower.includes("kahve") || lower.includes("brown") || lower.includes("taba") || lower.includes("camel") || lower.includes("sütlü")) return "#795548";
    if (lower.includes("gold") || lower.includes("altın")) return "#ffd700";
    
    return "#e5e5e5"; // Tanınmayan renkler için varsayılan
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* başlık + kategori scroller */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-black">{product.name}</h1>
        <div className="sm:ml-6 sm:flex-1 min-w-0">
          <CategoryScroller activeSlug={product.categories?.[0]?.slug} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol: Galeri */}
        <div>
          {/* büyük görsel */}
          <div className="aspect-[3/4] bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* Stok Tükendi Etiketi (Büyük Görsel Üzerinde) */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                <span className="bg-black text-white text-lg px-4 py-2 font-bold tracking-widest">TÜKENDİ</span>
              </div>
            )}
            {hero ? (
              <img src={hero} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-black/50 text-sm">Görsel bulunamadı</div>
            )}
          </div>

          {/* thumbnails */}
          {gallery?.length > 1 && (
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {gallery.slice(0, 8).map((im, i) => (
                <button
                  key={im.id ?? im.url ?? i}
                  onClick={() => setActiveIndex(i)}
                  className={`aspect-square rounded-md overflow-hidden border
                    ${i === activeIndex ? "border-black" : "border-black/10 hover:border-black/40"}`}
                  title={`Görsel ${i + 1}`}
                >
                  <img src={im.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ: Bilgi & aksiyonlar */}
        <div className="lg:pl-6">
          {/* fiyat */}
          <div className="text-2xl md:text-3xl font-bold text-black">{tl(product.price)}</div>

          {/* renk seçici */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">
                Renk{selectedColorId ? `: ${product.colors.find(c => c.id === selectedColorId)?.label || ""}` : ""}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((c) => {
                  const selected = selectedColorId === c.id;
                  const disabled = Number(c.stock) <= 0;
                  // Renk kodunu belirle
                  const bgColor = getColorHex(c.label);

                  return (
                    <button
                      key={c.id ?? c.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedColorId(c.id)}
                      className={`w-9 h-9 rounded-full border shadow-sm transition-all
                        ${disabled
                          ? "border-gray-200 cursor-not-allowed opacity-40 relative after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:h-[1px] after:bg-gray-400 after:-rotate-45"
                          : selected
                          ? "border-white ring-2 ring-black scale-110"
                          : "border-black/10 hover:border-black hover:scale-105"}`}
                      style={{ backgroundColor: bgColor }}
                      title={disabled ? `${c.label} (Tükendi)` : `${c.label} (Stok: ${c.stock})`}
                    >
                      <span className="sr-only">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* beden seçici */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Beden</div>
              <div className="grid grid-cols-5 gap-2 max-w-sm">
                {product.sizes.map((s) => {
                  const disabled = Number(s.stock) <= 0;
                  const selected = selectedSizeId === s.id;
                  return (
                    <button
                      key={s.id ?? s.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedSizeId(s.id)}
                      className={`h-10 rounded-md border text-sm transition-colors
                        ${disabled
                          ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed decoration-slice line-through"
                          : selected
                          ? "border-black bg-black text-white"
                          : "border-black/20 text-black hover:border-black hover:bg-gray-50"}`}
                      title={disabled ? "Tükendi" : `Stok: ${s.stock}`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-black/60">
                Toplam stok: <b>{Number(product.stock ?? 0)}</b>
              </div>
            </div>
          )}

          {reviewSummary && reviewSummary.ratingCount > 0 && (
            <div className="flex items-center gap-1 text-sm mt-4">
              <Star size={18} className="fill-yellow-400 stroke-yellow-400" />
              <span className="font-medium">
                {reviewSummary.averageRating.toFixed(1)}
              </span>
              <span className="text-black/60">
                ({reviewSummary.ratingCount} değerlendirme)
              </span>
            </div>
          )}

          {/* aksiyonlar */}
          <div className="flex items-center gap-3 mt-7">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-lg hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold tracking-wide uppercase"
              disabled={
                (product.sizes?.length > 0 && !selectedSizeId) ||
                (product.colors?.length > 0 && !selectedColorId) ||
                product.stock === 0
              }
              onClick={() => {
                const sizeLabel =
                  product.sizes?.find((s) => s.id === selectedSizeId)?.label || null;
                const colorLabel =
                  product.colors?.find((c) => c.id === selectedColorId)?.label || null;
                
                const colorImage =
                  (product.images || []).find((im) => im.colorId === selectedColorId)?.url ||
                  hero;

                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: colorImage,
                  sizeId: selectedSizeId,
                  sizeLabel,
                  colorId: selectedColorId,
                  colorLabel,
                  quantity: 1,
                });

                navigate("/sepet");
              }}
            >
              <ShoppingBag size={20} />
              <span>{product.stock === 0 ? "Tükendi" : "Sepete Ekle"}</span>
            </button>

            <FavoriteButton
              productId={product.id}
              initial={product.isFavorited}
              className="w-14 h-14 border border-black/10 rounded-lg hover:border-black/30 text-black"
            />
          </div>

          {/* açıklama */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Ürün Açıklaması</h3>
            <p className="text-black/70 leading-relaxed text-sm">
              {product.description || "Bu ürün hakkında detaylı bilgi yakında."}
            </p>
          </div>

          {/* Ürün detay/spec tablosu */}
          {Array.isArray(product.attributes) && product.attributes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-bold uppercase tracking-wide mb-3">Özellikler</div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.attributes.map((a, i) => (
                      <tr key={i} className="odd:bg-gray-50 border-b last:border-0 border-gray-100">
                        <td className="p-3 w-1/3 text-black/60 font-medium">{a.label}</td>
                        <td className="p-3 text-black/80">{a.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <section className="mt-16 border-t pt-10">
        <h2 className="text-xl font-bold mb-6">Değerlendirmeler</h2>

        {/* Değerlendirme yazma alanı */}
        {canReview ? (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 p-6 border rounded-xl bg-gray-50 space-y-4 max-w-2xl"
          >
            <p className="text-sm font-medium text-black/80">
              Bu ürünü satın aldınız. Deneyiminizi paylaşır mısınız?
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={28}
                    className={
                      star <= rating
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "stroke-gray-300 fill-white"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="Yorumunuz (opsiyonel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={savingReview || rating < 1}
              className="inline-flex items-center justify-center px-6 h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingReview ? "Kaydediliyor..." : (myReview ? "Değerlendirmeyi Güncelle" : "Değerlendirme Gönder")}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-blue-50 text-red-700 text-sm rounded-lg inline-block mb-6">
            Bu ürünü değerlendirmek için satın almış olmanız gerekmektedir.
          </div>
        )}

        {/* Yorum listesi */}
        {reviews.length === 0 ? (
          <p className="text-sm text-black/50 italic">
            Henüz yorum yapılmamış. İlk değerlendirmeyi siz yapın.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-sm block">
                      {rev.user?.name || "Anonim"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700 border border-yellow-100">
                    <span>{rev.rating}</span>
                    <Star size={10} className="fill-yellow-500 stroke-yellow-500" />
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-black/70 text-sm leading-relaxed">{rev.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </section>
  );
}