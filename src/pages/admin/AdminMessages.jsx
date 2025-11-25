import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Mail, Trash2, CheckCircle, Circle, Search, Inbox } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/api/contact");
      setMessages(data);
    } catch (error) {
      console.error("Mesajlar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const handleToggleRead = async (id) => {
    try {
      const { data } = await api.patch(`/api/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: data.isRead } : m))
      );
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Üst Başlık ve Arama */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Inbox className="text-gold" /> Gelen Mesajlar
          </h1>
          <p className="text-sm text-black/50 mt-1">
            Toplam {messages.length} mesaj ({messages.filter((m) => !m.isRead).length} okunmamış)
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input
            type="text"
            placeholder="İsim, e-posta veya konu ara..."
            className="w-full pl-10 pr-4 py-2 border border-beige/50 rounded-lg focus:border-gold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="bg-white border border-beige/40 rounded-xl shadow-sm overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-10 text-center text-black/40">Mesaj bulunamadı.</div>
        ) : (
          <div className="divide-y divide-beige/30">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors hover:bg-cream/30 ${
                  !msg.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  {/* Sol: İçerik */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg ${!msg.isRead ? "font-bold text-black" : "font-medium text-black/70"}`}>
                        {msg.subject || "Konusuz"}
                      </h3>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Yeni
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-black/50 mb-4">
                      <span className="flex items-center gap-1">
                        <UserCircleIcon name={msg.name} /> {msg.name}
                      </span>
                      <span className="w-1 h-1 bg-black/20 rounded-full" />
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {msg.email}
                      </span>
                      <span className="w-1 h-1 bg-black/20 rounded-full" />
                      <span>{new Date(msg.createdAt).toLocaleDateString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    <p className="text-black/80 leading-relaxed text-sm whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  {/* Sağ: Aksiyonlar */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleRead(msg.id)}
                      title={msg.isRead ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                      className={`p-2 rounded-full transition-colors ${
                        msg.isRead 
                          ? "text-black/20 hover:bg-green-50 hover:text-green-600" 
                          : "text-green-600 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {msg.isRead ? <Circle size={20} /> : <CheckCircle size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Sil"
                      className="p-2 text-black/20 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Küçük yardımcı bileşen
function UserCircleIcon({ name }) {
  return (
    <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[9px] font-bold text-black/60">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}