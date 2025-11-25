import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../lib/api";
import { MapPin, ShieldCheck, Truck, CreditCard, Plus, CheckCircle, ChevronRight, ShoppingBag } from "lucide-react";

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
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  // State'ler
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // null = yeni adres
  const [shipping, setShipping] = useState(emptyShipping);
  const [loading, setLoading] = useState(false);

  // Adresleri Çek
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const { data } = await api.get("/api/account/addresses");
        setAddresses(data || []);

        if (data && data.length) {
          const defaultAddress = data.find((a) => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddress.id);
          fillForm(defaultAddress);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Formu Doldurma Yardımcısı
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

  // Boş Sepet Kontrolü
  if (!items.length) {
    return (
      <section className="bg-cream min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-white border border-beige/60 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag strokeWidth={1} size={32} className="text-gold/60" />
        </div>
        <h1 className="text-2xl font-serif text-black mb-2">Sepetiniz Boş</h1>
        <p className="text-black/60 mb-8 font-light">Ödeme adımına geçmek için sepetinize ürün ekleyin.</p>
        <button onClick={() => navigate("/urunler")} className="text-xs font-bold tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-all uppercase">
          Alışverişe Dön
        </button>
      </section>
    );
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    if (!id) {
      setShipping(emptyShipping);
    } else {
      const addr = addresses.find((a) => a.id === id);
      if (addr) fillForm(addr);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
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

      const { data } = await api.post("/api/orders", payload);
      clear();
      navigate("/siparis-basarili", { state: { orderId: data.id, order: data } });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Üst Başlık */}
        <div className="mb-10 flex items-center gap-3 text-sm text-black/50">
            <span className="text-black font-medium">Sepet</span>
            <ChevronRight size={14} />
            <span className="text-gold font-bold border-b border-gold pb-0.5">Teslimat ve Ödeme</span>
            <ChevronRight size={14} />
            <span>Onay</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- SOL: ADRES VE FORM --- */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. ADRES SEÇİMİ */}
            <div>
                <h2 className="text-2xl font-serif text-black mb-6 flex items-center gap-3">
                    <MapPin className="text-gold" size={24} />
                    Teslimat Adresi
                </h2>

                {loadingAddresses ? (
                    <div className="p-6 text-center text-black/40 bg-white/50 rounded-xl border border-beige/30">Adresler yükleniyor...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Kayıtlı Adresler */}
                        {addresses.map((addr) => (
                            <label 
                                key={addr.id} 
                                className={`relative cursor-pointer group border rounded-xl p-5 transition-all duration-300 flex flex-col justify-between min-h-[140px]
                                    ${selectedAddressId === addr.id 
                                        ? "bg-white border-gold shadow-md ring-1 ring-gold/20" 
                                        : "bg-white/40 border-beige/50 hover:border-gold/50 hover:bg-white"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="selectedAddress"
                                    className="hidden"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => handleSelectAddress(addr.id)}
                                />
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-sm text-black">{addr.title}</span>
                                        {selectedAddressId === addr.id && <CheckCircle size={18} className="text-gold" />}
                                    </div>
                                    <p className="text-sm text-black/70 line-clamp-2 leading-relaxed">{addr.addressLine}</p>
                                    <p className="text-xs text-black/50 mt-1">{addr.district} / {addr.city}</p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-black/5 text-xs font-medium text-black/60">
                                    {addr.fullName}
                                </div>
                            </label>
                        ))}

                        {/* Yeni Adres Seçeneği */}
                        <label 
                            className={`relative cursor-pointer border border-dashed rounded-xl p-5 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] gap-3
                                ${selectedAddressId === null 
                                    ? "bg-white border-gold shadow-md" 
                                    : "bg-transparent border-black/20 hover:border-black/40 hover:bg-white/30"
                                }`}
                        >
                            <input
                                type="radio"
                                name="selectedAddress"
                                className="hidden"
                                checked={selectedAddressId === null}
                                onChange={() => handleSelectAddress(null)}
                            />
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedAddressId === null ? "bg-black text-white" : "bg-black/5 text-black/40"}`}>
                                <Plus size={20} />
                            </div>
                            <span className="text-sm font-medium">Yeni Adres Ekle</span>
                        </label>
                    </div>
                )}
            </div>

            {/* 2. FORM ALANI */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-beige/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-black/80 border-b border-beige/40 pb-4">
                    {selectedAddressId ? "Seçili Adres Detayları" : "Yeni Adres Bilgileri"}
                </h3>
                
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">Ad Soyad</label>
                            <input type="text" name="fullName" required value={shipping.fullName} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="Adınız Soyadınız" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">Telefon</label>
                            <input type="tel" name="phone" required value={shipping.phone} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="05XX XXX XX XX" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">Şehir</label>
                            <input type="text" name="city" required value={shipping.city} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="İl" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">İlçe</label>
                            <input type="text" name="district" required value={shipping.district} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="İlçe" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-black/50 uppercase ml-1">Adres</label>
                        <textarea name="addressLine" required value={shipping.addressLine} onChange={handleShippingChange} 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm min-h-[100px] resize-none" placeholder="Mahalle, sokak, kapı no..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">Posta Kodu (Opsiyonel)</label>
                            <input type="text" name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="34000" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black/50 uppercase ml-1">Sipariş Notu</label>
                            <input type="text" name="note" value={shipping.note} onChange={handleShippingChange} 
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all text-black text-sm" placeholder="Kurye notu vb." />
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* --- SAĞ: SİPARİŞ ÖZETİ (STICKY) --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg shadow-beige/20 border border-beige/40">
                <h3 className="text-xl font-serif text-black mb-6 pb-4 border-b border-beige/30">Sipariş Özeti</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((it) => (
                        <div key={it.key} className="flex gap-4 items-start py-2">
                            <div className="w-16 h-20 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                                {it.image ? (
                                    <img src={it.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Yok</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-black truncate">{it.name}</div>
                                <div className="text-xs text-black/50 mt-1">
                                    {it.quantity} adet {it.sizeLabel && `• ${it.sizeLabel}`} {it.colorLabel && `• ${it.colorLabel}`}
                                </div>
                                <div className="text-sm font-semibold mt-1">{tl(it.price * it.quantity)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-beige/30">
                    <div className="flex justify-between text-sm text-black/60">
                        <span>Ara Toplam</span>
                        <span>{tl(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-black/60">
                        <span>Kargo</span>
                        <span className="text-green-600 font-medium">Ücretsiz</span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-black/5">
                        <span className="font-bold text-black">Toplam</span>
                        <span className="text-2xl font-bold text-black">{tl(subtotal)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-8 w-full bg-black text-white h-14 rounded-xl font-bold tracking-widest hover:bg-gold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            İŞLENİYOR...
                        </>
                    ) : (
                        <>
                            SİPARİŞİ TAMAMLA <ChevronRight size={18} />
                        </>
                    )}
                </button>
            </div>

            {/* Güvenlik Rozetleri */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 border border-beige/30 p-4 rounded-xl flex items-center gap-3">
                    <ShieldCheck className="text-gold" size={24} strokeWidth={1.5} />
                    <div className="text-xs">
                        <div className="font-bold text-black">Güvenli Ödeme</div>
                        <div className="text-black/50">256-bit SSL Koruması</div>
                    </div>
                </div>
                <div className="bg-white/60 border border-beige/30 p-4 rounded-xl flex items-center gap-3">
                    <Truck className="text-gold" size={24} strokeWidth={1.5} />
                    <div className="text-xs">
                        <div className="font-bold text-black">Ücretsiz Kargo</div>
                        <div className="text-black/50">Tüm siparişlerde</div>
                    </div>
                </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}