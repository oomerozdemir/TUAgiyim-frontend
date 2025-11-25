import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Heart, ShoppingBag, Menu, X, LogOut, UserCircle, Settings, ChevronDown } from "lucide-react";
import api from "../lib/api"; // Kategorileri çekmek için API importu

const LOGO_URL = "/images/logo2.png"; 

const LINKS = [
  { to: "/kategoriler", label: "Kategoriler", id: "kategoriler" },
  { to: "/urunler",     label: "Tüm Ürünler", id: "ürünler" },
  { to: "/hakkimizda",  label: "Hakkımızda",  id: "hakkimizda" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [categories, setCategories] = useState([]); // Kategoriler için state

  const navigate = useNavigate();
  const location = useLocation();
  
  const { auth, logout } = useAuth(); 
  const user = auth?.user;
  const role = user?.role?.toLowerCase?.();

  const isHomePage = location.pathname === "/";

  // 1. Kategorileri Çek
  useEffect(() => {
    api.get("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    logout();
    setMenu(false);
    navigate("/");
  };

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  // --- STİL MANTIĞI ---
  const isTransparent = isHomePage && !scrolled && !open;

  const navBaseClasses = "top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b";
  const positionClass = isHomePage ? "fixed" : "sticky";
  const appearanceClasses = isTransparent
    ? "bg-transparent border-white/10 backdrop-blur-[2px]" 
    : "bg-cream shadow-sm border-beige/60"; 

  const textColor = isTransparent ? "text-white/90 hover:text-white" : "text-black/70 hover:text-black";
  const activeLinkClass = "font-bold !text-gold"; 

  const iconBtnClass = `transition-all duration-300 p-2 rounded-full hover:bg-white/10 ${
    isTransparent 
        ? "text-white hover:text-gold" 
        : "text-black hover:text-gold hover:bg-beige/20"
  }`;

  const userAvatarClass = `w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
    isTransparent
      ? "bg-white/20 text-white hover:bg-white hover:text-gold"
      : "bg-gold text-white hover:bg-black hover:text-white"
  }`;

  const logoStyle = isTransparent 
    ? { filter: "brightness(0) invert(1)" } 
    : { filter: "none" };

  const getLinkClass = (isActive) => 
    `text-sm font-medium tracking-wide transition-all ${isActive ? activeLinkClass : textColor}`;

  return (
    <header className={`${positionClass} ${navBaseClasses} ${appearanceClasses}`}>
      <nav className="mx-auto max-w-[1600px] px-6 h-24 flex items-center">
        
        {/* SOL BÖLÜM: Linkler & Dropdown */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-8">
          {LINKS.map((l) => {
            // Eğer link "Kategoriler" ise Dropdown mantığını uygula
            if (l.id === 'kategoriler') {
                return (
                    <div key={l.id} className="relative group h-full flex items-center">
                        <Link 
                            to={l.to} 
                            className={`flex items-center gap-1 ${getLinkClass(location.pathname.startsWith("/kategori"))}`}
                        >
                            {l.label}
                            <ChevronDown size={14} className={`transition-transform duration-300 group-hover:rotate-180 ${isTransparent ? "text-white/70" : "text-black/40"}`} />
                        </Link>

                        {/* DROPDOWN MENÜ */}
                        {/* pt-6: Mouse'un linkten menüye geçerken kopmaması için görünmez köprü */}
                        <div className="absolute top-full left-0 pt-6 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-beige/50 overflow-hidden py-2 ring-1 ring-black/5">
                                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-beige/30 mb-1">
                                    Koleksiyonlar
                                </div>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <Link 
                                            key={cat.id} 
                                            to={`/kategori/${cat.slug}`}
                                            className="block px-4 py-2.5 text-sm text-black/70 hover:bg-beige/20 hover:text-gold hover:pl-6 transition-all duration-300"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-400 text-center">Yükleniyor...</div>
                                )}
                                <div className="h-px bg-beige/30 my-1" />
                                <Link to="/kategoriler" className="block px-4 py-2.5 text-xs font-bold text-center text-gold hover:underline">
                                    TÜMÜNÜ GÖR
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            }

            // Diğer standart linkler
            return (
                <Link 
                    key={l.to} 
                    to={l.to} 
                    className={getLinkClass(location.pathname === l.to)}
                >
                    {l.label}
                </Link>
            );
          })}
        </div>

        {/* ORTA BÖLÜM: Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105 z-10">
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="h-40 w-auto object-contain pt-5 transition-all duration-300 drop-shadow-sm"
          />
        </Link>

        {/* SAĞ BÖLÜM: İkonlar */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-2">
          {user ? (
            <div className="relative group">
              <button onClick={() => setMenu((m) => !m)} className={userAvatarClass}>
                {initial}
              </button>
              {menu && (
                <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-xl shadow-xl border border-beige/50 py-2 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5 overflow-hidden z-50">
                  <div className="px-5 py-4 bg-beige/10 border-b border-beige/30 mb-1">
                    <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-0.5">Hesap</p>
                    <p className="text-sm font-medium text-black truncate">{user.name}</p>
                  </div>
                  <Link to="/hesabim" className="flex items-center gap-3 px-5 py-3 text-sm text-black/70 hover:bg-beige/20 hover:text-gold transition-colors" onClick={() => setMenu(false)}>
                    <UserCircle size={18} /> Hesabım
                  </Link>
                  {role === "admin" && (
                    <Link to="/admin" className="flex items-center gap-3 px-5 py-3 text-sm text-black/70 hover:bg-beige/20 hover:text-gold transition-colors" onClick={() => setMenu(false)}>
                      <Settings size={18} /> Yönetim Paneli
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 my-1" />
                  <button className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm text-red-500 hover:bg-red-50 transition-colors" onClick={handleLogout}>
                    <LogOut size={18} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/giris-yap" className={iconBtnClass} aria-label="Giriş Yap">
              <User strokeWidth={1.5} size={22} />
            </Link>
          )}
          <Link to="/favorilerim" className={iconBtnClass} aria-label="Favoriler">
            <Heart strokeWidth={1.5} size={22} />
          </Link>
          <Link to="/sepet" className={`${iconBtnClass} relative`} aria-label="Sepet">
            <ShoppingBag strokeWidth={1.5} size={22} />
          </Link>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <button 
            onClick={() => setOpen((v) => !v)} 
            className={`md:hidden ml-auto p-2 rounded-md transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-beige/20"}`}
        >
            {open ? <X strokeWidth={1.5} size={28} /> : <Menu strokeWidth={1.5} size={28} />}
        </button>
      </nav>

      {/* MOBİL MENÜ (Overlay) */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-96px)] bg-cream border-t border-beige/50 shadow-2xl overflow-y-auto z-40">
          <div className="p-6 flex flex-col h-full">
            <div className="flex flex-col gap-4">
              {LINKS.map((l) => (
                <div key={l.to}>
                    <Link 
                    to={l.to} 
                    className={`text-lg font-medium ${location.pathname === l.to ? "text-gold" : "text-black/80"}`}
                    onClick={() => setOpen(false)}
                    >
                    {l.label}
                    </Link>
                    {/* Mobilde Kategoriler Altına Liste Aç */}
                    {l.id === 'kategoriler' && categories.length > 0 && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-beige/30 ml-1">
                            {categories.map(cat => (
                                <Link 
                                    key={cat.id}
                                    to={`/kategori/${cat.slug}`}
                                    className="block text-sm text-black/60 hover:text-gold"
                                    onClick={() => setOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
              ))}
            </div>
            <div className="h-px bg-beige/50 my-6" />
            <div className="mt-auto space-y-4">
                {/* Mobil Alt Kısım (Profil vb.) - Değişmedi, mevcut kodunuzun aynısı */}
                {user ? (
                  <div className="bg-white p-4 rounded-xl border border-beige/40 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                             {initial}
                          </div>
                          <div>
                              <div className="text-xs text-gray-400">Hoş geldin</div>
                              <div className="font-medium text-black">{user.name}</div>
                          </div>
                      </div>
                      <Link to="/hesabim" className="flex items-center gap-2 text-black/70 py-2 hover:text-gold" onClick={() => setOpen(false)}>
                        <UserCircle size={18} /> Hesabım
                      </Link>
                      <Link to="/favorilerim" className="flex items-center gap-2 text-black/70 py-2 hover:text-gold" onClick={() => setOpen(false)}>
                        <Heart size={18} /> Favorilerim
                      </Link>
                      <button className="flex items-center gap-2 text-red-500 py-2 mt-1 w-full text-left" onClick={() => { setOpen(false); handleLogout(); }}>
                        <LogOut size={18} /> Çıkış Yap
                      </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/giris-yap" className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-beige/40 rounded-xl text-black hover:border-gold transition" onClick={() => setOpen(false)}>
                        <User strokeWidth={1.5} /> <span className="text-sm font-medium">Giriş Yap</span>
                    </Link>
                    <Link to="/favorilerim" className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-beige/40 rounded-xl text-black hover:border-gold transition" onClick={() => setOpen(false)}>
                        <Heart strokeWidth={1.5} /> <span className="text-sm font-medium">Favoriler</span>
                    </Link>
                  </div>
                )}
                <Link to="/sepet" className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-xl font-medium mt-4 hover:bg-gold transition-colors" onClick={() => setOpen(false)}>
                  <ShoppingBag strokeWidth={1.5} size={20} /> SEPETE GİT
                </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}