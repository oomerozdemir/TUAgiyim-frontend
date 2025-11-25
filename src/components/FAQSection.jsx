import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const faqs = [
    {
      q: "Nasıl sipariş verebilirim?",
      a: "Beğendiğiniz ürünü sepete ekleyin, teslimat adresinizi ve ödeme yöntemini seçin. Siparişiniz onaylandıktan sonra ürün güvenli şekilde size ulaştırılır.",
    },
    {
      q: "Kargo ücreti ne kadar?",
      a: "Belirli bir tutarın üzerindeki alışverişlerde kargo ücretsizdir. Diğer siparişlerde ücret, teslimat adresine göre otomatik hesaplanır.",
    },
    {
      q: "Teslimat süresi ne kadar?",
      a: "Siparişleriniz 1-3 iş günü içerisinde kargoya verilir. Teslimat süresi bulunduğunuz şehre göre değişiklik gösterebilir.",
    },
    {
      q: "İade veya değişim yapabilir miyim?",
      a: "Evet, ürün elinize ulaştıktan sonra 14 gün içinde iade veya değişim talebinde bulunabilirsiniz.",
    },
  ];

  return (
    <section className="w-full bg-cream flex justify-center py-20 border-t border-beige/30">
      <div className="w-full max-w-4xl px-6 md:px-10">
        
        {/* Başlık */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">Destek</span>
          <h2 className="text-3xl md:text-4xl font-light text-black font-serif">Sıkça Sorulan Sorular</h2>
        </div>

        {/* Sorular Listesi */}
        <div className="divide-y divide-beige/50 border-y border-beige/50">
          {faqs.map((item, i) => (
            <div key={i} className="group">
              <button 
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none" 
                onClick={() => toggle(i)}
              >
                <h3 className={`text-lg font-medium transition-colors duration-300 ${openIndex === i ? "text-gold font-serif" : "text-black group-hover:text-black/70"}`}>
                  {item.q}
                </h3>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-gold" : "text-black/40"}`}>
                  <ChevronDown size={20} />
                </span>
              </button>
              
              <div 
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-black/60 leading-relaxed font-light">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tümünü Gör Linki */}
        <div className="mt-10 text-center">
          <Link 
            to="/sss" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-all duration-300 uppercase"
          >
            Tüm Soruları Gör
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}