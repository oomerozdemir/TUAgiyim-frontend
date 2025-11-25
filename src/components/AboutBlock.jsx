import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutBlock({
  image = "/images/yeniSezon.png", // Görsel yolunuz
}) {
  return (
    <section className="w-full bg-cream py-20 md:py-32 overflow-hidden relative">
      {/* Arka Plan Dekoru (Sağ tarafta hafif bir desen) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-beige/5 -skew-x-12 translate-x-1/3 z-0 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* SOL: Görsel Kompozisyonu */}
          <div className="relative group order-2 md:order-1">
            {/* Ana Görsel */}
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl relative z-10">
              <img
                src={image}
                alt="TUA Hakkımızda"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              {/* Görsel Üzeri Hafif Karartma (Hover'da kalkar) */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Dekoratif Alt Çerçeve (Gold) */}
            <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-gold/40 -z-0 rounded-sm transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
          </div>

          {/* SAĞ: İçerik */}
          <div className="flex flex-col justify-center text-left space-y-8 order-1 md:order-2">
            
            <div>
              <span className="text-gold text-xs font-bold tracking-[0.25em] uppercase mb-4 block animate-in fade-in slide-in-from-left-4 duration-700">
                Marka Hikayesi
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-[1.1]">
                Geleneksel Zanaat, <br />
                <span className="font-serif italic text-black/80">Modern Ruh.</span>
              </h2>
            </div>

            <div className="space-y-6 text-black/70 font-light leading-relaxed text-lg">
              <p>
                TUA olarak, modanın sadece bedeni örtmek değil, ruhu yansıtmak olduğuna inanıyoruz. Her dikişte, her kumaş seçiminde kültürel mirasımızın izlerini sürüyor, onları modern kadının güçlü duruşuyla harmanlıyoruz.
              </p>
              <p>
                "Products for the Soul" mottomuzla, geçici trendlerin ötesine geçiyor; dolabınızda değil, hayatınızda yer edecek, size kendinizi özel hissettiren zamansız parçalar tasarlıyoruz.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/hakkimizda"
                className="group inline-flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-black transition-colors hover:text-gold"
              >
                Hikayemizi Keşfedin
                <span className="flex items-center justify-center w-12 h-12 rounded-full border border-black/10 group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <ArrowRight size={18} strokeWidth={1.5} />
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}