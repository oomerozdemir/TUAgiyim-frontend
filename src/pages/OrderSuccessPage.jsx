import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Star, CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import api from "../lib/api";

export default function OrderSuccessPage() {
  const location = useLocation();
  // PayTR'dan dönerken state boş olabilir, güvenli erişim sağlayalım
  const order = location.state?.order;
  const fallbackId = location.state?.orderId;
  const orderCode = order?.orderNumber ?? fallbackId ?? order?.id;

  // Değerlendirme Modali State'leri
  const [reviewOpen, setReviewOpen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState(false);

  const orderedProducts = useMemo(() => {
    if (!order?.items) return [];
    // Aynı ürün birden fazla satırda olabilir (farklı varyant), grupluyoruz
    const map = new Map();
    for (const it of order.items) {
      const pid = it.productId;
      if (!map.has(pid)) {
        map.set(pid, {
          productId: pid,
          product: it.product,
        });
      }
    }
    return Array.from(map.values());
  }, [order]);

  // Sipariş verisi varsa değerlendirme modalini otomatik açmayı dene
  useEffect(() => {
    if (orderedProducts.length > 0) {
      const initialRatings = {};
      const initialComments = {};
      orderedProducts.forEach((op) => {
        initialRatings[op.productId] = 0;
        initialComments[op.productId] = "";
      });
      setRatings(initialRatings);
      setComments(initialComments);
      // Kullanıcıyı hemen boğmamak için modalı otomatik açmak yerine butona bırakabiliriz
      // setReviewOpen(true); 
    }
  }, [orderedProducts.length]);

  const setRatingFor = (productId, value) => {
    setRatings((prev) => ({ ...prev, [productId]: value }));
  };

  const setCommentFor = (productId, value) => {
    setComments((prev) => ({ ...prev, [productId]: value }));
  };

  const handleSubmitReviews = async (e) => {
    e?.preventDefault?.();
    if (saving) return;

    const toSend = orderedProducts
      .map((op) => ({
        productId: op.productId,
        rating: ratings[op.productId],
        comment: comments[op.productId]?.trim() || "",
      }))
      .filter((r) => r.rating > 0);

    if (!toSend.length) {
      setReviewOpen(false);
      return;
    }

    try {
      setSaving(true);
      await Promise.all(
        toSend.map((r) =>
          api.post("/api/reviews", {
            productId: r.productId,
            rating: r.rating,
            comment: r.comment || undefined,
          })
        )
      );
      setReviewOpen(false);
      alert("Değerli yorumlarınız için teşekkürler!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Değerlendirme kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-cream">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center border border-beige/40">
        
        {/* Başarı İkonu */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
          <CheckCircle className="text-green-600" size={40} strokeWidth={2} />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-medium text-black mb-4">
          Siparişiniz Alındı!
        </h1>
        
        <p className="text-black/60 text-lg leading-relaxed mb-8">
          Ödemeniz başarıyla gerçekleşti. Siparişiniz hazırlanmaya başlandı ve en kısa sürede kargoya verilecek.
        </p>

        {/* Sipariş Numarası (Varsa Göster) */}
        {orderCode ? (
          <div className="bg-gray-50 inline-block px-6 py-3 rounded-lg border border-dashed border-black/20 mb-8">
            <span className="text-sm text-black/50 block mb-1 uppercase tracking-wider font-bold">Sipariş Numaranız</span>
            <span className="text-2xl font-mono font-bold text-black">#{orderCode}</span>
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-800 px-6 py-4 rounded-lg mb-8 text-sm">
            Sipariş numaranız ve detaylar e-posta adresinize gönderilmiştir.
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/hesabim?tab=orders"
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gold hover:shadow-lg transition-all duration-300"
          >
            <ShoppingBag size={18} />
            Siparişlerim
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 border-2 border-black/10 text-black px-8 py-4 rounded-xl font-bold hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            Alışverişe Dön
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Değerlendirme Butonu (Sadece Veri Varsa) */}
        {orderedProducts.length > 0 && (
          <button
            onClick={() => setReviewOpen(true)}
            className="mt-6 text-gold hover:text-black text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Satın aldığım ürünleri değerlendir
          </button>
        )}
      </div>

      {/* ⭐ Değerlendirme Modali */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-black">Ürünleri Değerlendir</h3>
              <button 
                onClick={() => setReviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {orderedProducts.map((op) => (
                <div key={op.productId} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  {/* Ürün Görseli */}
                  <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                     {op.product?.images?.[0]?.url ? (
                        <img src={op.product.images[0].url} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Görsel Yok</div>
                     )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-black mb-2 line-clamp-1">{op.product?.name}</p>
                    
                    {/* Yıldızlar */}
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingFor(op.productId, star)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={`${
                              star <= (ratings[op.productId] || 0)
                                ? "fill-yellow-400 stroke-yellow-400"
                                : "stroke-gray-300 fill-transparent"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Yorum Alanı */}
                    <textarea
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                      placeholder="Yorumunuzu buraya yazabilirsiniz..."
                      value={comments[op.productId] || ""}
                      onChange={(e) => setCommentFor(op.productId, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setReviewOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSubmitReviews}
                disabled={saving}
                className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gold hover:shadow-lg transition-all disabled:opacity-70"
              >
                {saving ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}