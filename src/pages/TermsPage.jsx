import { ScrollText, Shield, Users, Lock, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <>
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Yasal Bilgilendirme
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-black mb-6 font-serif">
          Kullanım Koşulları
        </h1>
        <p className="text-black/50 max-w-2xl mx-auto font-light leading-relaxed">
          TUA Giyim web sitesini ziyaret ederek veya alışveriş yaparak, aşağıda belirtilen hizmet şartlarını kabul etmiş sayılırsınız. Lütfen bu koşulları dikkatlice okuyunuz.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* --- İÇERİK KUTUSU --- */}
        <div className="bg-white border border-beige/40 rounded-2xl p-8 md:p-16 shadow-sm space-y-12">
          
          {/* 1. GENEL HÜKÜMLER */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                <Scale size={20} />
              </div>
              <h2 className="text-xl font-serif text-black">1. Genel Hükümler</h2>
            </div>
            <div className="pl-14 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Bu internet sitesi ("Site"), TUA Giyim ("Şirket") tarafından işletilmektedir. Siteye erişim sağlayan veya alışveriş yapan her kullanıcı ("Kullanıcı"), bu sözleşmedeki şartları peşinen kabul etmiş sayılır.
              </p>
              <p>
                Şirket, dilediği zaman bu koşullarda değişiklik yapma hakkını saklı tutar. Güncellenen koşullar, sitede yayınlandığı andan itibaren yürürlüğe girer.
              </p>
            </div>
          </section>

          {/* 2. HİZMET KAPSAMI */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                <ScrollText size={20} />
              </div>
              <h2 className="text-xl font-serif text-black">2. Hizmet Kapsamı</h2>
            </div>
            <div className="pl-14 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                TUA Giyim, kullanıcılara internet üzerinden kadın giyim ve aksesuar ürünlerini inceleme ve satın alma imkanı sunar. Şirket, ürünlerin fiyatlarını, görsellerini ve stok durumlarını haber vermeksizin değiştirme hakkına sahiptir.
              </p>
              <p>
                Sitede yer alan görsellerin renkleri, Kullanıcı'nın ekran ayarlarına bağlı olarak farklılık gösterebilir. TUA, ürün görsellerinin gerçeği en iyi şekilde yansıtması için azami gayreti gösterir.
              </p>
            </div>
          </section>

          {/* 3. ÜYELİK VE GÜVENLİK */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-serif text-black">3. Üyelik ve Hesap Güvenliği</h2>
            </div>
            <div className="pl-14 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Kullanıcı, siteye üye olurken verdiği bilgilerin doğru ve güncel olduğunu taahhüt eder. Üyelik hesabının güvenliğinden (şifre vb.) Kullanıcı sorumludur. Hesabınız üzerinden yapılan işlemlerin sorumluluğu size aittir.
              </p>
            </div>
          </section>

          {/* 4. FİKRİ MÜLKİYET */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                <Shield size={20} />
              </div>
              <h2 className="text-xl font-serif text-black">4. Fikri Mülkiyet Hakları</h2>
            </div>
            <div className="pl-14 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Sitede yer alan tüm tasarımlar, logolar, görseller, metinler TUA Giyim'e aittir ve telif hakları kanunlarınca korunmaktadır. İzinsiz kullanımı, kopyalanması veya dağıtılması yasaktır.
              </p>
            </div>
          </section>

          {/* 5. GİZLİLİK */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-serif text-black">5. Gizlilik ve Kişisel Veriler</h2>
            </div>
            <div className="pl-14 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                TUA Giyim, kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında korur. Bilgileriniz sadece sipariş işleme, teslimat ve size daha iyi hizmet sunmak amacıyla kullanılır, üçüncü şahıslarla (kargo firmaları hariç) paylaşılmaz.
              </p>
            </div>
          </section>

        </div>

        {/* --- ALT BİLGİ --- */}
        <div className="mt-12 text-center">
          <p className="text-black/40 text-sm mb-4">
            Son Güncelleme Tarihi: {new Date().toLocaleDateString("tr-TR")}
          </p>
          <Link 
            to="/iletisim" 
            className="text-gold font-medium hover:underline hover:text-black transition-colors"
          >
            Sorularınız için bizimle iletişime geçin
          </Link>
        </div>

      </div>
    </div>
    <Footer />
        </>
  );
}