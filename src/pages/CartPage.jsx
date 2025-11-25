import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

const tl = (n) => 
  new Intl.NumberFormat("tr-TR", { 
    style: "currency", 
    currency: "TRY", 
    maximumFractionDigits: 0 
  }).format(Number(n || 0));

export default function CartPage() {
  const { items, increment, decrement, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  // --- BOŞ SEPET DURUMU ---
  if (items.length === 0) {
    return (
      <section className="bg-cream min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-white border border-beige/60 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag strokeWidth={1} size={40} className="text-gold/60" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-black mb-4">Sepetiniz Boş</h1>
        <p className="text-black/60 max-w-md mx-auto mb-10 font-light leading-relaxed">
          Henüz sepetinize ürün eklemediniz. Koleksiyonumuzdaki eşsiz parçaları keşfetmeye ne dersiniz?
        </p>
        <Link 
          to="/urunler" 
          className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] hover:bg-gold transition-all duration-300 uppercase shadow-lg hover:shadow-gold/20"
        >
          Alışverişe Başla
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-cream min-h-screen py-10 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Başlık */}
        <div className="mb-10 flex items-center justify-between border-b border-beige/40 pb-6">
          <h1 className="text-3xl md:text-4xl font-light font-serif text-black">Sepetim ({items.length})</h1>
          <Link to="/urunler" className="hidden md:flex items-center gap-2 text-sm font-medium text-black/50 hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            Alışverişe Devam Et
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- SOL: ÜRÜN LİSTESİ --- */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((it) => (
              <div 
                key={it.key} 
                className="bg-white p-4 sm:p-6 rounded-xl border border-beige/30 shadow-sm flex gap-4 sm:gap-8 items-start sm:items-center transition-all hover:shadow-md group"
              >
                {/* Görsel */}
                <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {it.image ? (
                    <img 
                      src={it.image} 
                      alt={it.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Yok</div>
                  )}
                </div>

                {/* Bilgiler */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 h-full">
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Link to={`/urun/${it.productId}`} className="text-lg font-medium text-black hover:text-gold transition-colors line-clamp-2">
                      {it.name}
                    </Link>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-black/60">
                      {it.sizeLabel && (
                        <span className="bg-cream px-2 py-1 rounded border border-beige/50">
                          Beden: <span className="text-black font-medium">{it.sizeLabel}</span>
                        </span>
                      )}
                      {it.colorLabel && (
                        <span className="bg-cream px-2 py-1 rounded border border-beige/50">
                          Renk: <span className="text-black font-medium">{it.colorLabel}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="sm:hidden font-semibold text-black mt-2">
                      {tl(it.price * it.quantity)}
                    </div>
                  </div>

                  {/* Aksiyonlar (Miktar + Sil + Fiyat) */}
                  <div className="flex flex-row-reverse sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-6 w-full sm:w-auto">
                    
                    {/* Fiyat (Desktop) */}
                    <div className="hidden sm:block text-right">
                      <div className="text-lg font-bold text-black">{tl(it.price * it.quantity)}</div>
                      {it.quantity > 1 && (
                        <div className="text-xs text-black/40">{it.quantity} x {tl(it.price)}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Miktar Arttır/Azalt */}
                      <div className="flex items-center bg-cream rounded-full border border-beige/50 h-9">
                        <button 
                          onClick={() => decrement(it.key)} 
                          className="w-9 h-full flex items-center justify-center text-black/60 hover:text-black hover:bg-white rounded-l-full transition disabled:opacity-30"
                          disabled={it.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{it.quantity}</span>
                        <button 
                          onClick={() => increment(it.key)} 
                          className="w-9 h-full flex items-center justify-center text-black/60 hover:text-black hover:bg-white rounded-r-full transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Sil Butonu */}
                      <button 
                        onClick={() => removeItem(it.key)} 
                        className="text-black/30 hover:text-red-500 transition-colors p-2"
                        title="Sepetten Kaldır"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- SAĞ: ÖZET KARTI (Sticky) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-beige/40 shadow-lg shadow-beige/10">
              <h2 className="text-xl font-serif text-black mb-6 border-b border-beige/30 pb-4">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-black/70">
                  <span>Ara Toplam</span>
                  <span>{tl(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-black/70">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="h-px bg-beige/30 my-2" />
                <div className="flex justify-between items-end text-black">
                  <span className="font-medium">Toplam</span>
                  <span className="text-2xl font-bold">{tl(subtotal)}</span>
                </div>
                <p className="text-[10px] text-black/40 text-right">KDV Dahildir.</p>
              </div>

              <button
                onClick={() => navigate("/odeme")}
                className="w-full bg-black text-white h-14 rounded-xl font-bold tracking-wider hover:bg-gold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                ÖDEMEYE GİT
                <ArrowRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 opacity-50 grayscale">
                {/* Ödeme İkonları (Opsiyonel - Yer Tutucu) */}
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
              
              <p className="text-[12px] text-center text-black/40 mt-4">
                Güvenli ödeme altyapısı ile korunmaktadır.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}