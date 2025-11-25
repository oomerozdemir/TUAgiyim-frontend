import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus } from "lucide-react"; 

const tl = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(Number(n||0));

export default function CartDrawer() {
  const { items, removeItem, increment, decrement, subtotal, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  // Sidebar açıkken arka plandaki scroll'u kilitle
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleGoToCart = () => {
    closeCart();
    navigate("/sepet");
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/odeme");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end isolate">
      {/* --- ARKA PLAN KARARTMA ---
      */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px] animate-in fade-in duration-500 ease-out"
        onClick={closeCart}
      />

      {/* --- SIDEBAR PANEL --- 
      */}
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
        
        {/* Başlık Alanı */}
        <div className="p-5 border-b flex items-center justify-between bg-white z-10">
          <h2 className="font-bold text-xl text-black">Sepetim ({items.length})</h2>
          <button 
            onClick={closeCart} 
            className="p-2 hover:bg-gray-100 rounded-full transition duration-300 text-black/60 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Ürün Listesi */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black/50 space-y-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBagIcon />
              </div>
              <p className="text-lg font-medium">Sepetiniz boş</p>
              <p className="text-sm max-w-[200px] text-center leading-relaxed">Beğendiğiniz ürünleri ekleyerek alışverişe başlayabilirsiniz.</p>
              <button onClick={closeCart} className="mt-4 px-8 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gold transition-colors duration-300">
                ALIŞVERİŞE BAŞLA
              </button>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.key} className="flex gap-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
                {/* Görsel */}
                <div className="w-24 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 relative group">
                   {it.image ? (
                     <img src={it.image} alt={it.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Görsel Yok</div>
                   )}
                   {/* Hızlı Sil Butonu */}
                   <button 
                      onClick={(e) => { e.stopPropagation(); removeItem(it.key); }}
                      className="absolute top-1 right-1 bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:text-red-600 hover:scale-110"
                      title="Kaldır"
                   >
                      <Trash2 size={14} />
                   </button>
                </div>

                {/* Detaylar */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-32 py-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-black leading-tight line-clamp-2 hover:text-gold transition-colors cursor-pointer" onClick={handleGoToCart}>{it.name}</h3>
                        <span className="font-bold text-sm whitespace-nowrap">{tl(it.price * it.quantity)}</span>
                    </div>
                    
                    {/* Varyant Bilgisi */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-black/60 mt-1">
                       {it.sizeLabel && (
                         <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                           <span className="text-black/40">Beden:</span> 
                           <span className="font-medium text-black">{it.sizeLabel}</span>
                         </span>
                       )}
                       {it.colorLabel && (
                         <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                           <span className="text-black/40">Renk:</span>
                           <span className="font-medium text-black">{it.colorLabel}</span>
                         </span>
                       )}
                    </div>
                  </div>
                  
                  {/* Miktar Kontrolü */}
                  <div className="flex items-center justify-between mt-auto">
                     <div className="flex items-center border border-gray-200 rounded-lg h-8 w-fit bg-white shadow-sm">
                        <button 
                            onClick={() => decrement(it.key)}
                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-black/60 hover:text-black transition disabled:opacity-30"
                            disabled={it.quantity <= 1}
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{it.quantity}</span>
                        <button 
                            onClick={() => increment(it.key)}
                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-black/60 hover:text-black transition"
                        >
                            <Plus size={12} />
                        </button>
                     </div>
                     
                     <div className="text-xs text-black/40 font-medium">
                        Birim: {tl(it.price)}
                     </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Alt Bilgi ve Butonlar */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.04)] z-20">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-black/60">
                  <span>Ara Toplam</span>
                  <span>{tl(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-black">
                  <span>Toplam</span>
                  <span>{tl(subtotal)}</span>
                </div>
                <p className="text-[10px] text-black/40 text-right">KDV Dahildir, kargo hesaplanacaktır.</p>
            </div>
            
            <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white h-14 rounded-xl hover:bg-gold hover:shadow-lg active:scale-[0.98] transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 tracking-wide"
                >
                  <span>ÖDEMEYE GİT</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <button
                  onClick={handleGoToCart}
                  className="w-full border border-black/10 text-black h-12 rounded-xl hover:bg-gray-50 hover:border-black/30 active:scale-[0.98] transition-all duration-300 font-medium text-sm"
                >
                  SEPETİ GÖRÜNTÜLE
                </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

// Basit SVG ikon bileşeni
function ShoppingBagIcon() {
  return (
    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}