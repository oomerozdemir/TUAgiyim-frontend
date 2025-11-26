import { Lock, Eye, FileText, ShieldCheck, Cookie, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <>
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Yasal Bilgilendirme
        </span>
        <h1 className="text-3xl md:text-5xl font-light text-black mb-6 font-serif leading-tight">
          Gizlilik Politikası ve <br /> KVKK Aydınlatma Metni
        </h1>
        <p className="text-black/50 max-w-2xl mx-auto font-light leading-relaxed">
          TUA Giyim olarak kişisel verilerinizin güvenliği bizim için en az tasarımlarımız kadar değerlidir. Verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında sizi şeffaflıkla bilgilendirmek isteriz.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* --- İÇERİK KUTUSU --- */}
        <div className="bg-white border border-beige/40 rounded-2xl p-8 md:p-16 shadow-sm space-y-14">
          
          {/* 1. VERİ SORUMLUSU */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">1. Veri Sorumlusu</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>TUA Giyim Tekstil San. ve Tic. A.Ş.</strong> ("Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.
              </p>
            </div>
          </section>

          {/* 2. TOPLANAN VERİLER */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <FileText size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">2. Hangi Verilerinizi Topluyoruz?</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>Sitemizi kullanımınız ve alışverişleriniz sırasında aşağıdaki verileriniz toplanabilir:</p>
              <ul className="list-disc list-outside ml-4 space-y-1 marker:text-gold">
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura gereği).</li>
                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri.</li>
                <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş geçmişi, talep ve şikayet bilgileri.</li>
                <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, internet sitesi giriş-çıkış bilgileri.</li>
              </ul>
            </div>
          </section>

          {/* 3. İŞLEME AMACI */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Eye size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">3. Verilerinizi Hangi Amaçla İşliyoruz?</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Toplanan kişisel verileriniz; siparişlerinizin alınması ve teslim edilmesi, ödeme işlemlerinin gerçekleştirilmesi, size özel kampanya ve önerilerin sunulması, müşteri memnuniyetinin artırılması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.
              </p>
            </div>
          </section>

          {/* 4. VERİ GÜVENLİĞİ */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Lock size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">4. Veri Güvenliği</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                TUA Giyim, kişisel verilerinizi korumak için gerekli teknik ve idari tedbirleri almaktadır. Sitemiz üzerinden gerçekleştirdiğiniz tüm ödeme işlemleri <strong>256-bit SSL sertifikası</strong> ile şifrelenerek bankanıza iletilir. Kredi kartı bilgileriniz sistemlerimizde kesinlikle saklanmaz.
              </p>
            </div>
          </section>

          {/* 5. ÇEREZ (COOKIE) POLİTİKASI */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Cookie size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">5. Çerez Politikası</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Sitemizi ziyaretiniz sırasında deneyiminizi iyileştirmek, site trafiğini analiz etmek ve size uygun reklamlar sunmak amacıyla çerezler (cookies) kullanmaktayız. Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.
              </p>
            </div>
          </section>

          {/* 6. HAKLARINIZ */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <UserCheck size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">6. Haklarınız</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>KVKK'nın 11. maddesi uyarınca, verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını öğrenme, eksik veya yanlış işlenen verilerin düzeltilmesini isteme ve silinmesini talep etme haklarına sahipsiniz.</p>
              <p>
                Taleplerinizi <a href="mailto:iletisim@tuagiyim.com" className="text-gold hover:underline font-medium">iletisim@tuagiyim.com</a> adresine e-posta göndererek bize iletebilirsiniz.
              </p>
            </div>
          </section>

        </div>

        {/* --- ALT BİLGİ --- */}
        <div className="mt-12 text-center">
          <p className="text-black/40 text-sm mb-4">
            Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}
          </p>
          <Link 
            to="/iletisim" 
            className="text-gold font-medium hover:underline hover:text-black transition-colors"
          >
            Veri gizliliği hakkında sorularınız mı var?
          </Link>
        </div>

      </div>
    </div>
    <Footer />
  </>
  );
}