import { useState } from "react";
import { Plus, Minus, MessageCircle, Mail } from "lucide-react";

// --- SSS VERİLERİ ---
const FAQ_DATA = [
  {
    category: "SİPARİŞ & ÖDEME",
    items: [
      {
        question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        answer: "Kredi kartı (Visa, MasterCard, Amex), banka kartı ve havale/EFT yöntemlerini kabul ediyoruz. Tüm ödemeleriniz 256-bit SSL sertifikası ile güvence altındadır."
      },
      {
        question: "Siparişimi oluşturduktan sonra değiştirebilir miyim?",
        answer: "Siparişiniz henüz 'Hazırlanıyor' aşamasına geçmediyse müşteri hizmetlerimizle iletişime geçerek değişiklik yapabilirsiniz. Kargoya verilen siparişlerde maalesef değişiklik yapılamamaktadır."
      },
      {
        question: "Hediye paketi seçeneğiniz var mı?",
        answer: "Evet, TUA'nın 'Products for the Soul' mottosuna yakışır, özel tasarımlı hediye paketlerimiz mevcuttur. Sepet aşamasında hediye notunuzu ekleyebilir ve hediye paketi seçeneğini işaretleyebilirsiniz."
      }
    ]
  },
  {
    category: "KARGO & TESLİMAT",
    items: [
      {
        question: "Kargo ücreti ne kadar?",
        answer: "Türkiye içi tüm siparişlerinizde kargo ücretsizdir. Yurt dışı gönderimlerinde kargo ücreti, siparişin ağırlığına ve ülkeye göre ödeme ekranında hesaplanır."
      },
      {
        question: "Siparişim ne zaman ulaşır?",
        answer: "Siparişleriniz 1-3 iş günü içerisinde özenle hazırlanıp kargoya verilir. Teslimat süresi bulunduğunuz bölgeye göre 1-4 iş günü arasında değişiklik gösterebilir."
      }
    ]
  },
  {
    category: "İADE & DEĞİŞİM",
    items: [
      {
        question: "İade süreci nasıl işliyor?",
        answer: "Satın aldığınız ürünü, teslim tarihinden itibaren 14 gün içinde kullanılmamış ve etiketi koparılmamış olması şartıyla ücretsiz olarak iade edebilirsiniz. İade talebinizi 'Hesabım' sayfasından oluşturabilirsiniz."
      },
      {
        question: "Para iadesi ne zaman yapılır?",
        answer: "İade ettiğiniz ürün depomuza ulaşıp kalite kontrol ekibimiz tarafından onaylandıktan sonra 3 iş günü içinde ücret iadesi bankanıza yapılır. Bankanıza bağlı olarak hesabınıza yansıması 7 günü bulabilir."
      }
    ]
  },
  {
    category: "ÜRÜN & BAKIM",
    items: [
      {
        question: "Ürünlerin bakımı nasıl yapılmalı?",
        answer: "Her ürünümüzün iç etiketinde detaylı yıkama ve bakım talimatları yer almaktadır. Kumaşlarımızın kalitesini uzun süre koruması için hassas yıkama veya kuru temizleme öneriyoruz."
      },
      {
        question: "Beden tablosuna nereden ulaşabilirim?",
        answer: "Her ürün sayfasında, o ürüne özel ölçülerin yer aldığı 'Beden Tablosu' butonu bulunmaktadır. Emin olamadığınız durumlarda bizimle iletişime geçebilirsiniz."
      }
    ]
  }
];

// --- TEKİL SORU BİLEŞENİ (AKORDİYON) ---
function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-beige/40 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:bg-white/30"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? "text-gold font-serif" : "text-black group-hover:text-black/80"}`}>
          {question}
        </span>
        <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold" : "text-black/40"}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      
      <div 
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-black/60 leading-relaxed font-light max-w-3xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  // Hangi sorunun açık olduğunu tutan state (Örn: "0-1" -> 0. kategori 1. soru)
  const [openKey, setOpenKey] = useState("0-0"); 

  const handleToggle = (key) => {
    setOpenKey(prev => prev === key ? null : key);
  };

  return (
    <>
      <div className="bg-cream min-h-screen pt-10 pb-24">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
            Yardım Merkezi
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-black mb-6 font-serif">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-black/50 max-w-lg mx-auto font-light">
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Aradığınız cevabı bulamazsanız bize her zaman ulaşabilirsiniz.
          </p>
        </div>

        {/* --- SSS LİSTESİ --- */}
        <div className="max-w-[900px] mx-auto px-6 space-y-16">
          {FAQ_DATA.map((section, secIndex) => (
            <div key={secIndex} className="animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${secIndex * 150}ms` }}>
              {/* Kategori Başlığı */}
              <h2 className="text-xl font-serif text-black border-b-2 border-black pb-2 mb-6 inline-block">
                {section.category}
              </h2>
              
              {/* Sorular */}
              <div className="bg-white/50 border border-beige/30 rounded-xl px-6 md:px-10 shadow-sm hover:shadow-md transition-shadow duration-500">
                {section.items.map((item, itemIndex) => {
                  const key = `${secIndex}-${itemIndex}`;
                  return (
                    <AccordionItem
                      key={key}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openKey === key}
                      onClick={() => handleToggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* --- İLETİŞİM KUTUSU --- */}
        <div className="max-w-[1000px] mx-auto px-6 mt-24">
          <div className="bg-black text-white rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Dekoratif Arka Plan */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/noise.png')] opacity-10 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-serif mb-4">Hala sorunuz mu var?</h3>
              <p className="text-white/70 mb-8 max-w-xl mx-auto font-light">
                Ekibimiz size yardımcı olmaktan mutluluk duyar. Bize dilediğiniz kanaldan ulaşabilirsiniz.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:destek@tuadesign.com" 
                  className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-gold hover:text-white transition-colors duration-300 min-w-[200px] justify-center"
                >
                  <Mail size={18} />
                  E-posta Gönder
                </a>
                <a 
                  href="https://wa.me/905555555555" 
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors duration-300 min-w-[200px] justify-center"
                >
                  <MessageCircle size={18} />
                  WhatsApp Destek
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}