import { Heart, PenTool, Award, Leaf } from "lucide-react";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <> 
    <div className="bg-cream min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[50vh] w-full overflow-hidden flex items-center justify-center">
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Karartma */}
        <img 
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" 
          alt="TUA Kadın Giyim" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Başlık */}
        <div className="relative z-20 text-center px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white drop-shadow-md">
            HİKAYEMİZ
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mt-6" />
          <p className="mt-4 text-white/90 text-lg font-light tracking-wider">
            HER BEDENDE IŞILTI
          </p>
        </div>
      </div>

      {/* --- BİZ KİMİZ? (Split Layout) --- */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Metin Alanı */}
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-4xl font-serif text-black leading-tight">
              Modern Çizgiler, <br />
              <span className="text-gold italic">Kültürel Dokunuşlar.</span>
            </h2>
            <div className="space-y-4 text-black/70 font-light leading-relaxed text-lg">
              <p>
                TUA olarak, modanın sadece giyinmek değil, kendini ifade etmenin en zarif yolu olduğuna inanıyoruz. Yolculuğumuz, modern kadının gücünü ve zarafetini yansıtan, zamansız parçalar tasarlama tutkusuyla başladı.
              </p>
              <p>
                "Her Bedende Işıltı" mottomuzla, sadece bedeninizi saran kumaşlar değil, ruhunuza iyi gelen, içinde kendinizi özel hissettiğiniz tasarımlar sunuyoruz. Her dikişte, her kumaş seçiminde kültürel mirasımızdan ilham alarak, geçmişin zanaatını bugünün estetiğiyle harmanlıyoruz.
              </p>
              <p>
                TUA kadını; kendine güvenen, detaylardaki kaliteyi fark eden ve stilini ruhuyla bütünleştiren kadındır.
              </p>
            </div>
            
            {/* İmza vb. eklenebilir */}
            <div className="pt-4">
              <span className="font-handwriting text-3xl text-black/40">Tua Giyim</span>
            </div>
          </div>

          {/* Görsel Alanı */}
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl border-[10px] border-white">
              <img 
                src="images/yeniSezon.png" 
                alt="TUA Tasarım Süreci" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            {/* Dekoratif Kare */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/50 -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-beige/30 -z-10 rounded-full" />
          </div>

        </div>
      </section>

      {/* --- DEĞERLERİMİZ (Cards) --- */}
      <section className="bg-white py-20 border-y border-beige/30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-serif text-black mb-3">Değerlerimiz</h3>
            <p className="text-black/50">Bizi biz yapan temel prensipler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Kart 1 */}
            <div className="flex flex-col items-center text-center p-8 group hover:bg-cream transition-colors duration-500 rounded-xl border border-transparent hover:border-beige/50">
              <div className="w-16 h-16 rounded-full bg-beige/20 text-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award strokeWidth={1.5} size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Kalite & Ustalık</h4>
              <p className="text-black/60 font-light">
                En kaliteli kumaşları seçiyor, usta ellerde hayat bulan detaylarla giysilerinize değer katıyoruz.
              </p>
            </div>

            {/* Kart 2 */}
            <div className="flex flex-col items-center text-center p-8 group hover:bg-cream transition-colors duration-500 rounded-xl border border-transparent hover:border-beige/50">
              <div className="w-16 h-16 rounded-full bg-beige/20 text-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart strokeWidth={1.5} size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Tutku & Ruh</h4>
              <p className="text-black/60 font-light">
                Tasarımlarımızın bir ruhu olduğuna inanıyoruz. Sizi iyi hissettirecek enerjiyi her parçaya işliyoruz.
              </p>
            </div>

            {/* Kart 3 */}
            <div className="flex flex-col items-center text-center p-8 group hover:bg-cream transition-colors duration-500 rounded-xl border border-transparent hover:border-beige/50">
              <div className="w-16 h-16 rounded-full bg-beige/20 text-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PenTool strokeWidth={1.5} size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Özgün Tasarım</h4>
              <p className="text-black/60 font-light">
                Trendleri takip eden değil, kendi stilini yaratan özgün ve zamansız koleksiyonlar hazırlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MANİFESTO / SLOGAN BÖLÜMÜ --- */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        {/* Arka plan dekoru */}
        <div className="absolute inset-0 bg-beige/10" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <Leaf className="mx-auto text-gold/60 mb-6 animate-bounce-slow" size={40} strokeWidth={1} />
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-snug">
            "Kültürel zanaata <br />
            <span className="text-gold font-italic">yeni bir soluk getiriyoruz."</span>
          </h2>
          <p className="mt-8 text-black/60 max-w-xl mx-auto font-light">
            Geçmişin zarafetini geleceğin modernliğiyle buluşturuyoruz. TUA, sizin hikayenizin en şık eşlikçisi olmak için burada.
          </p>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
}