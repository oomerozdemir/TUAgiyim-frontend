import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles, ChevronDown, Star, Zap, Tag, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "./Seo";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);

    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Star, text: "%100 El İşçiliği", color: "from-[#C5B398] to-[#A39075]" },
    { icon: Sparkles, text: "Özel Tasarım", color: "from-[#D6C4A8] to-[#B8A488]" },
    { icon: Zap, text: "Hızlı Kargo", color: "from-[#C5B398] to-[#968369]" },
  ];

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <SEO 
        title="Modern Kadın Giyim & İndirimli Ürünler" 
        description="TUA Giyim ile stilinizi keşfedin. Büyük sezon indirimi ve özel tasarım elbiseler."
      />
      <section 
        ref={sectionRef}
        className="relative w-full min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#F5F2EB] to-[#EBE5D9] overflow-hidden flex flex-col lg:flex-row items-center justify-center pt-28 pb-10 lg:py-0"
      >
        
        {/* ===== ARKA PLAN EFEKTLERİ ===== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-[#D6C4A8] to-[#A39075] rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vh] h-[90vh] opacity-[0.03] pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(-50%, -50%) translate(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px) rotate(${(mousePos.x - 0.5) * 5}deg)`
          }}
        >
          <div className="w-full h-full bg-[#5C5346] rounded-full blur-3xl" />
        </div>
        
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#4a4a4a 1px, transparent 1px), linear-gradient(90deg, #4a4a4a 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="max-w-[1600px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* ===== SOL: METİN ALANI ===== */}
          <div className={`lg:col-span-5 flex flex-col justify-center text-center lg:text-left space-y-6 transition-all duration-1000 transform ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            
            {/* Üst Badge (Dönen Özellikler) */}
            <div className="flex items-center justify-center lg:justify-start gap-3 group">
              <span className="w-8 lg:w-12 h-[1px] bg-[#A39075] transition-all duration-500"></span>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#D6C4A8]/30">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 transition-all duration-500 ${
                        activeFeature === idx 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-50 absolute'
                      }`}
                    >
                      <Icon className={`w-4 h-4 text-[#A39075]`} />
                      <span className="text-xs font-bold tracking-wider text-[#7D705A] uppercase whitespace-nowrap">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ana Başlık */}
            <h1 className="space-y-1 md:space-y-2">
              <span className="block text-[#b91c1c] text-sm md:text-base font-bold tracking-[0.3em] uppercase animate-pulse mb-2">
                Sınırlı Süre Fırsatı
              </span>
              {['Stilinde', 'Fark', 'YARAT.'].map((word, idx) => (
                <span
                  key={word}
                  className={`block transition-all duration-700 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                  style={{
                    transitionDelay: `${idx * 150}ms`,
                    ...(word === 'Stilinde' && { 
                      fontSize: 'clamp(2.5rem, 9vw, 5rem)',
                      fontFamily: 'serif',
                      fontWeight: 300,
                      color: '#2D2D2D'
                    }),
                    ...(word === 'Fark' && {
                      fontSize: 'clamp(2.5rem, 9vw, 5rem)',
                      fontFamily: 'serif',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      paddingLeft: '1rem',
                      color: '#4A4A4A'
                    }),
                    ...(word === 'YARAT.' && {
                      fontSize: 'clamp(3rem, 11vw, 6rem)',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #A39075 0%, #D6C4A8 50%, #8C7B62 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      filter: 'drop-shadow(0 2px 4px rgba(163, 144, 117, 0.2))'
                    })
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className={`text-[#666] text-base md:text-lg font-light max-w-md mx-auto lg:mx-0 leading-relaxed transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Şimdi alışveriş yapın, seçili ürünlerdeki büyük indirim fırsatlarını kaçırmayın.
            </p>

            {/* BUTONLAR */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-6">
              
              {/* 1. KAMPANYA BUTONU (DİKKAT ÇEKİCİ) */}
              <button
                className="relative group px-8 py-4 bg-[#b91c1c] text-white rounded-full overflow-hidden shadow-xl hover:shadow-red-900/30 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                onClick={() => navigate("/kategori/kampanyalı-urunler")} // İsterseniz burayı /kategori/indirim yapabilirsiniz
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2 font-bold tracking-wider text-sm">
                  <Tag size={18} className="animate-bounce" />
                  KAMPANYAYI KEŞFET
                </span>
              </button>

              {/* 2. Koleksiyon Butonu (Daha Sade) */}
              <button
                className="group px-8 py-4 border border-[#8C7B62] text-[#5C5346] rounded-full hover:bg-[#8C7B62] hover:text-white transition-all duration-300 font-medium text-sm tracking-wider w-full sm:w-auto"
                onClick={() => navigate("/kategori/yeni-sezon")}
              >
                Yeni Sezonu İncele
              </button>
            </div>

            {/* Social Proof */}
            <div className={`flex items-center gap-6 justify-center lg:justify-start pt-4 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-[#EBE5D9] border-2 border-white shadow-md flex items-center justify-center text-[#8C7B62] text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold text-[#2D2D2D]">2,500+ Mutlu Müşteri</div>
                <div className="text-[#888] text-xs">5 üzerinden 4.9 ⭐</div>
              </div>
            </div>
          </div>

          {/* ===== SAĞ: GÖRSEL ALANI ===== */}
          <div className={`lg:col-span-7 relative h-[400px] md:h-[700px] flex items-center justify-center lg:justify-end transition-all duration-1000 delay-300 transform ${loaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
            
            <div className="relative w-[85%] md:w-[75%] h-[95%] group">
              
              {/* Dekoratif Çerçeve */}
              <div className="absolute top-8 right-8 w-full h-full border border-[#D6C4A8] rounded-t-[8rem] md:rounded-t-[12rem] rounded-b-3xl -z-10 transition-all duration-700 group-hover:top-6 group-hover:right-6 group-hover:border-[#C5B398]" />
              
              {/* Ana Resim Container */}
              <div className="relative w-full h-full rounded-t-[8rem] md:rounded-t-[12rem] rounded-b-3xl overflow-hidden shadow-2xl shadow-black/10 transition-all duration-700 group-hover:shadow-[#A39075]/20">
                <img 
                  src="/images/kampanyaHero.png"
                  alt="TUA Yeni Sezon İndirim" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* İNDİRİM ROZETİ (GÖRSEL ÜZERİ) */}
                <div className="absolute top-10 right-4 md:right-10 bg-white/90 backdrop-blur-md w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#b91c1c]/10 animate-[bounce_3s_infinite]">
                    <span className="text-[#b91c1c] font-black text-3xl md:text-1xl leading-none">%50'den başlayan</span>
                    <span className="text-[#2D2D2D] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">İndirimler</span>
                </div>

                {/* Alt Bilgi Kartı */}
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-lg border border-white/60 transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center gap-2 text-[#8C7B62] mb-1">
                    <Sparkles className="animate-pulse" size={16} />
                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">"Kampanyalı Ürünler"</span>
                  </div>
                  <p className="text-[#2D2D2D] font-serif text-sm md:text-lg"></p>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-[#D6C4A8] stroke-[#D6C4A8]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sol Alt Etiket */}
              <div className="hidden md:flex absolute -bottom-8 -left-8 bg-[#1a1a1a] text-[#EBE5D9] text-xs font-bold py-4 px-8 rounded-full rotate-[-5deg] shadow-xl z-20 transition-all duration-500 hover:rotate-0 hover:scale-110 cursor-pointer border border-[#ffffff]/10">
                <div className="flex items-center gap-2">
                  Güvenli Ödeme Altyapısı
                </div>
              </div>

              {/* Dekoratif Noktalar */}
              <div className="absolute -top-4 -right-4 grid grid-cols-3 gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A39075]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aşağı Kaydır Oku */}
        <div
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#999] animate-bounce cursor-pointer group"
          onClick={handleScrollDown}
        >
          <span className="text-xs font-medium tracking-wider uppercase group-hover:text-[#8C7B62] transition-colors">
            Keşfet
          </span>
          <ChevronDown className="group-hover:text-[#8C7B62] transition-colors" size={24} />
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-float {
            animation: float linear infinite;
          }
          .animate-shimmer {
            animation: shimmer 3s linear infinite;
          }
        `}</style>
      </section>
    </>
  );
}