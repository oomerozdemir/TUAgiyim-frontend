import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-cream pt-0 -mt-px border-t border-beige/40">
      
      {/* Link Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">
        
        {/* SÜTUN 1: MÜŞTERİ HİZMETLERİ */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-xs font-bold tracking-[0.2em] text-black/40 mb-6 uppercase">
            Müşteri Hizmetleri
          </h4>
          <ul className="space-y-3 text-black/70 font-medium">
            <li>
              <Link to="/urunler" className="hover:text-gold transition-colors duration-300">
                Koleksiyonu Keşfet
              </Link>
            </li>
            <li>
              <Link to="/sss" className="hover:text-gold transition-colors duration-300">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link to="/iletisim" className="hover:text-gold transition-colors duration-300">
                İletişim & Destek
              </Link>
            </li>
            <li>
              <Link to="/hesabim" className="hover:text-gold transition-colors duration-300">
                Sipariş Takibi
              </Link>
            </li>
          </ul>
        </div>

        {/* SÜTUN 2: KURUMSAL */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-xs font-bold tracking-[0.2em] text-black/40 mb-6 uppercase">
            TUA Giyim
          </h4>
          <ul className="space-y-3 text-black/70 font-medium">
            <li>
              <Link to="/hakkimizda" className="hover:text-gold transition-colors duration-300">
                Hikayemiz
              </Link>
            </li>
            <li>
              <Link to="/hakkimizda" className="hover:text-gold transition-colors duration-300">
                Değerlerimiz
              </Link>
            </li>
            <li>
              <span className="text-black/40 cursor-not-allowed">Kariyer (Yakında)</span>
            </li>
          </ul>
        </div>

        {/* SÜTUN 3: YASAL & GÜVENLİK */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-xs font-bold tracking-[0.2em] text-black/40 mb-6 uppercase">
            Yasal Bilgiler
          </h4>
          <ul className="space-y-3 text-black/70 font-medium">
            <li>
              <Link to="/iade-degisim" className="hover:text-gold transition-colors duration-300">
                İade ve Değişim Politikası
              </Link>
            </li>
              <li>
              <Link to="/kullanim-kosullari" className="hover:text-gold transition-colors duration-300">
                Kullanım Koşulları
              </Link>
            </li>
            <li>
              <Link to="/gizlilik-politikasi" className="hover:text-gold transition-colors duration-300">
                Gizlilik ve KVKK Politikası
              </Link>
            </li>
            <li>
              <Link to="/mesafeli-satis-sozlesmesi" className="hover:text-gold transition-colors duration-300">
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Alt Bar */}
      <div className="max-w-[1400px] mx-auto px-6 pb-10 pt-8 border-t border-beige/30 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-black/40 font-medium">
          © {new Date().getFullYear()} TUA Giyim. Tüm hakları saklıdır.
        </p>

        <div className="flex items-center gap-6">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Instagram" 
            className="text-black/60 hover:text-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Facebook" 
            className="text-black/60 hover:text-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Facebook size={20} strokeWidth={1.5} />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Twitter" 
            className="text-black/60 hover:text-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Twitter size={20} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}