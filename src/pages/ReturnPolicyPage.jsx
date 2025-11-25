import { RefreshCw, ShieldCheck, Truck, CreditCard, AlertCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function ReturnPolicyPage() {
  return (
    <>
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Müşteri Hizmetleri
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-black mb-6 font-serif">
          İade ve Değişim Politikası
        </h1>
        <p className="text-black/50 max-w-2xl mx-auto font-light leading-relaxed">
          TUA olarak, satın aldığınız her parçanın ruhunuza dokunmasını ve sizi mutlu etmesini arzuluyoruz. Eğer seçiminizden tam olarak emin değilseniz, size yardımcı olmak için buradayız.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 grid gap-12">

        {/* --- 1. TEMEL POLİTİKA (Kartlar) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kart 1 */}
          <div className="bg-white p-8 rounded-xl border border-beige/40 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group">
            <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-black mb-3">14 Gün İade Hakkı</h3>
            <p className="text-sm text-black/60 font-light">
              Siparişinizi teslim aldığınız tarihten itibaren 14 gün içinde, herhangi bir gerekçe göstermeksizin iade edebilirsiniz.
            </p>
          </div>

          {/* Kart 2 */}
          <div className="bg-white p-8 rounded-xl border border-beige/40 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group">
            <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <Truck size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-black mb-3">Ücretsiz Kargo</h3>
            <p className="text-sm text-black/60 font-light">
              Anlaşmalı kargo firmamız ile yapacağınız tüm iade gönderimlerinde kargo ücreti tarafımızca karşılanır.
            </p>
          </div>

          {/* Kart 3 */}
          <div className="bg-white p-8 rounded-xl border border-beige/40 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group">
            <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-black mb-3">Kolay İade</h3>
            <p className="text-sm text-black/60 font-light">
              İade talebinizi panel üzerinden tek tıkla oluşturabilir, sürecinizi anlık olarak takip edebilirsiniz.
            </p>
          </div>
        </div>

        {/* --- 2. DETAYLI METİN BÖLÜMLERİ --- */}
        <div className="bg-white/60 border border-beige/30 rounded-2xl p-8 md:p-12 space-y-10">
          
          {/* İade Koşulları */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-gold" size={20} />
              <h2 className="text-xl font-serif text-black">İade Koşulları</h2>
            </div>
            <div className="space-y-3 text-black/70 font-light leading-relaxed text-sm md:text-base pl-8 border-l-2 border-beige/30">
              <p>İade etmek istediğiniz ürünlerin aşağıdaki şartları taşıması gerekmektedir:</p>
              <ul className="list-disc list-outside ml-4 space-y-1 marker:text-gold">
                <li>Ürün kullanılmamış, yıkanmamış ve tadilat görmemiş olmalıdır.</li>
                <li>Orijinal etiketi ve varsa aksesuarları üzerinde olmalıdır.</li>
                <li>Orijinal ambalajı/kutusu bozulmamış şekilde gönderilmelidir.</li>
                <li>Kozmetik, iç giyim ve küpe gibi hijyenik ürünlerde, ambalajı açılmadığı sürece iade kabul edilmektedir.</li>
              </ul>
            </div>
          </section>

          {/* İade Süreci */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="text-gold" size={20} />
              <h2 className="text-xl font-serif text-black">İade Süreci Nasıl İşler?</h2>
            </div>
            <div className="space-y-4 text-black/70 font-light leading-relaxed text-sm md:text-base pl-8 border-l-2 border-beige/30">
              <div>
                <strong className="text-black block mb-1">1. Talep Oluşturun</strong>
                <Link to="/hesabim" className="text-gold hover:underline">Hesabım &gt; Siparişlerim</Link> sayfasından ilgili siparişi seçerek "İade Talebi Oluştur" butonuna tıklayın ve iade nedeninizi belirtin.
              </div>
              <div>
                <strong className="text-black block mb-1">2. Paketinizi Hazırlayın</strong>
                Ürünü faturasıyla birlikte orijinal paketine yerleştirin. Size verilen <strong>İade Kodu</strong>'nu paketin üzerine yazın veya kargo şubesine iletin.
              </div>
              <div>
                <strong className="text-black block mb-1">3. Kargoya Verin</strong>
                Paketinizi anlaşmalı olduğumuz <strong>Yurtiçi Kargo</strong> şubesine ücretsiz olarak teslim edin. Kargo Kodu: <strong>123456789</strong>
              </div>
            </div>
          </section>

          {/* Geri Ödeme */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="text-gold" size={20} />
              <h2 className="text-xl font-serif text-black">Geri Ödeme Süreci</h2>
            </div>
            <p className="text-black/70 font-light leading-relaxed text-sm md:text-base pl-8 border-l-2 border-beige/30">
              İade ettiğiniz ürün depomuza ulaştıktan sonra kalite kontrol ekibimiz tarafından incelenir (1-3 iş günü). İadeniz onaylandığında, ödemeniz sipariş verirken kullandığınız karta/yönteme otomatik olarak iade edilir. Bankanızın süreçlerine bağlı olarak iadenin hesabınıza yansıması 3-7 iş günü sürebilir.
            </p>
          </section>

          {/* Değişim */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="text-gold" size={20} />
              <h2 className="text-xl font-serif text-black">Değişim Politikası</h2>
            </div>
            <p className="text-black/70 font-light leading-relaxed text-sm md:text-base pl-8 border-l-2 border-beige/30">
              Online mağazamızda şu an için doğrudan ürün değişimi yapılmamaktadır. Değişim yapmak istediğiniz ürünü iade edebilir ve dilediğiniz beden/renk için yeni bir sipariş oluşturabilirsiniz. Bu yöntem, istediğiniz ürünün stokları tükenmeden size ulaşmasını sağlayan en hızlı yoldur.
            </p>
          </section>

        </div>

        {/* --- DESTEK KUTUSU --- */}
        <div className="bg-black text-white p-8 rounded-xl text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl font-serif mb-2 flex items-center gap-2">
              <HelpCircle className="text-gold" /> Yardım mı lazım?
            </h3>
            <p className="text-white/70 text-sm font-light">
              Aklınıza takılan başka bir soru varsa destek ekibimizle iletişime geçebilirsiniz.
            </p>
          </div>
          <Link 
            to="/iletisim" 
            className="whitespace-nowrap bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gold hover:text-white transition-colors duration-300"
          >
            Bize Ulaşın
          </Link>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
}