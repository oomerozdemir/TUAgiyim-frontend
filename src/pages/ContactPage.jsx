import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, CheckCircle, AlertCircle } from "lucide-react";
import api from "../lib/api"; 
import { useToast } from "../context/ToastContext";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Genel Bilgi",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/contact", form);
      addToast("Mesajınız bize ulaştı. Teşekkürler!", "success"); // <--- Bildirim
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      addToast("Mesaj gönderilemedi. Lütfen tekrar deneyin.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Bize Ulaşın
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-black mb-6 font-serif">
          Sizinle İletişime Geçmek İsteriz
        </h1>
        <p className="text-black/50 max-w-lg mx-auto font-light">
          Sorularınız, önerileriniz veya iş birlikleri için... Ekibimiz size yardımcı olmaktan mutluluk duyar.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 items-start">
          
          {/* --- SOL: İLETİŞİM BİLGİLERİ --- */}
          <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
            {/* ... (İletişim bilgileri aynı kalacak) ... */}
             <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white border border-beige/50 flex items-center justify-center text-gold shadow-sm flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-black mb-1">E-posta</h3>
                  <p className="text-sm text-black/60 font-light mb-1">Genel Sorularınız İçin:</p>
                  <a href="mailto:iletisim@tuagiyim.com" className="text-black font-medium hover:text-gold transition-colors">iletisim@tuagiyim.com</a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white border border-beige/50 flex items-center justify-center text-gold shadow-sm flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-black mb-1">Telefon / WhatsApp</h3>
                  <p className="text-sm text-black/60 font-light mb-1">Hafta içi 09:00 - 18:00</p>
                  <a href="tel:+905077877311" className="text-black font-medium hover:text-gold transition-colors">+90 (507) 787 73 11</a>
                </div>
              </div>

              
            </div>

            {/* Sosyal Medya */}
            <div className="pt-8 border-t border-beige/30">
              <h4 className="text-sm font-bold tracking-widest text-black/40 uppercase mb-4">Bizi Takip Edin</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gold transition-colors duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gold transition-colors duration-300">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* --- SAĞ: İLETİŞİM FORMU (BACKEND BAĞLANTILI) --- */}
          <div className="lg:col-span-3 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-beige/30">
              <h3 className="text-2xl font-serif text-black mb-8">Mesaj Gönderin</h3>
              
              {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.</span>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span>Bir hata oluştu. Lütfen tekrar deneyin.</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 tracking-wider uppercase">Adınız Soyadınız</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-b border-beige/50 bg-cream/20 focus:border-gold focus:bg-cream/40 outline-none transition-all text-black"
                      placeholder="Örn: Ayşe Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 tracking-wider uppercase">E-posta Adresiniz</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-b border-beige/50 bg-cream/20 focus:border-gold focus:bg-cream/40 outline-none transition-all text-black"
                      placeholder="ornek@mail.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 tracking-wider uppercase">Konu</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border-b border-beige/50 bg-cream/20 focus:border-gold focus:bg-cream/40 outline-none transition-all text-black appearance-none cursor-pointer"
                  >
                    <option>Genel Bilgi</option>
                    <option>Sipariş Durumu</option>
                    <option>İade ve Değişim</option>
                    <option>İş Birliği</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 tracking-wider uppercase">Mesajınız</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-4 border border-beige/50 bg-cream/20 rounded-lg focus:border-gold focus:bg-cream/40 outline-none transition-all text-black resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white h-14 rounded-lg font-medium tracking-wide hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "GÖNDERİLİYOR..." : "GÖNDER"}
                  {!loading && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}