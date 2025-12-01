import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, AlertCircle, Heart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import FavoriteButton from "../components/FavoriteButton";
import CategoryScroller from "../components/CategoryScroller";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// --- SEO BİLEŞENİ (Dosya İçi Tanım) ---
function SEO({ title, description, type = "website", image }) {
  const siteTitle = "TUA Giyim";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || "Geleneksel zanaatı modern çizgilerle buluşturan TUA Giyim.";
  const metaImage = image || "https://tuagiyim.com/images/yeniSezon.png";
  const metaUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
    </Helmet>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { setItems: setBreadcrumb } = useBreadcrumbs();

  // Ürün State'leri
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Kombin (Tamamlayıcı) State'leri
  const [compProduct, setCompProduct] = useState(null);
  const [addComp, setAddComp] = useState(false);
  const [compSizeId, setCompSizeId] = useState(null);
  const [compColorId, setCompColorId] = useState(null);

  // UI State'leri
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Yorum State'leri
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  // Hata temizleme
  useEffect(() => {
    if (showError) {
      setShowError(false);
      setErrorMsg("");
    }
  }, [selectedSizeId, selectedColorId, compSizeId, compColorId, addComp]);

  // Veri Çekme
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        if (data.complementary) {
            setCompProduct(data.complementary);
        } else {
            setCompProduct(null);
            setAddComp(false);
        }

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

  // Son Gezilenler
  useEffect(() => {
    if (!product) return;
    try {
      const entry = { id: product.id, name: product.name, price: product.price, images: product.images, stock: product.stock, isFavorited: product.isFavorited };
      let existing = JSON.parse(localStorage.getItem("lastViewedProducts") || "[]");
      existing = existing.filter((p) => p.id !== entry.id);
      existing.unshift(entry);
      localStorage.setItem("lastViewedProducts", JSON.stringify(existing.slice(0, 20)));
    } catch (e) {}
  }, [product]);

  // Yorumları Çek
  useEffect(() => {
    if (!product?.id) return;
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/api/reviews/product/${product.id}`);
        setReviewSummary({ averageRating: data.averageRating, ratingCount: data.ratingCount });
        setReviews(data.reviews || []);
        setMyReview(data.myReview || null);
        setCanReview(data.canReview);
        if (data.myReview) { setRating(data.myReview.rating); setComment(data.myReview.comment || ""); }
      } catch (e) {}
    };
    fetchReviews();
  }, [product?.id]);

  const tl = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(Number(n || 0));

  const gallery = useMemo(() => {
    const imgs = product?.images || [];
    if (selectedColorId) {
      const col = imgs.filter((im) => im.colorId === selectedColorId);
      if (col.length) return col;
    }
    return imgs;
  }, [product, selectedColorId]);

  const hero = gallery?.[activeIndex]?.url || gallery?.[0]?.url;

  useEffect(() => setActiveIndex(0), [selectedColorId]);

  const getColorHex = (label) => {
    const lower = (label || "").toLocaleLowerCase("tr");
    if (lower.includes("siyah")) return "#000";
    if (lower.includes("beyaz")) return "#fff";
    if (lower.includes("kırmızı")) return "#d32f2f";
    if (lower.includes("mavi")) return "#1976d2";
    if (lower.includes("yeşil")) return "#388e3c";
    if (lower.includes("sarı")) return "#fbc02d";
    if (lower.includes("bej")) return "#f5f5dc";
    return "#e5e5e5"; 
  };

  const handleSubmitReview = async (e) => { e.preventDefault(); if (savingReview || rating < 1) return; try { setSavingReview(true); const { data } = await api.post("/api/reviews", { productId: product.id, rating, comment }); setMyReview(data); const res = await api.get(`/api/reviews/product/${product.id}`); setReviewSummary({ averageRating: res.data.averageRating, ratingCount: res.data.ratingCount }); setReviews(res.data.reviews || []); } catch (e) { alert("Hata oluştu."); } finally { setSavingReview(false); } };

  // SEPETE EKLEME VE VALIDASYON
  const handleAddToCart = () => {
    let missing = [];
    const hasSizes = product.sizes?.length > 0;
    const hasColors = product.colors?.length > 0;

    if (hasColors && !selectedColorId) missing.push("Renk");
    if (hasSizes && !selectedSizeId) missing.push("Beden");

    if (addComp && compProduct) {
        const compHasSizes = compProduct.sizes?.length > 0;
        const compHasColors = compProduct.colors?.length > 0;
        if (compHasColors && !compColorId) missing.push("Kombin Rengi");
        if (compHasSizes && !compSizeId) missing.push("Kombin Bedeni");
    }

    if (missing.length > 0) {
        setShowError(true);
        setErrorMsg(`Lütfen seçim yapınız: ${missing.join(", ")}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Ana Ürünü Ekle
    const mainSizeLabel = product.sizes?.find((s) => s.id === selectedSizeId)?.label || null;
    const mainColorLabel = product.colors?.find((c) => c.id === selectedColorId)?.label || null;
    const mainImage = (product.images || []).find((im) => im.colorId === selectedColorId)?.url || hero;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      sizeId: selectedSizeId,
      sizeLabel: mainSizeLabel,
      colorId: selectedColorId,
      colorLabel: mainColorLabel,
      quantity: 1,
    });

    // Kombin Ürünü Ekle
    if (addComp && compProduct) {
        const compSizeLabel = compProduct.sizes?.find((s) => s.id === compSizeId)?.label || null;
        const compColorLabel = compProduct.colors?.find((c) => c.id === compColorId)?.label || null;
        const compImage = compProduct.images?.[0]?.url || ""; 

        addItem({
            productId: compProduct.id,
            name: compProduct.name,
            price: compProduct.price,
            image: compImage,
            sizeId: compSizeId,
            sizeLabel: compSizeLabel,
            colorId: compColorId,
            colorLabel: compColorLabel,
            quantity: 1,
        });
    }

    navigate("/sepet");
  };

  if (loading) return <div className="py-20 text-center">Yükleniyor...</div>;
  if (!product) return <div className="py-20 text-center">Ürün bulunamadı.</div>;

  const totalPrice = Number(product.price) + (addComp && compProduct ? Number(compProduct.price) : 0);
  const isColorMissing = showError && product.colors?.length > 0 && !selectedColorId;
  const isSizeMissing = showError && product.sizes?.length > 0 && !selectedSizeId;
  const isCompColorMissing = showError && addComp && compProduct?.colors?.length > 0 && !compColorId;
  const isCompSizeMissing = showError && addComp && compProduct?.sizes?.length > 0 && !compSizeId;

  return (
    <>
      <SEO 
        title={product.name} 
        description={product.description}
        image={product.images?.[0]?.url}
        type="product"
      />

      <section className="max-w-7xl mx-auto px-4 py-10">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-black">{product.name}</h1>
            <div className="sm:ml-6 sm:flex-1 min-w-0">
               <CategoryScroller activeSlug={product.categories?.[0]?.slug} />
            </div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* GALERİ */}
             <div>
                <div className="aspect-[3/4] bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center relative mb-4">
                    {product.stock === 0 && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-black text-white text-lg px-4 py-2 font-bold tracking-widest">TÜKENDİ</span></div>}
                    {hero ? <img src={hero} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-black/50 text-sm">Görsel yok</div>}
                </div>
                {gallery?.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                    {gallery.slice(0, 5).map((im, i) => (
                        <button key={i} onClick={() => setActiveIndex(i)} className={`aspect-square rounded border ${i === activeIndex ? "border-black" : "border-transparent hover:border-black/30"}`}>
                           <img src={im.url} className="w-full h-full object-cover rounded" alt="" />
                        </button>
                    ))}
                    </div>
                )}
             </div>

             {/* BİLGİLER */}
             <div className="space-y-8">
                 <div>
                    <div className="text-3xl font-bold text-black">{tl(product.price)}</div>
                    {reviewSummary?.ratingCount > 0 && (
                        <div className="flex items-center gap-1 text-sm mt-2 text-yellow-600">
                            <Star size={16} fill="currentColor" /> <span className="font-bold">{reviewSummary.averageRating.toFixed(1)}</span> <span className="text-black/50">({reviewSummary.ratingCount} değerlendirme)</span>
                        </div>
                    )}
                 </div>

                 {showError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-pulse">
                        <AlertCircle size={20} /> <span className="font-medium text-sm">{errorMsg}</span>
                    </div>
                 )}

                 <div className={`space-y-6 p-6 bg-white border rounded-xl transition-colors ${showError && (isColorMissing || isSizeMissing) ? "border-red-300 bg-red-50/30" : "border-beige/40"}`}>
                    {product.colors?.length > 0 && (
                        <div>
                            <div className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isColorMissing ? "text-red-600" : "text-black"}`}>
                                Renk {isColorMissing && <span className="text-[10px] font-normal lowercase bg-red-100 px-2 py-0.5 rounded-full">seçiniz</span>}
                            </div>
                            <div className="flex gap-2">
                                {product.colors.map(c => (
                                    <button key={c.id} onClick={() => setSelectedColorId(c.id)} className={`w-8 h-8 rounded-full border transition-all ${selectedColorId === c.id ? "ring-2 ring-black ring-offset-2 scale-110" : isColorMissing ? "border-red-300 opacity-70" : "border-black/10 hover:scale-105"}`} style={{ backgroundColor: getColorHex(c.label) }} title={c.label} />
                                ))}
                            </div>
                        </div>
                    )}
                    {product.sizes?.length > 0 && (
                        <div>
                            <div className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isSizeMissing ? "text-red-600" : "text-black"}`}>
                                Beden {isSizeMissing && <span className="text-[10px] font-normal lowercase bg-red-100 px-2 py-0.5 rounded-full">seçiniz</span>}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map(s => (
                                    <button key={s.id} onClick={() => setSelectedSizeId(s.id)} disabled={s.stock <= 0} className={`h-10 min-w-[40px] px-3 border rounded text-sm font-medium transition-colors ${s.stock <= 0 ? "opacity-40 cursor-not-allowed bg-gray-100 decoration-line-through" : selectedSizeId === s.id ? "bg-black text-white border-black" : isSizeMissing ? "border-red-300 text-red-600 bg-white hover:border-red-500" : "hover:border-black text-black"}`}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
                 
                {/* KOMBİNİ TAMAMLA */}
                {compProduct && (
                    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${showError && (isCompColorMissing || isCompSizeMissing) ? "border-red-300 bg-red-50/30" : addComp ? "border-gold bg-yellow-50/30" : "border-dashed border-gray-300 hover:border-gold/50"}`}>
                        <div className="flex items-start gap-4">
                            <div className="flex h-6 items-center">
                                <input type="checkbox" id="comp-check" checked={addComp} onChange={(e) => setAddComp(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-gold focus:ring-gold" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="comp-check" className="font-bold text-lg cursor-pointer select-none flex items-center gap-2">
                                    Kombini Tamamla <span className="text-sm font-normal text-gray-500 bg-white border px-2 py-0.5 rounded-full">+{tl(compProduct.price)}</span>
                                </label>
                                <div className="flex gap-4 mt-3">
                                    <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                        {compProduct.images?.[0]?.url && <img src={compProduct.images[0].url} className="w-full h-full object-cover" alt="" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm mb-2">{compProduct.name}</p>
                                        {addComp && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                {compProduct.sizes?.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {compProduct.sizes.map(s => (
                                                            <button key={s.id} onClick={() => setCompSizeId(s.id)} className={`text-xs px-2 py-1 border rounded transition-colors ${compSizeId === s.id ? "bg-black text-white border-black" : isCompSizeMissing ? "border-red-300 bg-white text-red-600" : "bg-white hover:border-black"}`}>
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {compProduct.colors?.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {compProduct.colors.map(c => (
                                                            <button key={c.id} onClick={() => setCompColorId(c.id)} className={`w-5 h-5 rounded-full border transition-transform ${compColorId === c.id ? "ring-1 ring-black ring-offset-1 scale-110" : isCompColorMissing ? "border-red-300" : ""}`} style={{ backgroundColor: getColorHex(c.label) }} />
                                                        ))}
                                                    </div>
                                                )}
                                                {(isCompColorMissing || isCompSizeMissing) && <p className="text-[10px] text-red-600 font-bold animate-pulse">* Seçenekleri belirleyiniz</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                 <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col justify-end items-end flex-1">
                        <div className="text-sm text-gray-500 mb-1">Toplam Tutar</div>
                        <div className="text-2xl font-bold text-black mb-3">{tl(totalPrice)}</div>
                        <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-black text-white h-14 rounded-xl font-bold tracking-wide hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            <ShoppingBag size={20} /> {addComp ? "İKİSİNİ DE SEPETE EKLE" : "SEPETE EKLE"}
                        </button>
                    </div>
                    <FavoriteButton productId={product.id} initial={product.isFavorited} className="w-14 h-14 border border-black/10 rounded-xl hover:border-black text-black self-end" />
                 </div>
             </div>
         </div>

        {/* YORUMLAR */}
        <section className="mt-20 border-t pt-10">
            <h2 className="text-xl font-bold mb-8">Değerlendirmeler</h2>
            {canReview ? (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 border rounded-xl bg-gray-50 space-y-4 max-w-2xl">
                <p className="text-sm font-medium text-black/80">Bu ürünü satın aldınız. Deneyiminizi paylaşır mısınız?</p>
                <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="p-1 hover:scale-110 transition-transform">
                    <Star size={28} className={star <= rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300 fill-white"} />
                    </button>
                ))}
                </div>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="Yorumunuz (opsiyonel)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit" disabled={savingReview || rating < 1} className="inline-flex items-center justify-center px-6 h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed">
                {savingReview ? "Kaydediliyor..." : (myReview ? "Değerlendirmeyi Güncelle" : "Değerlendirme Gönder")}
                </button>
            </form>
            ) : (
            <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg inline-block mb-6">Bu ürünü değerlendirmek için satın almış olmanız gerekmektedir.</div>
            )}

            {reviews.length === 0 ? <p className="text-sm text-black/50 italic">Henüz yorum yapılmamış. İlk değerlendirmeyi siz yapın.</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((rev) => (
                <div key={rev.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition bg-white">
                    <div className="flex justify-between items-start mb-3">
                    <div><span className="font-bold text-sm block">{rev.user?.name || "Anonim"}</span><span className="text-[11px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                    <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700 border border-yellow-100"><span>{rev.rating}</span><Star size={10} className="fill-yellow-500 stroke-yellow-500" /></div>
                    </div>
                    {rev.comment && <p className="text-black/70 text-sm leading-relaxed">{rev.comment}</p>}
                </div>
                ))}
            </div>
            )}
        </section>
      </section>
      <Footer />
    </>
  );
}