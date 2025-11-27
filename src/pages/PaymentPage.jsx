import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../lib/api";
import { MapPin, ShieldCheck, Truck, ChevronRight, Plus, CheckCircle } from "lucide-react";

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
  const { items, subtotal, clear } = useCart(); // clear fonksiyonunu kullanacağız
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shipping, setShipping] = useState(emptyShipping);
  
  // PayTR State'leri
  const [loading, setLoading] = useState(false);
  const [paytrToken, setPaytrToken] = useState(null);

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

  // ÖDEME BAŞLAT (iFrame Al)
  const handleStartPayment = async (e) => {
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

      // Yeni oluşturduğumuz /api/payment/start endpoint'ine gidiyoruz
      const { data } = await api.post("/api/payment/start", payload);
      
      if (data.token) {
        setPaytrToken(data.token);
        // İsteğe bağlı: Sepeti burada temizleyebilirsiniz.
        clear(); 
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Ödeme başlatılırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Boş sepet kontrolü (Token yoksa)
  if (!items.length && !paytrToken) {
    return (
      <section className="bg-cream min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
         <h1 className="text-2xl font-serif text-black mb-2">Sepetiniz Boş</h1>
         <button onClick={() => navigate("/urunler")} className="underline">Alışverişe Dön</button>
      </section>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Başlık */}
        <div className="mb-10 flex items-center gap-3 text-sm text-black/50">
            <span className="text-black font-medium">Sepet</span>
            <ChevronRight size={14} />
            <span className="text-gold font-bold border-b border-gold pb-0.5">Teslimat ve Ödeme</span>
        </div>

        {/* --- PAYTR IFRAME ALANI --- */}
        {paytrToken ? (
           <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-lg animate-in fade-in duration-500">
             <h2 className="text-center font-bold text-xl mb-4 text-black">Güvenli Ödeme Ekranı</h2>
             <div className="w-full overflow-hidden min-h-[600px] relative bg-gray-50 rounded-lg">
                <iframe
                    src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="no"
                    style={{ width: "100%", height: "800px" }}
                    allow="payment"
                ></iframe>
             </div>
             <div className="text-center mt-6">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-red-500 text-sm hover:underline"
                >
                  İşlemi İptal Et ve Geri Dön
                </button>
             </div>
           </div>
        ) : (
          <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* SOL: Adres ve Form */}
            <div className="lg:col-span-7 space-y-10">
                
                {/* Adres Seçimi */}
                <div>
                    <h2 className="text-2xl font-serif text-black mb-6 flex items-center gap-3">
                        <MapPin className="text-gold" size={24} />
                        Teslimat Adresi
                    </h2>

                    {loadingAddresses ? (
                        <div>Yükleniyor...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <label 
                                    key={addr.id} 
                                    className={`relative cursor-pointer border rounded-xl p-5 transition-all
                                        ${selectedAddressId === addr.id ? "bg-white border-gold shadow-md" : "bg-white/40 border-beige/50"}`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        className="hidden"
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => handleSelectAddress(addr.id)}
                                    />
                                    <div className="flex justify-between">
                                        <span className="font-bold text-sm">{addr.title}</span>
                                        {selectedAddressId === addr.id && <CheckCircle size={18} className="text-gold" />}
                                    </div>
                                    <p className="text-sm mt-2">{addr.addressLine}</p>
                                </label>
                            ))}
                            
                            <label className={`cursor-pointer border border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 ${selectedAddressId === null ? "bg-white border-gold" : "border-black/20"}`}>
                                <input type="radio" name="selectedAddress" className="hidden" checked={selectedAddressId === null} onChange={() => handleSelectAddress(null)} />
                                <Plus /> <span className="text-sm">Yeni Adres</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Form Alanları */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige/30">
                    <h3 className="text-lg font-bold mb-6 border-b pb-2">Adres Detayları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="fullName" required value={shipping.fullName} onChange={handleShippingChange} placeholder="Ad Soyad" className="p-3 border rounded-lg bg-gray-50" />
                        <input type="tel" name="phone" required value={shipping.phone} onChange={handleShippingChange} placeholder="Telefon" className="p-3 border rounded-lg bg-gray-50" />
                    </div>
                    <textarea name="addressLine" required value={shipping.addressLine} onChange={handleShippingChange} placeholder="Tam Adres" className="w-full p-3 border rounded-lg bg-gray-50 mb-4 min-h-[100px]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" name="city" required value={shipping.city} onChange={handleShippingChange} placeholder="Şehir" className="p-3 border rounded-lg bg-gray-50" />
                         <input type="text" name="district" required value={shipping.district} onChange={handleShippingChange} placeholder="İlçe" className="p-3 border rounded-lg bg-gray-50" />
                    </div>
                </div>
            </div>

            {/* SAĞ: Özet */}
            <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-beige/40">
                  <h3 className="text-xl font-serif text-black mb-6 border-b border-beige/30 pb-4">Özet</h3>
                  
                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between font-bold text-xl">
                        <span>Toplam Tutar</span>
                        <span>{tl(subtotal)}</span>
                     </div>
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white h-14 rounded-xl font-bold tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                      {loading ? "BAĞLANIYOR..." : "ÖDEME EKRANINA GEÇ"} <ChevronRight size={18} />
                  </button>
              </div>
              
              <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
                <ShieldCheck size={16} /> PayTR ile Güvenli Ödeme
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}