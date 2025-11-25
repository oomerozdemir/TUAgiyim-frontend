// src/pages/OrderSuccessPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../lib/api";

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;
  const fallbackId = location.state?.orderId;

  const orderCode = order?.orderNumber ?? fallbackId ?? order?.id;

  // modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState(false);

  const orderedProducts = useMemo(() => {
    if (!order?.items) return [];
    // aynı ürün birden fazla satırda olabilir => group by productId
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

  // Sayfa geldiğinde, eğer elimizde order + ürün varsa modalı otomatik aç
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
      setReviewOpen(true);
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
      // hiç yıldız seçilmemişse direkt kapatalım
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
      alert("Değerlendirmen için teşekkürler!");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Değerlendirme kaydedilirken bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-20 text-center relative">
      <div className="text-green-600 text-6xl mb-6">✓</div>

      <h1 className="text-3xl font-semibold mb-3">Siparişiniz Alındı!</h1>
      <p className="text-black/60 max-w-md mx-auto">
        Siparişiniz başarıyla oluşturuldu. Hazırlık sürecinden sonra kargoya
        verilecektir.
      </p>

      {orderCode && (
  <p className="text-sm text-black/50 mt-4">
    Sipariş numaranız:{" "}
    <span className="font-mono font-medium">{orderCode}</span>
  </p>
)}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-black/90 transition text-sm"
        >
          Alışverişe Devam Et
        </Link>

        <Link
          to="/hesabim?tab=orders"
          className="border px-6 py-3 rounded-lg hover:bg-black/5 transition text-sm"
        >
          Siparişlerimi Görüntüle
        </Link>

        {orderedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            className="border px-6 py-3 rounded-lg hover:bg-black/5 transition text-sm"
          >
            Ürünleri Değerlendir
          </button>
        )}
      </div>

      {/* ⭐ Değerlendirme Modali */}
      {reviewOpen && orderedProducts.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 p-5 text-left">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Ürünleri Değerlendir</h2>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="text-sm text-black/60 hover:text-black"
              >
                Kapat
              </button>
            </div>
            <p className="text-xs text-black/60 mb-3">
              Bu siparişte aldığınız ürünlere 1–5 arası puan verebilirsiniz.
              Yorum kısmı isteğe bağlıdır.
            </p>

            <form
              onSubmit={handleSubmitReviews}
              className="space-y-4 max-h-[60vh] overflow-auto pr-1"
            >
              {orderedProducts.map((op) => (
                <div
                  key={op.productId}
                  className="border border-black/10 rounded-xl p-3 text-sm"
                >
                  <div className="flex items-start gap-3">
                    {op.product?.images?.[0]?.url && (
                      <img
                        src={op.product.images[0].url}
                        alt={op.product.name}
                        className="w-14 h-18 object-cover rounded-lg border border-black/5"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-medium">
                          {op.product?.name || "Ürün"}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setRatingFor(op.productId, star)
                            }
                            className="p-0.5"
                          >
                            <Star
                              size={20}
                              className={
                                star <= (ratings[op.productId] || 0)
                                  ? "fill-yellow-400 stroke-yellow-400"
                                  : "stroke-black/25"
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs text-black/50 ml-1">
                          {ratings[op.productId] > 0
                            ? `${ratings[op.productId]}/5`
                            : "Puan seçin"}
                        </span>
                      </div>

                      <textarea
                        rows={2}
                        className="mt-2 w-full border rounded-lg px-2 py-1 text-xs"
                        placeholder="Bu ürünle ilgili yorumunuz (opsiyonel)"
                        value={comments[op.productId] || ""}
                        onChange={(e) =>
                          setCommentFor(op.productId, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2 border-t border-black/10 mt-2">
                <button
                  type="button"
                  className="px-4 h-9 rounded-lg border border-black/15 text-xs"
                  onClick={() => setReviewOpen(false)}
                >
                  Daha sonra
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 h-9 rounded-lg bg-black text-white text-xs disabled:opacity-60"
                >
                  {saving
                    ? "Gönderiliyor..."
                    : "Değerlendirmeleri Gönder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
