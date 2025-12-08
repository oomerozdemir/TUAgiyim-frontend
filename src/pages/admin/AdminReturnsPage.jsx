import { useEffect, useState } from "react";
import api from "../../lib/api";
import { CheckCircle, XCircle, Clock, Truck, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_LABELS = {
  PENDING: { label: "Onay Bekliyor", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { label: "Onaylandı", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  RECEIVED: { label: "Ürün Ulaştı", color: "bg-purple-100 text-purple-800", icon: Truck },
  REFUNDED: { label: "İade Yapıldı", color: "bg-green-100 text-green-800", icon: RefreshCw },
  REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const { data } = await api.get("/api/returns");
      setReturns(data);
    } catch (error) {
      console.error("İadeler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Durumu "${STATUS_LABELS[newStatus].label}" olarak değiştirmek istediğinize emin misiniz?`)) return;
    
    setUpdatingId(id);
    try {
      const { data } = await api.patch(`/api/returns/${id}/status`, { status: newStatus });
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status: data.status } : r));
      alert(newStatus === "REFUNDED" ? "Durum güncellendi ve stoklar iade edildi." : "Durum güncellendi.");
    } catch (error) {
      alert("Güncelleme başarısız: " + (error.response?.data?.message || "Hata oluştu"));
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">İade Talepleri</h1>

      <div className="bg-white border border-beige/40 rounded-xl shadow-sm overflow-hidden">
        {returns.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Henüz iade talebi bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Talep ID</th>
                  <th className="px-6 py-4">Müşteri</th>
                  <th className="px-6 py-4">Sipariş No</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returns.map((req) => {
                  const StatusIcon = STATUS_LABELS[req.status]?.icon || Clock;
                  return (
                    <>
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{req.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-black">{req.user?.name}</div>
                          <div className="text-xs text-gray-500">{req.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">#{req.order?.orderNumber ?? "???"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_LABELS[req.status]?.color}`}>
                            <StatusIcon size={14} />
                            {STATUS_LABELS[req.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => toggleExpand(req.id)}
                            className="text-gray-500 hover:text-black transition-colors"
                          >
                            {expandedId === req.id ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </td>
                      </tr>
                      
                      {/* DETAY ALANI (AÇILIR KAPANIR) */}
                      {expandedId === req.id && (
                        <tr className="bg-gray-50/30">
                          <td colSpan="6" className="px-6 py-4 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6">
                              
                              {/* Ürünler Listesi */}
                              <div className="flex-1">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">İade Edilen Ürünler</h4>
                                <div className="space-y-3">
                                  {req.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-200">
                                      <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden">
                                         {/* Görsel varsa eklenebilir */}
                                      </div>
                                      <div className="text-sm">
                                        <div className="font-medium">{item.orderItem?.product?.name}</div>
                                        <div className="text-xs text-gray-500">Adet: <span className="font-bold text-black">{item.quantity}</span></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Neden ve Yönetim */}
                              <div className="flex-1 space-y-4">
                                <div>
                                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">İade Nedeni</h4>
                                  <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 italic">"{req.reason}"</p>
                                </div>

                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="font-bold text-sm mb-3">Durumu Güncelle</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.keys(STATUS_LABELS).map((key) => (
                                      <button
                                        key={key}
                                        onClick={() => handleStatusUpdate(req.id, key)}
                                        disabled={updatingId === req.id || req.status === key}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                                          ${req.status === key 
                                            ? "bg-black text-white border-black cursor-default" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-gold"
                                          }`}
                                      >
                                        {STATUS_LABELS[key].label}
                                      </button>
                                    ))}
                                  </div>
                                  {req.status !== "REFUNDED" && (
                                    <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                      <AlertCircle size={12} /> "İade Yapıldı" seçildiğinde stoklar otomatik güncellenir.
                                    </p>
                                  )}
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}