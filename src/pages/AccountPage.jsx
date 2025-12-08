import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom"; // Link eklendi
import { Package, Truck, CheckCircle, AlertCircle, Clock, MapPin, ChevronRight, Box, X, RotateCcw } from "lucide-react"; // İkonlar eklendi
import { useToast } from "../context/ToastContext";

const TabButton = ({ id, active, onClick, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
      active === id
        ? "bg-black text-white border-black shadow-md"
        : "bg-white text-black/70 border-black/10 hover:border-black/30 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

const emptyAddress = {
  title: "Ev",
  fullName: "",
  phone: "",
  city: "",
  district: "",
  neighborhood: "",
  addressLine: "",
  postalCode: "",
  isDefault: false,
};

// --- SİPARİŞ DURUMU YARDIMCISI ---
const getOrderStatusUI = (status) => {
  switch (status) {
    case "PAID":
      return { 
        label: "Siparişiniz Hazırlanıyor", 
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle size={14} />
      };
    case "SHIPPED":
      return { 
        label: "Kargoya Verildi", 
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Truck size={14} />
      };
    case "DELIVERED": // YENİ
      return { 
        label: "Teslim Edildi", 
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <Box size={14} />
      };
    case "AWAITING_PAYMENT":
    case "PENDING":
      return { 
        label: "Ödeme Bekleniyor", 
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock size={14} />
      };
    case "CANCELED":
      return { 
        label: "İptal Edildi", 
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertCircle size={14} />
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Package size={14} />
      };
  }
};

const tl = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(Number(n||0));

export default function AccountPage() {
  const { auth, setAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // Profil
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Şifre
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [pwSaving, setPwSaving] = useState(false);

  // Siparişler
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Adresler
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // --- İADE MODAL STATE ---
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnItemsSelection, setReturnItemsSelection] = useState({}); 
  const [submittingReturn, setSubmittingReturn] = useState(false);

const { addToast } = useToast();


  // Profil bilgisi
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const { data } = await api.get("/api/auth/profile");
        setProfile({ name: data.name || "", email: data.email || "" });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Siparişler
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/my");
        setOrders(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // Adresler
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const { data } = await api.get("/api/account/addresses");
        setAddresses(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

    useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "addresses", "password", "orders"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const refreshAddresses = async () => {
    try {
      const { data } = await api.get("/api/account/addresses");
      setAddresses(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Profil kaydet
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    try {
      setSavingProfile(true);
      const { data } = await api.put("/api/auth/profile", {
        name: profile.name,
        email: profile.email,
      });

      setAuth((prev) => ({
        ...prev,
        user: { ...(prev.user || {}), ...data },
      }));
      alert("Bilgileriniz güncellendi.");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Profil güncellenemedi.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Şifre kaydet
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwSaving) return;

    if (pwForm.newPassword !== pwForm.confirm) {
      alert("Yeni parola ve doğrulama aynı olmalı.");
      return;
    }

    try {
      setPwSaving(true);
      await api.put("/api/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      alert("Parolanız güncellendi.");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Parola güncellenemedi.");
    } finally {
      setPwSaving(false);
    }
  };

  // Adres işlemleri...
  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
    setAddressFormOpen(true);
  };

  const openEditAddressForm = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title || "",
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      city: addr.city || "",
      district: addr.district || "",
      neighborhood: addr.neighborhood || "",
      addressLine: addr.addressLine || "",
      postalCode: addr.postalCode || "",
      isDefault: addr.isDefault || false,
    });
    setAddressFormOpen(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (savingAddress) return;

    try {
      setSavingAddress(true);
      if (editingAddressId) {
        await api.put(`/api/account/addresses/${editingAddressId}`, addressForm);
      } else {
        await api.post("/api/account/addresses", addressForm);
      }
      await refreshAddresses();
      setAddressFormOpen(false);
      setEditingAddressId(null);
      setAddressForm(emptyAddress);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Adres kaydedilemedi.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/account/addresses/${id}`);
      await refreshAddresses();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Adres silinemedi.");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await api.post(`/api/account/addresses/${id}/default`);
      await refreshAddresses();
    } catch (e) {
      console.error(e);
      alert("Varsayılan adres ayarlanamadı.");
    }
  };

  // İade Modalini Aç
  const openReturnModal = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason("");
    setReturnItemsSelection({});
    setReturnModalOpen(true);
  };

  // İade Miktarı Değiştirme
  const handleReturnQtyChange = (orderItemId, val, max) => {
    const qty = Math.max(0, Math.min(Number(val), max));
    setReturnItemsSelection(prev => ({
        ...prev,
        [orderItemId]: qty
    }));
  };

  // İade Gönder
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if(submittingReturn) return;

    // Seçili ürünleri formatla
    const itemsPayload = Object.entries(returnItemsSelection)
        .filter(([_, qty]) => qty > 0)
        .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));

    if (itemsPayload.length === 0) {
        addToast("Lütfen iade edilecek en az bir ürün seçiniz.", "error");
        return;
    }

    try {
        setSubmittingReturn(true);
        await api.post("/api/returns", {
            orderId: selectedOrderForReturn.id,
            items: itemsPayload,
            reason: returnReason
        });
        addToast("İade talebiniz başarıyla oluşturuldu.", "success");
        setReturnModalOpen(false);
        // İsterseniz siparişleri yeniden çekebilirsiniz ama durum hemen değişmeyebilir
    } catch (err) {
        addToast("İade talebi oluşturulamadı: " + (err.response?.data?.message), "error");
    } finally {
        setSubmittingReturn(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 bg-cream min-h-screen">
      <h1 className="text-3xl font-serif font-light mb-2 text-black">Hesabım</h1>
      <p className="text-black/50 mb-8 text-sm font-light">
        Bilgilerinizi yönetin, adres ekleyin ve sipariş geçmişinizi görüntüleyin.
      </p>

      {/* Tablar */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-beige/40 pb-6">
        <TabButton id="orders" active={activeTab} onClick={setActiveTab}>
          Siparişlerim
        </TabButton>
        <TabButton id="profile" active={activeTab} onClick={setActiveTab}>
          Profil Bilgilerim
        </TabButton>
        <TabButton id="addresses" active={activeTab} onClick={setActiveTab}>
          Adreslerim
        </TabButton>
        <TabButton id="password" active={activeTab} onClick={setActiveTab}>
          Şifre Değiştir
        </TabButton>
      </div>

      {/* --- SİPARİŞLERİM (YENİ TASARIM) --- */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-6 text-black">Sipariş Geçmişi</h2>
          
          {loadingOrders ? (
            <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-black/50">Yükleniyor...</p>
            </div>
          ) : !orders.length ? (
            <div className="text-center py-16 bg-white border border-beige/40 rounded-xl">
                <Package size={48} className="mx-auto text-black/20 mb-4" strokeWidth={1} />
                <p className="text-black/60 mb-4">Henüz bir siparişiniz bulunmuyor.</p>
                <Link to="/urunler" className="text-gold hover:underline text-sm font-bold tracking-wider uppercase">Alışverişe Başla</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => {
                const statusUI = getOrderStatusUI(order.status);
                const canReturn = order.status === "DELIVERED";
                
                return (
                  <div key={order.id} className="bg-white border border-beige/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    
                    {/* Üst Bilgi Çubuğu */}
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-beige/30 flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-black/40 font-bold block">Sipariş Tarihi</span>
                                <span className="text-sm font-medium text-black/80">
                                    {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-black/40 font-bold block">Toplam Tutar</span>
                                <span className="text-sm font-bold text-black">{tl(order.total)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-black/40 font-bold block">Sipariş No</span>
                                <span className="text-sm font-mono text-black/70">#{order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                        </div>

                        {/* Durum Badge */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${statusUI.className}`}>
                            {statusUI.icon}
                            {statusUI.label}
                        </div>
                    </div>

                    {/* Alt İçerik */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Sol: Ürün Listesi */}
                        <div className="md:col-span-2 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    {/* Ürün Görseli (Varsa) */}
                                    <div className="w-16 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0]?.url ? (
                                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Görsel Yok</div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-black truncate">{item.product?.name}</h4>
                                        <div className="text-xs text-black/50 mt-1 flex gap-2">
                                            {item.sizeLabel && <span className="bg-gray-100 px-1.5 py-0.5 rounded">Beden: {item.sizeLabel}</span>}
                                            {item.colorLabel && <span className="bg-gray-100 px-1.5 py-0.5 rounded">Renk: {item.colorLabel}</span>}
                                        </div>
                                        <div className="text-sm font-semibold text-black mt-1">
                                            {tl(item.price)} <span className="text-black/40 font-normal text-xs">x {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sağ: Teslimat Bilgisi */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                            <div className="flex items-center gap-2 text-gold mb-3 font-bold uppercase text-xs tracking-wider">
                                <MapPin size={14} /> Teslimat Adresi
                            </div>
                            <div className="space-y-1 text-black/70">
                                <p className="font-medium text-black">{order.shippingName}</p>
                                <p>{order.shippingAddressLine}</p>
                                <p>{order.shippingDistrict} / {order.shippingCity}</p>
                                {order.shippingPhone && <p className="text-xs mt-2 text-black/50">{order.shippingPhone}</p>}
                            </div>
                            {order.customerNote && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <span className="text-[10px] font-bold text-black/40 uppercase">Sipariş Notu:</span>
                                    <p className="text-xs text-black/70 italic">"{order.customerNote}"</p>
                                </div>
                            )}
                        </div>

                        {/* İADE BUTONU */}
                           {canReturn && (
                               <button 
                                   onClick={() => openReturnModal(order)}
                                   className="mt-4 w-full py-2 flex items-center justify-center gap-2 border border-black/10 rounded-lg hover:bg-black hover:text-white transition-all text-sm font-medium"
                               >
                                   <RotateCcw size={16} /> İade Talebi Oluştur
                               </button>
                           )}
                  
      
                         {/* KARGO TAKİP (YENİ) */}
                            {(order.cargoTrackingNumber || order.cargoCompany) && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-2 text-blue-800 mb-2 font-bold uppercase text-xs tracking-wider">
                                        <Truck size={14} /> Kargo Bilgileri
                                    </div>
                                    <div className="text-blue-900 space-y-1">
                                        {order.cargoCompany && <p>Firma: <span className="font-medium">{order.cargoCompany}</span></p>}
                                        {order.cargoTrackingNumber && <p>Takip No: <span className="font-mono font-medium tracking-wide">{order.cargoTrackingNumber}</span></p>}
                                    </div>
                                </div>
                            )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PROFİL */}
      {activeTab === "profile" && (
        <div className="border rounded-xl p-5 max-w-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Profil Bilgilerim</h2>
          {loadingProfile ? (
            <p className="text-sm text-black/60">Yükleniyor...</p>
          ) : (
            <form className="space-y-4" onSubmit={handleProfileSave}>
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                <input
                  type="text"
                  className="w-full border rounded-lg h-10 px-3 text-sm"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input
                  type="email"
                  className="w-full border rounded-lg h-10 px-3 text-sm"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="mt-2 inline-flex items-center justify-center px-5 h-10 rounded-lg bg-black text-white text-sm disabled:opacity-60"
              >
                {savingProfile ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ADRESLER */}
      {activeTab === "addresses" && (
        <div className="border rounded-xl p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Kayıtlı Adreslerim</h2>
            <button
              onClick={openNewAddressForm}
              className="text-sm px-4 h-9 rounded-lg bg-black text-white hover:bg-gold transition-colors"
            >
              Yeni Adres Ekle
            </button>
          </div>

          {loadingAddresses ? (
            <p className="text-sm text-black/60">Adresler yükleniyor...</p>
          ) : !addresses.length ? (
            <p className="text-sm text-black/60 py-4">
              Henüz kayıtlı bir adresiniz yok.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-black/10 rounded-xl p-4 flex flex-col justify-between hover:border-gold/50 transition-colors bg-gray-50/30"
                >
                  <div className="text-sm mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] px-2 py-[2px] rounded-full bg-black text-white font-medium">
                            Varsayılan
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-black/80 font-medium mb-1">
                      {addr.fullName}
                    </div>
                    <div className="text-black/70 leading-relaxed">
                      {addr.addressLine} <br />
                      {addr.neighborhood && `${addr.neighborhood}, `}
                      {addr.district} / {addr.city}
                    </div>
                    <div className="text-black/60 text-xs mt-2 flex items-center gap-1">
                        <Phone size={12} /> {addr.phone}
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs pt-3 border-t border-black/5">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-black/60 hover:text-black underline"
                      >
                        Varsayılan yap
                      </button>
                    )}
                    <button
                      onClick={() => openEditAddressForm(addr)}
                      className="text-blue-600 hover:text-blue-800 underline ml-auto"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-600 hover:text-red-800 underline"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {addressFormOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setAddressFormOpen(false)}>
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-bold mb-4">{editingAddressId ? "Adresi Düzenle" : "Yeni Adres Ekle"}</h3>
                    <form
                    className="grid grid-cols-1 gap-4 text-sm"
                    onSubmit={handleAddressSubmit}
                    >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Adres Başlığı</label>
                            <input name="title" value={addressForm.title} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" placeholder="Ev, İş" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Telefon</label>
                            <input name="phone" value={addressForm.phone} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" required />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Ad Soyad</label>
                        <input name="fullName" value={addressForm.fullName} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Şehir</label>
                            <input name="city" value={addressForm.city} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">İlçe</label>
                            <input name="district" value={addressForm.district} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" required />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mahalle</label>
                        <input name="neighborhood" value={addressForm.neighborhood} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Adres</label>
                        <textarea name="addressLine" value={addressForm.addressLine} onChange={handleAddressChange} className="w-full border rounded-lg px-3 py-2 min-h-[80px]" required />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Posta Kodu</label>
                        <input name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} className="w-full border rounded-lg h-10 px-3" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="isDefault" type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />
                        <label htmlFor="isDefault">Bu adresi varsayılan yap</label>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="submit" disabled={savingAddress} className="flex-1 h-10 rounded-lg bg-black text-white font-medium hover:bg-gold transition-colors disabled:opacity-60">
                        {savingAddress ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button type="button" onClick={() => setAddressFormOpen(false)} className="px-6 h-10 rounded-lg border border-black/20 hover:bg-gray-50">
                        Vazgeç
                        </button>
                    </div>
                    </form>
                </div>
            </div>
          )}
        </div>
      )}

      {/* ŞİFRE */}
      {activeTab === "password" && (
        <div className="border rounded-xl p-5 max-w-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Şifre Değiştir</h2>
          <form className="space-y-4" onSubmit={handlePasswordSave}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mevcut Şifre
              </label>
              <input
                type="password"
                className="w-full border rounded-lg h-10 px-3 text-sm"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Yeni Şifre
              </label>
              <input
                type="password"
                className="w-full border rounded-lg h-10 px-3 text-sm"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, newPassword: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                className="w-full border rounded-lg h-10 px-3 text-sm"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, confirm: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={pwSaving}
              className="mt-2 inline-flex items-center justify-center px-5 h-10 rounded-lg bg-black text-white text-sm disabled:opacity-60"
            >
              {pwSaving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        </div>
      )}

      {/* --- İADE MODALI --- */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-serif font-bold">İade Talebi Oluştur</h3>
                    <button onClick={() => setReturnModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmitReturn} className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                        <p>İade etmek istediğiniz ürünlerin yanındaki kutucuklara <strong>iade edilecek adedi</strong> giriniz.</p>
                    </div>

                    <div className="space-y-4">
                        {selectedOrderForReturn.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 border p-3 rounded-lg">
                                <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                    {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">Satın Alınan: {item.quantity} Adet</p>
                                    <p className="text-xs text-gray-500">{item.sizeLabel} / {item.colorLabel}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">İade Adedi</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max={item.quantity}
                                        className="w-16 border rounded p-1 text-center font-bold"
                                        value={returnItemsSelection[item.id] || 0}
                                        onChange={(e) => handleReturnQtyChange(item.id, e.target.value, item.quantity)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">İade Nedeni</label>
                        <textarea 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-black outline-none resize-none"
                            rows="3"
                            placeholder="Ürünü neden iade ediyorsunuz? (Beden uymadı, hasarlı, vazgeçtim vb.)"
                            required
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setReturnModalOpen(false)} className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50">Vazgeç</button>
                        <button type="submit" disabled={submittingReturn} className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gold transition-colors disabled:opacity-70">
                            {submittingReturn ? "Gönderiliyor..." : "Talebi Oluştur"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      
    </section>
  );
}