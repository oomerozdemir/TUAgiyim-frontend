import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../lib/api"; // Gönderdiğiniz api.js ile uyumlu
import { MapPin, ShieldCheck, ChevronRight, Plus, CheckCircle, Lock } from "lucide-react";

// Para birimi formatlayıcı
const tl = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const emptyShipping = {
  fullName: "",
  phone: "",
  city: "",
  district: "",
  neighborhood: "",
  addressLine: "",
  postalCode: "",
  note: "",
};

export default function PaymentPage() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();

  // --- STATE TANIMLARI ---
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shipping, setShipping] = useState(emptyShipping);
  
  // PayTR ve Loading State'leri
  const [loading, setLoading] = useState(false);
  const [paytrToken, setPaytrToken] = useState(null);

  // 1. Kayıtlı Adresleri Çek
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const { data } = await api.get("/api/account/addresses");
        setAddresses(data || []);

        // Varsayılan adresi otomatik seç
        if (data && data.length) {
          const defaultAddress = data.find((a) => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddress.id);
          fillForm(defaultAddress);
        }
      } catch (err) {
        console.error("Adresler yüklenemedi:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Formu Seçili Adresle Doldur
  const fillForm = (addr) => {
    setShipping({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      city: addr.city || "",
      district: addr.district || "",
      neighborhood: addr.neighborhood || "",
      addressLine: addr.addressLine || "",
      postalCode: addr.postalCode || "",
      note: "",
    });
  };

  // Form Değişikliklerini Yönet
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  // Adres Seçimi
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    if (!id) {
      setShipping(emptyShipping); // Yeni adres seçildiyse formu temizle
    } else {
      const addr = addresses.find((a) => a.id === id);
      if (addr) fillForm(addr);
    }
  };

  // 2. ÖDEME BAŞLATMA FONKSİYONU
  const handleStartPayment = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      // Backend'e gönderilecek veri paketi
      const payload = {
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          sizeId: it.sizeId,
          colorId: it.colorId,
        })),
        shippingAddressId: selectedAddressId,
        shipping,
      };

      // DİKKAT: Burada siparişi tamamlamıyoruz, ödeme oturumu başlatıyoruz.
      // Backend bu istek üzerine siparişi "AWAITING_PAYMENT" olarak açar ve token döner.
      const { data } = await api.post("/api/payment/start", payload);
      
      if (data.token) {
        setPaytrToken(data.token); // Token geldi, ekran iframe moduna geçer.
        // Scroll'u yukarı taşı ki kullanıcı iframe'i görsün
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Ödeme servisine bağlanılamadı, lütfen tekrar deneyin.");
      }

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Ödeme başlatılırken bir hata oluştu.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Sepet Boşsa ve Ödeme İşlemi Başlamadıysa Yönlendir
  if (!items.length && !paytrToken) {
    return (
      <section className="bg-cream min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
         <h1 className="text-2xl font-serif text-black mb-2">Sepetiniz Boş</h1>
         <button onClick={() => navigate("/urunler")} className="underline hover:text-gold transition-colors">
            Alışverişe Dön
         </button>
      </section>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Breadcrumb / Başlık */}
        <div className="mb-10 flex items-center gap-3 text-sm text-black/50">
            <span className="text-black font-medium">Sepet</span>
            <ChevronRight size={14} />
            <span className="text-gold font-bold border-b border-gold pb-0.5">Teslimat ve Ödeme</span>
        </div>

        {/* --- DURUM KONTROLÜ: TOKEN VARSA IFRAME, YOKSA FORM --- */}
        {paytrToken ? (
           // --- PAYTR IFRAME ALANI ---
           <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg animate-in fade-in duration-500 border border-beige/40">
             <div className="flex flex-col items-center justify-center mb-6">
                <Lock className="text-gold mb-2" size={32} />
                <h2 className="text-center font-bold text-xl text-black">Güvenli Ödeme Ekranı</h2>
                <p className="text-sm text-gray-500">Ödeme işlemini tamamlamak için lütfen bilgilerinizi giriniz.</p>
             </div>
             
             {/* PayTR Scriptinin Yükleyeceği İframe */}
             <div className="w-full overflow-hidden min-h-[600px] bg-gray-50 rounded-lg">
                <iframe
                    src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="no"
                    style={{ width: "100%", height: "800px" }} // Yükseklik ayarını ihtiyaca göre artırabilirsiniz
                    allow="payment"
                ></iframe>
             </div>

             <div className="text-center mt-6">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-red-500 text-sm hover:underline font-medium"
                >
                  İşlemi İptal Et ve Geri Dön
                </button>
             </div>
           </div>
        ) : (
          // --- ADRES VE ÖZET FORMU ---
          <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* SOL KOLON: Adres Seçimi ve Form */}
            <div className="lg:col-span-7 space-y-10">
                
                {/* 1. Kayıtlı Adresler */}
                <div>
                    <h2 className="text-2xl font-serif text-black mb-6 flex items-center gap-3">
                        <MapPin className="text-gold" size={24} />
                        Teslimat Adresi
                    </h2>

                    {loadingAddresses ? (
                        <div className="text-sm text-black/50 p-4">Adresler yükleniyor...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <label 
                                    key={addr.id} 
                                    className={`relative cursor-pointer border rounded-xl p-5 transition-all duration-200 select-none
                                        ${selectedAddressId === addr.id 
                                            ? "bg-white border-gold shadow-md ring-1 ring-gold/20" 
                                            : "bg-white/40 border-beige/50 hover:bg-white hover:border-gold/50"}`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        className="hidden"
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => handleSelectAddress(addr.id)}
                                    />
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-sm text-black">{addr.title}</span>
                                        {selectedAddressId === addr.id && <CheckCircle size={18} className="text-gold" />}
                                    </div>
                                    <p className="text-sm text-black/70 line-clamp-2">{addr.addressLine}</p>
                                    <p className="text-xs text-black/40 mt-2 font-medium">{addr.district} / {addr.city}</p>
                                </label>
                            ))}
                            
                            {/* Yeni Adres Ekle Butonu */}
                            <label className={`cursor-pointer border border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-all 
                                ${selectedAddressId === null ? "bg-white border-gold shadow-sm" : "border-black/20 hover:bg-white/50 hover:border-black/40"}`}>
                                <input 
                                    type="radio" 
                                    name="selectedAddress" 
                                    className="hidden" 
                                    checked={selectedAddressId === null} 
                                    onChange={() => handleSelectAddress(null)} 
                                />
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedAddressId === null ? "bg-gold text-white" : "bg-black/5 text-black/40"}`}>
                                    <Plus size={16} />
                                </div>
                                <span className="text-sm font-medium text-black/70">Yeni Adres</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* 2. Adres Formu */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige/30">
                    <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-2 text-black/80">
                        {selectedAddressId ? "Seçili Adres Detayları" : "Yeni Adres Bilgileri"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Ad Soyad</label>
                            <input 
                                type="text" name="fullName" required 
                                value={shipping.fullName} onChange={handleShippingChange} 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gold outline-none transition-colors text-sm" 
                                placeholder="Adınız Soyadınız" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Telefon</label>
                            <input 
                                type="tel" name="phone" required 
                                value={shipping.phone} onChange={handleShippingChange} 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gold outline-none transition-colors text-sm" 
                                placeholder="05XX XXX XX XX" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                        <label className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Açık Adres</label>
                        <textarea 
                            name="addressLine" required 
                            value={shipping.addressLine} onChange={handleShippingChange} 
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gold outline-none transition-colors min-h-[100px] resize-none text-sm" 
                            placeholder="Mahalle, Cadde, Sokak, No..." 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Şehir</label>
                            <input 
                                type="text" name="city" required 
                                value={shipping.city} onChange={handleShippingChange} 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gold outline-none transition-colors text-sm" 
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-wider">İlçe</label>
                            <input 
                                type="text" name="district" required 
                                value={shipping.district} onChange={handleShippingChange} 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gold outline-none transition-colors text-sm" 
                            />
                         </div>
                    </div>
                </div>
            </div>

            {/* SAĞ KOLON: Sipariş Özeti (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-beige/20 border border-beige/40">
                  <h3 className="text-xl font-serif text-black mb-6 border-b border-gray-100 pb-4">Sipariş Özeti</h3>
                  
                  {/* Mini Ürün Listesi */}
                  <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
                     {items.map(item => (
                         <div key={item.key} className="flex gap-3 text-sm py-1">
                             <div className="w-12 h-16 bg-gray-50 border border-gray-100 rounded flex-shrink-0 overflow-hidden">
                                 {item.image && <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className="font-medium text-black truncate">{item.name}</p>
                                 <p className="text-xs text-black/50 mt-0.5">
                                    {item.quantity} Adet 
                                    {item.sizeLabel && ` • ${item.sizeLabel}`}
                                    {item.colorLabel && ` • ${item.colorLabel}`}
                                 </p>
                             </div>
                             <div className="font-semibold text-black">{tl(item.price * item.quantity)}</div>
                         </div>
                     ))}
                  </div>

                  {/* Fiyatlar */}
                  <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
                     <div className="flex justify-between text-sm text-black/60">
                        <span>Ara Toplam</span>
                        <span>{tl(subtotal)}</span>
                     </div>
                     <div className="flex justify-between text-sm text-black/60">
                        <span>Kargo</span>
                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">ÜCRETSİZ</span>
                     </div>
                     <div className="flex justify-between font-bold text-xl text-black pt-2 border-t border-dashed border-gray-200 mt-2">
                        <span>Toplam Tutar</span>
                        <span>{tl(subtotal)}</span>
                     </div>
                  </div>

                  {/* Ödeme Başlat Butonu */}
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white h-14 rounded-xl font-bold tracking-widest hover:bg-gold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                  >
                      {loading ? (
                          <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             BAĞLANIYOR...
                          </>
                      ) : (
                          <>
                             ÖDEME EKRANINA GEÇ <ChevronRight size={18} />
                          </>
                      )}
                  </button>
              </div>
              
              <div className="flex items-center gap-2 justify-center text-xs text-black/40">
                <ShieldCheck size={16} /> PayTR ile Güvenli Ödeme
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}