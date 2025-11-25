import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Package, Truck, CheckCircle, AlertCircle, Clock, Filter, ChevronDown, User, MapPin, Save, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Ödeme Bekleniyor" },
  { value: "PAID", label: "Sipariş Onaylandı" },
  { value: "SHIPPED", label: "Kargolandı" },
  { value: "CANCELED", label: "İptal Edildi" },
];

// Durum Görünümü Yardımcısı
const getStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return { 
        label: "Onaylandı", 
        className: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle size={14} />
      };
    case "SHIPPED":
      return { 
        label: "Kargolandı", 
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Truck size={14} />
      };
    case "PENDING":
      return { 
        label: "Beklemede", 
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <Clock size={14} />
      };
    case "CANCELED":
      return { 
        label: "İptal", 
        className: "bg-red-100 text-red-700 border-red-200",
        icon: <AlertCircle size={14} />
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <Package size={14} />
      };
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  
  // Değişiklikleri geçici olarak tutan state: { [orderId]: "YENI_STATUS" }
  const [statusUpdates, setStatusUpdates] = useState({});

  const loadOrders = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders/admin", {
        params: status ? { status } : {},
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Siparişler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(filterStatus);
  }, [filterStatus]);

  // Select değişince sadece local state'i güncelle
  const handleStatusSelect = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  // Değişikliği iptal et
  const cancelStatusUpdate = (orderId) => {
    const next = { ...statusUpdates };
    delete next[orderId];
    setStatusUpdates(next);
  };

  // "Kaydet" butonuna basınca API'ye git
  const saveStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    try {
      const { data } = await api.patch(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      
      // Ana listeyi güncelle
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: data.status } : o))
      );
      
      // Geçici state'i temizle
      cancelStatusUpdate(orderId);
      
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Sipariş durumu güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingId(null);
    }
  };

  const tl = (n) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- BAŞLIK VE FİLTRE --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-black">Sipariş Yönetimi</h2>
          <p className="text-sm text-black/50 mt-1">Toplam {orders.length} sipariş listeleniyor</p>
        </div>

        <div className="relative group">
          <div className="flex items-center gap-2 bg-white border border-beige/60 rounded-lg px-3 py-2 shadow-sm text-sm text-black/70">
            <Filter size={16} />
            <select
              className="bg-transparent outline-none appearance-none pr-6 cursor-pointer font-medium"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tüm Siparişler</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-black/40" />
          </div>
        </div>
      </div>

      {/* --- YÜKLENİYOR / BOŞ DURUM --- */}
      {loading ? (
        <div className="text-center py-20">
           <div className="w-10 h-10 border-4 border-beige border-t-gold rounded-full animate-spin mx-auto mb-3"></div>
           <p className="text-black/50 text-sm">Siparişler yükleniyor...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-beige/40 text-center">
          <Package size={48} className="text-black/10 mx-auto mb-4" />
          <p className="text-black/50 font-medium">Kriterlere uygun sipariş bulunamadı.</p>
        </div>
      ) : (
        
        /* --- SİPARİŞ LİSTESİ --- */
        <div className="space-y-6">
          {orders.map((order) => {
            // Görüntülenecek durum: Eğer düzenleniyorsa yeni durum, yoksa mevcut durum
            const currentStatus = statusUpdates[order.id] || order.status;
            const isChanged = statusUpdates[order.id] && statusUpdates[order.id] !== order.status;
            const statusUI = getStatusBadge(order.status); // Orijinal durumun ikonunu/rengini göster

            return (
              <div
                key={order.id}
                className="bg-white border border-beige/40 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Kart Başlığı (Üst Bar) */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-beige/30 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="font-mono font-bold text-black">
                      #{order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-black/60 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-1 font-medium text-black/80">
                      <User size={14} />
                      {order.user?.name || "Misafir"}
                    </div>
                  </div>

                  {/* Durum Badge */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${statusUI.className}`}>
                    {statusUI.icon}
                    <span>{statusUI.label}</span>
                  </div>
                </div>

                {/* Kart İçeriği */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* 1. Sütun: Müşteri ve Teslimat */}
                  <div className="space-y-4 text-sm border-r border-dashed border-beige/40 pr-0 lg:pr-8">
                    <h4 className="font-bold text-black/40 uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                      <MapPin size={14} /> Teslimat Bilgileri
                    </h4>
                    <div className="space-y-1 text-black/80">
                      <p className="font-semibold">{order.shippingName}</p>
                      <p>{order.shippingAddressLine}</p>
                      <p>{order.shippingDistrict} / {order.shippingCity}</p>
                      {order.shippingPhone && <p className="text-black/60 text-xs mt-1">{order.shippingPhone}</p>}
                    </div>
                    {order.customerNote && (
                      <div className="mt-3 bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800 text-xs">
                        <span className="font-bold">Müşteri Notu:</span> {order.customerNote}
                      </div>
                    )}
                  </div>

                  {/* 2. Sütun: Ürünler */}
                  <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-black/40 uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <Package size={14} /> Sipariş Detayı
                        </h4>
                        <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-12 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                    {item.product?.images?.[0]?.url ? (
                                        <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">YOK</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-sm">
                                    <div className="font-medium text-black truncate">{item.product?.name || "Silinmiş Ürün"}</div>
                                    <div className="text-black/50 text-xs">
                                        {item.sizeLabel && <span className="mr-2">Beden: {item.sizeLabel}</span>}
                                        {item.colorLabel && <span>Renk: {item.colorLabel}</span>}
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="font-bold text-black">{tl(item.price)}</div>
                                    <div className="text-xs text-black/40">x{item.quantity}</div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Alt Bar: Toplam Tutar ve Durum Güncelleme */}
                    <div className="mt-6 pt-4 border-t border-beige/30 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-sm">
                            <span className="text-black/50 mr-2">Toplam Tutar:</span>
                            <span className="text-xl font-bold text-black">{tl(order.total)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black/40 uppercase mr-1">Durum Değiştir:</span>
                            
                            <div className="relative">
                                <select
                                    className={`pl-3 pr-8 py-2 rounded-lg border text-sm font-medium outline-none appearance-none cursor-pointer transition-colors
                                        ${isChanged 
                                            ? "bg-yellow-50 border-yellow-300 text-yellow-800" 
                                            : "bg-white border-black/20 hover:border-gold text-black"}
                                    `}
                                    value={currentStatus}
                                    disabled={updatingId === order.id}
                                    onChange={(e) => handleStatusSelect(order.id, e.target.value)}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/40" />
                            </div>

                            {/* KAYDET / İPTAL BUTONLARI (Sadece değişiklik varsa görünür) */}
                            {isChanged && (
                                <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <button 
                                        onClick={() => saveStatus(order.id)}
                                        disabled={updatingId === order.id}
                                        className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50"
                                    >
                                        {updatingId === order.id ? "..." : <><Save size={14} /> KAYDET</>}
                                    </button>
                                    <button 
                                        onClick={() => cancelStatusUpdate(order.id)}
                                        disabled={updatingId === order.id}
                                        className="p-2 border border-black/10 text-black/50 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                        title="İptal Et"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}