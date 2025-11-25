import { Gem, Scissors, Gift } from "lucide-react";

export default function InfoHighlights() {
  const items = [
    { 
      icon: <Gem strokeWidth={1.5} size={32} />,
      title: "ZAMANSIZ TASARIM", 
      text: "Geçici trendlerin ötesinde, ruhunuza hitap eden modern ve zarif çizgilerle tasarlandı. Her parça, gardırobunuzun vazgeçilmezi olmaya aday." 
    },
    { 
      icon: <Scissors strokeWidth={1.5} size={32} />,
      title: "USTALIKLA İŞLENEN DETAYLAR", 
      text: "Kumaşın dokusundan dikişin hassasiyetine kadar her detayda kaliteyi hissedeceksiniz. Geleneksel zanaat, modern üretimle buluştu." 
    },
    { 
      icon: <Gift strokeWidth={1.5} size={32} />,
      title: "ÖZENLİ PAKETLEME", 
      text: "Siparişiniz sadece bir kargo değil, size özel bir hediye. Her paketi, açarken sizi gülümsetecek bir özenle hazırlayıp ulaştırıyoruz." 
    },
  ];

  return (
    <section className="w-full bg-cream flex justify-center items-stretch py-16 border-t border-beige/30">
      <div className="w-full max-w-[1400px] px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-beige/40">
        {items.map((item, i) => (
          <div key={i} className="group flex flex-col items-center text-center p-8 md:p-12 transition-all duration-300 hover:bg-white/40">
            {/* İKON */}
            <div className="mb-6 text-gold p-4 rounded-full bg-white border border-beige/30 shadow-sm group-hover:scale-110 transition-transform duration-500">
              {item.icon}
            </div>
            
            {/* BAŞLIK */}
            <h3 className="text-lg font-serif tracking-wider mb-4 text-black group-hover:text-gold transition-colors">
              {item.title}
            </h3>
            
            {/* METİN */}
            <p className="text-sm leading-relaxed text-black/60 max-w-[300px]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}