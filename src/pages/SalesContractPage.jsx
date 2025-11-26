import { FileSignature, Users, Truck, CreditCard, Undo2, Gavel, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function SalesContractPage() {
  return (
    <>
    <div className="bg-cream min-h-screen pt-10 pb-24">
      
      {/* --- BAŞLIK ALANI --- */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
          Yasal Bilgilendirme
        </span>
        <h1 className="text-3xl md:text-5xl font-light text-black mb-6 font-serif">
          Mesafeli Satış Sözleşmesi
        </h1>
        <p className="text-black/50 max-w-2xl mx-auto font-light leading-relaxed">
          İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğince, internet üzerinden gerçekleştirdiğiniz alışverişlerdeki hak ve yükümlülükleri belirlemektedir.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* --- İÇERİK KUTUSU --- */}
        <div className="bg-white border border-beige/40 rounded-2xl p-8 md:p-16 shadow-sm space-y-12">
          
          {/* MADDE 1: TARAFLAR */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Users size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">Madde 1: Taraflar</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-4 text-sm md:text-base">
              <div>
                <strong className="text-black block mb-1">1.1. Satıcı Bilgileri:</strong>
                <p>Ünvanı: TUA Giyim </p>
                <p>Adres: Şişli / İstanbul</p>
                <p>E-posta: iletisim@tuagiyim.com</p>
              </div>
              <div>
                <strong className="text-black block mb-1">1.2. Alıcı Bilgileri:</strong>
                <p>
                  www.tuagiyim.com internet sitesine üye olan veya üye olmadan alışveriş yapan müşteri. Sözleşmede bundan böyle "ALICI" olarak anılacaktır. Alıcı'nın sipariş verirken beyan ettiği adres ve iletişim bilgileri esas alınır.
                </p>
              </div>
            </div>
          </section>

          {/* MADDE 2: KONU */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <FileSignature size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">Madde 2: Konu</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı, nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
              </p>
            </div>
          </section>

          {/* MADDE 3: ÜRÜN BİLGİLERİ VE TESLİMAT */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Truck size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">Madde 3: Ürün ve Teslimat</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                3.1. Ürünün cinsi, türü, miktarı, marka/modeli, rengi ve tüm vergiler dahil satış bedeli, siparişin sonlandığı andaki bilgilerde belirtildiği gibidir.
              </p>
              <p>
                3.2. Ürün, ALICI'nın belirttiği teslimat adresine, kargo firması aracılığıyla 30 günlük yasal süreyi aşmamak koşuluyla teslim edilir.
              </p>
            </div>
          </section>

          {/* MADDE 4: CAYMA HAKKI */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Undo2 size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">Madde 4: Cayma Hakkı</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.
              </p>
              <p>
                Cayma hakkının kullanılması için bu süre içinde SATICI'ya yazılı bildirimde bulunulması ve ürünün kullanılmamış, etiketi sökülmemiş olması şarttır.
              </p>
            </div>
          </section>

          {/* MADDE 5: UYUŞMAZLIK ÇÖZÜMÜ */}
          <section className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Gavel size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-black">Madde 5: Yetkili Mahkeme</h2>
            </div>
            <div className="pl-16 text-black/70 font-light leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                İşbu sözleşmenin uygulanmasından doğabilecek uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı'nca ilan edilen değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki durumlarda ise ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
              </p>
            </div>
          </section>

        </div>

        {/* --- ALT BİLGİ --- */}
        <div className="mt-12 text-center">
          <p className="text-black/40 text-sm mb-4">
            Siparişin onaylanması durumunda ALICI işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
          </p>
          <Link 
            to="/iletisim" 
            className="text-gold font-medium hover:underline hover:text-black transition-colors"
          >
            Detaylı bilgi için bizimle iletişime geçin
          </Link>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
}