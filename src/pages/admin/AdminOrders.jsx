import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Package, Truck, CheckCircle, AlertCircle, Clock, Filter, ChevronDown, User, MapPin, Save, X, Box } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "AWAITING_PAYMENT", label: "Ödeme Bekliyor" },
  { value: "PAID", label: "Onaylandı (Hazırlanıyor)" },
  { value: "SHIPPED", label: "Kargolandı" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELED", label: "İptal Edildi" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return { label: "Onaylandı", className: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} /> };
    case "SHIPPED":
      return { label: "Kargolandı", className: "bg-blue-100 text-blue-700 border-blue-200", icon: <Truck size={14} /> };
    case "DELIVERED":
      return { label: "Teslim Edildi", className: "bg-purple-100 text-purple-700 border-purple-200", icon: <Box size={14} /> };
    case "AWAITING_PAYMENT":
    case "PENDING":
      return { label: "Beklemede", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <Clock size={14} /> };
    case "CANCELED":
      return { label: "İptal", className: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle size={14} /> };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700 border-gray-200", icon: <Package size={14} /> };
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  
  // Değişiklikleri tutan state
  const [edits, setEdits] = useState({}); // { orderId: { status, trackingNo, company } }

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

  const handleEditChange = (orderId, field, value) => {
    setEdits(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const cancelEdit = (orderId) => {
    const next = { ...edits };
    delete next[orderId];
    setEdits(next);
  };

  const saveOrder = async (orderId) => {
    const editData = edits[orderId];
    if (!editData) return;

    setUpdatingId(orderId);
    try {
      // API'ye status + kargo bilgilerini gönderiyoruz
      const { data } = await api.patch(`/api/orders/${orderId}/status`, {
        status: editData.status,
        cargoTrackingNumber: editData.trackingNo,
        cargoCompany: editData.company
      });
      
      // Listeyi güncelle
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...data } : o))
      );
      cancelEdit(orderId);
      
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Güncelleme başarısız.");
    } finally {
      setUpdatingId(null);
    }
  };

  const tl = (n) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(Number(n || 0));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-black">Sipariş Yönetimi</h2>
          <p className="text-sm text-black/50 mt-1">Toplam {orders.length} sipariş</p>
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
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-black/40" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border text-center text-black/50">Sipariş bulunamadı.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const editState = edits[order.id] || {};
            const currentStatus = editState.status || order.status;
            const isChanged = Object.keys(editState).length > 0;
            const statusUI = getStatusBadge(order.status);

            return (
              <div key={order.id} className="bg-white border border-beige/40 rounded-xl shadow-sm overflow-hidden">
                {/* Üst Bar */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-beige/30 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="font-mono font-bold text-black">#{order.orderNumber ?? order.id.slice(0, 8)}</div>
                    <div className="text-black/60 flex items-center gap-1"><Clock size={14}/> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</div>
                    <div className="flex items-center gap-1 font-medium text-black/80"><User size={14}/> {order.user?.name || "Misafir"}</div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${statusUI.className}`}>
                    {statusUI.icon} <span>{statusUI.label}</span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Teslimat */}
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
                    {/* Mevcut Kargo Bilgisi Varsa Göster */}
                    {(order.cargoTrackingNumber || order.cargoCompany) && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-blue-800 text-xs">
                            <p className="font-bold mb-1">📦 Kargo Bilgileri:</p>
                            <p>Firma: {order.cargoCompany || "-"}</p>
                            <p>Takip No: <span className="font-mono">{order.cargoTrackingNumber || "-"}</span></p>
                        </div>
                    )}
                  </div>

                  {/* Sipariş Detayı */}
                  <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-black/40 uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <Package size={14} /> Sipariş Detayı
                        </h4>
                        <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0 text-sm">
                                    <div className="font-medium text-black truncate">{item.product?.name}</div>
                                    <div className="text-black/50 text-xs">
                                        {item.sizeLabel && `Beden: ${item.sizeLabel} `}
                                        {item.colorLabel && `Renk: ${item.colorLabel}`}
                                    </div>
                                </div>
                                <div className="text-right text-sm font-bold text-black">{tl(item.price)} <span className="text-xs text-black/40 font-normal">x{item.quantity}</span></div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Aksiyon Alanı */}
                    <div className="mt-6 pt-4 border-t border-beige/30">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                            <div className="text-sm">
                                <span className="text-black/50 mr-2">Toplam:</span>
                                <span className="text-xl font-bold text-black">{tl(order.total)}</span>
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <select
                                        className={`pl-3 pr-8 py-2 rounded-lg border text-sm font-medium outline-none appearance-none cursor-pointer transition-colors w-full sm:w-48
                                            ${isChanged ? "bg-yellow-50 border-yellow-300 text-yellow-800" : "bg-white border-black/20 hover:border-gold text-black"}
                                        `}
                                        value={currentStatus}
                                        disabled={updatingId === order.id}
                                        onChange={(e) => handleEditChange(order.id, 'status', e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>

                                {/* Eğer Durum SHIPPED seçildiyse Kargo Inputlarını Göster */}
                                {currentStatus === "SHIPPED" && (
                                    <div className="flex gap-2 w-full sm:w-auto animate-in slide-in-from-top-2 fade-in">
                                        <input 
                                            type="text" 
                                            placeholder="Kargo Firması (Örn: Yurtiçi)" 
                                            className="border rounded px-2 py-1.5 text-xs w-1/2 sm:w-32"
                                            value={editState.company || order.cargoCompany || ""}
                                            onChange={(e) => handleEditChange(order.id, 'company', e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Takip No" 
                                            className="border rounded px-2 py-1.5 text-xs w-1/2 sm:w-32"
                                            value={editState.trackingNo || order.cargoTrackingNumber || ""}
                                            onChange={(e) => handleEditChange(order.id, 'trackingNo', e.target.value)}
                                        />
                                    </div>
                                )}

                                {isChanged && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <button onClick={() => saveOrder(order.id)} disabled={updatingId === order.id} className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gold transition-colors">
                                            {updatingId === order.id ? "..." : <><Save size={14} /> KAYDET</>}
                                        </button>
                                        <button onClick={() => cancelEdit(order.id)} disabled={updatingId === order.id} className="p-2 border border-black/10 text-black/50 rounded-lg hover:bg-red-50 hover:text-red-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
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