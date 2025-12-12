import { RefreshCw, ShieldCheck, Truck, CreditCard, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReturnPolicyPage() {
  return (
    <>
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Koşulsuz Müşteri Mutluluğu
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-black mb-6 font-serif">
          İade ve Değişim Politikası
        </h1>
        <p className="text-black/50 max-w-2xl mx-auto font-light leading-relaxed">
          TUA Giyim olarak önceliğimiz mutluluğunuz. Satın aldığınız ürünleri, fatura tarihinden itibaren 30 gün içerisinde, hiçbir gerekçe göstermeksizin iade edebilirsiniz.
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
            <h3 className="text-lg font-serif text-black mb-3">30 Gün İade Hakkı</h3>
            <p className="text-sm text-black/60 font-light">
              Fatura tarihinden itibaren 30 gün boyunca ürünlerinizi koşulsuz olarak iade edebilirsiniz.
            </p>
          </div>

          {/* Kart 2 */}
          <div className="bg-white p-8 rounded-xl border border-beige/40 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group">
            <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <Truck size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-black mb-3">Ücretsiz Gönderim</h3>
            <p className="text-sm text-black/60 font-light">
              Anlaşmalı kargo firmamız Yurtiçi Kargo ile yapacağınız tüm iade gönderimleri ücretsizdir.
            </p>
          </div>

          {/* Kart 3 */}
          <div className="bg-white p-8 rounded-xl border border-beige/40 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group">
            <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-black mb-3">Güvenli İade</h3>
            <p className="text-sm text-black/60 font-light">
              İade sürecinizi hesabım panelinden adım adım takip edebilir, hızlı geri ödeme alırsınız.
            </p>
          </div>
        </div>

        {/* --- 2. DETAYLI METİN BÖLÜMLERİ --- */}
        <div className="bg-white/60 border border-beige/30 rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* İade Şartları */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-gold" size={22} />
              <h2 className="text-xl font-serif text-black">İade Kabul Şartları</h2>
            </div>
            <div className="space-y-3 text-black/70 font-light leading-relaxed text-sm md:text-base pl-9 border-l-2 border-beige/30">
              <p>Müşteri memnuniyeti kapsamında iadelerinizin onaylanabilmesi için aşağıdaki hususlara dikkat etmenizi rica ederiz:</p>
              <ul className="list-disc list-outside ml-4 space-y-2 marker:text-gold">
                <li>Ürünlerin <strong>kullanılmamış</strong>, tadilat görmemiş ve kirlenmemiş olması gerekmektedir.</li>
                <li>Varsa ürün üzerindeki <strong>koruma bantları, etiketler ve logolar</strong> çıkarılmamış olmalıdır.</li>
                <li>Orijinal kutusu/ambalajı, faturası ve tüm <strong>standart aksesuarları</strong> ile birlikte gönderilmelidir.</li>
                <li>Kampanya dahilinde hediye verilen promosyonlu ürünler de ana ürünle birlikte iade edilmelidir.</li>
                <li>Hijyen kuralları gereği; bikini, mayo gibi ürünlerin koruma bandı açılmamış olmalıdır. Kozmetik ve kişisel bakım ürünlerinde ambalajı açılan ürünler iade alınmamaktadır.</li>
              </ul>
            </div>
          </section>

          {/* Adım Adım İade */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="text-gold" size={22} />
              <h2 className="text-xl font-serif text-black">Adım Adım Kolay İade</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 pl-9">
              <div className="bg-white p-4 rounded-lg border border-beige/20">
                <span className="text-gold font-bold text-lg block mb-1">01.</span>
                <strong className="text-black block mb-1">Talep Oluşturun</strong>
                <p className="text-sm text-black/60"><Link to="/hesabim?tab=orders" className="text-black underline">Siparişlerim</Link> sayfasına gidin, ilgili siparişi seçip "İade Talebi" butonuna tıklayın.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-beige/20">
                <span className="text-gold font-bold text-lg block mb-1">02.</span>
                <strong className="text-black block mb-1">Paketleyin</strong>
                <p className="text-sm text-black/60">Ürünü faturasıyla birlikte (iade bölümünü doldurarak) orijinal paketine yerleştirin.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-beige/20">
                <span className="text-gold font-bold text-lg block mb-1">03.</span>
                <strong className="text-black block mb-1">Kargolayın</strong>
                <p className="text-sm text-black/60">Size verilen kod ile herhangi bir <strong>Yurtiçi Kargo</strong> şubesine paketi ücretsiz teslim edin.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-beige/20">
                <span className="text-gold font-bold text-lg block mb-1">04.</span>
                <strong className="text-black block mb-1">Tamamlandı</strong>
                <p className="text-sm text-black/60">Ürün depomuza ulaştıktan sonra incelenir ve 3 iş günü içinde iadeniz onaylanır.</p>
              </div>
            </div>
          </section>

          {/* Geri Ödeme */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="text-gold" size={22} />
              <h2 className="text-xl font-serif text-black">Geri Ödeme Süreci</h2>
            </div>
            <div className="pl-9 text-black/70 font-light leading-relaxed text-sm md:text-base border-l-2 border-beige/30 space-y-3">
              <p>
                İade ettiğiniz ürünler Kalite Güvence departmanımız tarafından incelenir. İade şartlarına uygunluğu onaylandığında, ücret iadesi işlemi <strong>3 iş günü</strong> içerisinde başlatılır.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-orange-900 text-sm">
                <strong className="block mb-1 font-bold">Önemli Bilgilendirme:</strong>
                Kredi kartına yapılan iadelerin hesabınıza yansıması banka süreçlerine bağlı olarak 1-7 gün sürebilir. Taksitli yapılan alışverişlerin iadesi, bankanız tarafından kartınıza <strong>taksitli olarak</strong> (artı/eksi bakiye şeklinde) yansıtılmaktadır.
              </div>
            </div>
          </section>

          {/* Değişim */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-gold" size={22} />
              <h2 className="text-xl font-serif text-black">Değişim Politikası</h2>
            </div>
            <p className="pl-9 text-black/70 font-light leading-relaxed text-sm md:text-base border-l-2 border-beige/30">
              Online mağazamızda teknik alt yapı gereği doğrudan ürün değişimi yapılmamaktadır. Beden veya renk değişimi yapmak istediğiniz ürünü iade edip, dilediğiniz yeni ürünü sipariş verebilirsiniz. Bu yöntem, istediğiniz ürünün stoğu tükenmeden size ulaşmasını sağlayan en hızlı ve güvenli yoldur.
            </p>
          </section>

        </div>

        {/* --- DESTEK KUTUSU --- */}
        <div className="bg-black text-white p-8 rounded-xl text-center flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <h3 className="text-xl font-serif mb-2 flex items-center gap-2">
              <HelpCircle className="text-gold" /> Aklınıza takılan bir şey mi var?
            </h3>
            <p className="text-white/70 text-sm font-light">
              Müşteri hizmetlerimiz hafta içi 09:00 - 18:00 saatleri arasında size yardımcı olmaktan mutluluk duyar.
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
    </>
  );
}