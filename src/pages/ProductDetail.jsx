import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, AlertCircle } from "lucide-react";
import api from "../lib/api";
import FavoriteButton from "../components/FavoriteButton";
import CategoryScroller from "../components/CategoryScroller";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCart } from "../context/CartContext";
import SEO from "../components/Seo";

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


// --- KOMBİN (TAMAMLAYICI) DATASI ---
  const [compProduct, setCompProduct] = useState(null); 
  const [addComp, setAddComp] = useState(false);        
  const [compSizeId, setCompSizeId] = useState(null);   
  const [compColorId, setCompColorId] = useState(null); 

  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const { setItems: setBreadcrumb } = useBreadcrumbs();
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);

    // Seçim yapıldığında hatayı temizle
  useEffect(() => {
    if (showError) {
      setShowError(false);
      setErrorMsg("");
    }
  }, [selectedSizeId, selectedColorId, compSizeId, compColorId, addComp]);

  // 1. Ürünü Çek
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        // Tamamlayıcı ürün varsa state'e al
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

 // 2. Son Gezilenlere Ekle
  useEffect(() => {
    if (!product) return;
    try {
      const entry = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        isFavorited: product.isFavorited
      };
      let existing = JSON.parse(localStorage.getItem("lastViewedProducts") || "[]");
      existing = existing.filter((p) => p.id !== entry.id);
      existing.unshift(entry);
      localStorage.setItem("lastViewedProducts", JSON.stringify(existing.slice(0, 20)));
    } catch (e) {}
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

 // 3. Yorumları Çek
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



  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (savingReview || rating < 1) return;
    try {
      setSavingReview(true);
      const { data } = await api.post("/api/reviews", { productId: product.id, rating, comment });
      setMyReview(data);
      // listeyi tazele
      const res = await api.get(`/api/reviews/product/${product.id}`);
      setReviewSummary({ averageRating: res.data.averageRating, ratingCount: res.data.ratingCount });
      setReviews(res.data.reviews || []);
    } catch (e) { alert("Hata oluştu."); } finally { setSavingReview(false); }
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

   // SEPETE EKLEME (Çoklu)
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

    // Eğer eksik varsa hata göster ve dur
    if (missing.length > 0) {
        setShowError(true);
        setErrorMsg(`Lütfen seçim yapınız: ${missing.join(", ")}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }


    // 1. Ana Ürünü Ekle
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

    // 2. Kombin Ürünü Seçiliyse Ekle
    if (addComp && compProduct) {
        const compSizeLabel = compProduct.sizes?.find((s) => s.id === compSizeId)?.label || null;
        const compColorLabel = compProduct.colors?.find((c) => c.id === compColorId)?.label || null;
        // Kombin ürünün resmi (varsayılan ilk resim)
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
  const totalPrice = Number(product.price) + (addComp && compProduct ? Number(compProduct.price) : 0);


    // Hata kontrolü için yardımcı değişkenler
  const isColorMissing = showError && product.colors?.length > 0 && !selectedColorId;
  const isSizeMissing = showError && product.sizes?.length > 0 && !selectedSizeId;
  const isCompColorMissing = showError && addComp && compProduct?.colors?.length > 0 && !compColorId;
  const isCompSizeMissing = showError && addComp && compProduct?.sizes?.length > 0 && !compSizeId;


  return (
    <>
      <SEO 
        title={product.name} 
        description={product.description || `${product.name} modelini inceleyin ve hemen satın alın.`}
        image={product.images?.[0]?.url}
        type="product"
      />
    
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* başlık + kategori scroller */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-black">{product.name}</h1>
        <div className="sm:ml-6 sm:flex-1 min-w-0">
          <CategoryScroller activeSlug={product.categories?.[0]?.slug} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* SOL: Galeri */}
        <div>
          <div className="aspect-[3/4] bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center relative mb-4">
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                <span className="bg-black text-white text-lg px-4 py-2 font-bold tracking-widest">TÜKENDİ</span>
              </div>
            )}
            {hero ? <img src={hero} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-black/50 text-sm">Görsel yok</div>}
          </div>
          
          {gallery?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {gallery.slice(0, 5).map((im, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`aspect-square rounded border ${i === activeIndex ? "border-black" : "border-transparent hover:border-black/30"}`}
                >
                  <img src={im.url} className="w-full h-full object-cover rounded" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* SAĞ: Bilgiler */}
        <div className="space-y-8">
            
            {/* Fiyat */}
            <div>
                <div className="text-3xl font-bold text-black">{tl(product.price)}</div>
                {reviewSummary?.ratingCount > 0 && (
                    <div className="flex items-center gap-1 text-sm mt-2 text-yellow-600">
                        <Star size={16} fill="currentColor" /> 
                        <span className="font-bold">{reviewSummary.averageRating.toFixed(1)}</span>
                        <span className="text-black/50">({reviewSummary.ratingCount} değerlendirme)</span>
                    </div>
                )}
            </div>

            {/* HATA MESAJI (EN ÜSTTE) */}
            {showError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-pulse">
                    <AlertCircle size={20} />
                    <span className="font-medium text-sm">{errorMsg}</span>
                </div>
            )}

            {/* ANA ÜRÜN SEÇENEKLERİ */}
            <div className={`space-y-6 p-6 bg-white border rounded-xl transition-colors ${showError && (isColorMissing || isSizeMissing) ? "border-red-300 bg-red-50/30" : "border-beige/40"}`}>
                {/* Renk */}
                {product.colors?.length > 0 && (
                    <div>
                        <div className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isColorMissing ? "text-red-600" : "text-black"}`}>
                            Renk {isColorMissing && <span className="text-[10px] font-normal lowercase bg-red-100 px-2 py-0.5 rounded-full">seçiniz</span>}
                        </div>
                        <div className="flex gap-2">
                            {product.colors.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedColorId(c.id)}
                                    className={`w-8 h-8 rounded-full border transition-all
                                        ${selectedColorId === c.id 
                                            ? "ring-2 ring-black ring-offset-2 scale-110" 
                                            : isColorMissing ? "border-red-300 opacity-70" : "border-black/10 hover:scale-105"}
                                    `}
                                    style={{ backgroundColor: getColorHex(c.label) }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Beden */}
                {product.sizes?.length > 0 && (
                    <div>
                        <div className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isSizeMissing ? "text-red-600" : "text-black"}`}>
                            Beden {isSizeMissing && <span className="text-[10px] font-normal lowercase bg-red-100 px-2 py-0.5 rounded-full">seçiniz</span>}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSizeId(s.id)}
                                    disabled={s.stock <= 0}
                                    className={`h-10 min-w-[40px] px-3 border rounded text-sm font-medium transition-colors
                                        ${s.stock <= 0 ? "opacity-40 cursor-not-allowed bg-gray-100 decoration-line-through" : 
                                          selectedSizeId === s.id ? "bg-black text-white border-black" : 
                                          isSizeMissing ? "border-red-300 text-red-600 bg-white hover:border-red-500" : "hover:border-black text-black"}
                                    `}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- KOMBİNİ TAMAMLA (EĞER VARSA) --- */}
            {compProduct && (
                <div className={`p-6 rounded-xl border-2 transition-all duration-300 
                    ${showError && (isCompColorMissing || isCompSizeMissing) ? "border-red-300 bg-red-50/30" : 
                      addComp ? "border-gold bg-yellow-50/30" : "border-dashed border-gray-300 hover:border-gold/50"}`}>
                    
                    <div className="flex items-start gap-4">
                        <div className="flex h-6 items-center">
                            <input
                                type="checkbox"
                                id="comp-check"
                                checked={addComp}
                                onChange={(e) => setAddComp(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-gold focus:ring-gold"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="comp-check" className="font-bold text-lg cursor-pointer select-none flex items-center gap-2">
                                Kombini Tamamla
                                <span className="text-sm font-normal text-gray-500 bg-white border px-2 py-0.5 rounded-full">
                                    +{tl(compProduct.price)}
                                </span>
                            </label>
                            
                            <div className="flex gap-4 mt-3">
                                <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    {compProduct.images?.[0]?.url && <img src={compProduct.images[0].url} className="w-full h-full object-cover" alt="" />}
                                </div>
                                
                                <div>
                                    <p className="font-medium text-sm mb-2">{compProduct.name}</p>
                                    
                                    {addComp && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            {/* Beden Seçimi */}
                                            {compProduct.sizes?.length > 0 && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {compProduct.sizes.map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setCompSizeId(s.id)}
                                                            className={`text-xs px-2 py-1 border rounded transition-colors ${
                                                                compSizeId === s.id ? "bg-black text-white border-black" : 
                                                                isCompSizeMissing ? "border-red-300 bg-white text-red-600" : "bg-white hover:border-black"
                                                            }`}
                                                        >
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Renk Seçimi */}
                                            {compProduct.colors?.length > 0 && (
                                                <div className="flex gap-1">
                                                    {compProduct.colors.map(c => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setCompColorId(c.id)}
                                                            className={`w-5 h-5 rounded-full border transition-transform ${
                                                                compColorId === c.id ? "ring-1 ring-black ring-offset-1 scale-110" : 
                                                                isCompColorMissing ? "border-red-300" : ""
                                                            }`}
                                                            style={{ backgroundColor: getColorHex(c.label) }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {(isCompColorMissing || isCompSizeMissing) && (
                                                <p className="text-[10px] text-red-600 font-bold animate-pulse">
                                                    * Seçenekleri belirleyiniz
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ALT BUTONLAR & TOPLAM FİYAT */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-sm text-gray-500">Toplam Tutar:</span>
                    <span className="text-2xl font-bold text-black">{tl(totalPrice)}</span>
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 bg-black text-white h-14 rounded-xl font-bold tracking-wide hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={20} />
                        {addComp ? "İKİSİNİ DE SEPETE EKLE" : "SEPETE EKLE"}
                    </button>
                    <FavoriteButton
                        initial={product.isFavorited}
                        className="w-14 h-14 border border-black/10 rounded-xl hover:border-black text-black"
                    />
                </div>
            </div>

            {/* Açıklama */}
            <div className="space-y-6 text-sm text-black/70 leading-relaxed">
                <p>{product.description}</p>
                {product.attributes?.length > 0 && (
                    <div className="grid grid-cols-2 gap-y-2 border-t border-gray-100 pt-4">
                        {product.attributes.map((a, i) => (
                            <div key={i}><span className="font-bold text-black">{a.label}:</span> {a.value}</div>
                        ))}
                    </div>
                )}
            </div>

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
    </>
  );
}