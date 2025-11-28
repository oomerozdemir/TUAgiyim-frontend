import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { User, Heart, ShoppingBag, Menu, X, LogOut, UserCircle, Settings, ChevronDown } from "lucide-react";
import api from "../lib/api";

const LOGO_URL = "/images/logo2.png"; 

// === RENK PALETİ CONSTANTS ===
const ACCENT_COLOR_TEXT = "text-[#A39075]"; 

const LINKS = [
  { to: "/kategoriler", label: "Kategoriler", id: "kategoriler" },
  { to: "/urunler", label: "Tüm Ürünler", id: "ürünler" },
  { to: "/hakkimizda", label: "Hakkımızda", id: "hakkimizda" },
];

export default function EnhancedNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  
  const { auth, logout } = useAuth(); 
  const { items } = useCart();
  const user = auth?.user;
  const role = user?.role?.toLowerCase?.();

  const isHomePage = location.pathname === "/";
  const cartCount = items?.length || 0;

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

  const navBaseClasses = "top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out border-b";
  const positionClass = isHomePage ? "fixed" : "sticky";
  
  const appearanceClasses = isTransparent
    ? "bg-gradient-to-b from-black/60 to-transparent border-white/5 backdrop-blur-[2px]" 
    : "bg-[#FAF9F6]/95 backdrop-blur-xl shadow-sm border-[#E0DCD5]"; 

  const textColor = isTransparent 
    ? "text-white/90 hover:text-white" 
    : "text-[#4A4A4A] hover:text-black";
  
  const activeLinkClass = `font-medium ${ACCENT_COLOR_TEXT} relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#A39075]`; 

  const iconBtnClass = `transition-all duration-300 p-2.5 rounded-full relative group ${
    isTransparent 
        ? "text-white hover:bg-white/10" 
        : "text-[#5C5346] hover:bg-[#F0EBE0] hover:text-[#2D2D2D]"
  }`;

  const userAvatarClass = `w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm border ${
    isTransparent
      ? "bg-white/20 text-white border-white/30 hover:bg-white hover:text-[#8C7B62]"
      : "bg-[#EBE5D9] text-[#5C5346] border-[#D6C4A8] hover:border-[#A39075]"
  }`;

  const LogoComponent = () => (
    <div className={`font-serif font-bold text-2xl tracking-tighter flex items-center h-full transition-all duration-500 ${isTransparent ? "text-white" : "text-black"}`}>
       TUA<span className="text-[#A39075]">.</span>
    </div>
  );

  const getLinkClass = (isActive) => 
    `text-sm tracking-wide transition-all duration-300 relative group ${isActive ? activeLinkClass : textColor}`;

  return (
    <header className={`${positionClass} ${navBaseClasses} ${appearanceClasses}`}>
      <nav className="mx-auto max-w-[1600px] px-6 h-24 flex items-center">
        
        {/* SOL BÖLÜM (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-8">
          {LINKS.map((l) => {
            if (l.id === 'kategoriler') {
                return (
                    <div key={l.id} className="relative group h-full flex items-center">
                        <Link 
                            to={l.to} 
                            className={`flex items-center gap-1 ${getLinkClass(location.pathname.startsWith("/kategori"))}`}
                        >
                            {l.label}
                            <ChevronDown size={14} className={`transition-all duration-300 group-hover:rotate-180 opacity-60`} />
                        </Link>

                        <div className="absolute top-full left-0 pt-6 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="bg-[#FAF9F6] rounded-xl shadow-xl border border-[#E0DCD5] overflow-hidden py-3 ring-1 ring-black/5">
                                <div className="px-5 py-3 border-b border-[#E0DCD5] mb-2">
                                    <p className="text-[10px] font-bold text-[#8C7B62] uppercase tracking-widest">
                                        Koleksiyonlar
                                    </p>
                                </div>
                                {categories.length > 0 ? (
                                    <div className="space-y-1 px-2">
                                        {categories.map((cat) => (
                                            <Link 
                                                key={cat.id}
                                                to={`/kategori/${cat.slug}`}
                                                className="w-full text-left px-4 py-2.5 text-sm text-[#5C5346] hover:bg-[#F0EBE0] hover:text-[#2D2D2D] rounded-lg transition-all duration-300 hover:pl-6 flex items-center justify-between"
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-50 transition-all text-[#8C7B62]" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-6 text-sm text-gray-400 text-center">Yükleniyor...</div>
                                )}
                                <div className="mt-2 pt-3 px-4 border-t border-[#E0DCD5]">
                                    <Link to="/kategoriler" className="w-full block py-2.5 text-xs font-bold text-center text-white bg-[#2D2D2D] hover:bg-[#8C7B62] rounded-lg transition-all duration-300">
                                        TÜMÜNÜ GÖR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            return (
                <Link 
                    key={l.to}
                    to={l.to}
                    className={getLinkClass(location.pathname === l.to)}
                >
                    {l.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A39075] group-hover:w-full transition-all duration-300" />
                </Link>
            );
          })}
        </div>

        {/* ORTA BÖLÜM: Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center justify-center transition-transform duration-500 hover:scale-105 z-10">
           <LogoComponent />
        </Link>

        {/* SAĞ BÖLÜM: İkonlar (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          {user ? (
            <div className="relative group/user">
              <button onClick={() => setMenu((m) => !m)} className={userAvatarClass}>
                {initial}
              </button>
              {menu && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-[#FAF9F6] rounded-xl shadow-xl border border-[#E0DCD5] py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-5 py-4 border-b border-[#E0DCD5] mb-2 bg-[#F5F2EB]/50">
                    <p className="text-[10px] text-[#8C7B62] font-bold uppercase tracking-wider mb-1">Hesap</p>
                    <p className="text-sm font-semibold text-[#2D2D2D] truncate">{user.name}</p>
                  </div>
                  
                  <Link to="/hesabim" className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#5C5346] hover:bg-[#F0EBE0] hover:text-[#2D2D2D] transition-all" onClick={() => setMenu(false)}>
                    <UserCircle size={18} /> Hesabım
                  </Link>
                  
                  {role === "admin" && (
                    <Link to="/admin" className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#5C5346] hover:bg-[#F0EBE0] hover:text-[#2D2D2D] transition-all" onClick={() => setMenu(false)}>
                      <Settings size={18} /> Yönetim Paneli
                    </Link>
                  )}

                  <div className="h-px bg-[#E0DCD5] my-2" />
                  <button className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm text-red-500 hover:bg-red-50 transition-all" onClick={handleLogout}>
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
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D2D2D] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <button 
            onClick={() => setOpen((v) => !v)} 
            className={`md:hidden ml-auto p-2.5 rounded-lg transition-all duration-300 ${isTransparent ? "text-white hover:bg-white/10" : "text-[#2D2D2D] hover:bg-[#F0EBE0]"}`}
        >
            {open ? <X strokeWidth={1.5} size={28} /> : <Menu strokeWidth={1.5} size={28} />}
        </button>
      </nav>

      {/* MOBİL MENÜ (Overlay) - DÜZELTİLDİ */}
      {/* 'fixed' pozisyonu ve 'dvh' kullanımı ile tam ekran kapsama */}
      {open && (
        <div className="md:hidden fixed top-24 left-0 w-full h-[calc(100dvh-6rem)] bg-[#FAF9F6] border-t border-[#E0DCD5] shadow-2xl overflow-y-auto z-50 animate-in slide-in-from-top duration-300">
          {/* min-h-full ve pb-32 ile içeriğin kaydırılabilir olması ve alt kısmın görünürlüğü garanti altına alındı */}
          <div className="p-6 flex flex-col min-h-full pb-32">
            
            {/* Ana Linkler */}
            <div className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <div key={l.to}>
                    <Link 
                        to={l.to}
                        className={`w-full text-left text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300 ${location.pathname === l.to ? "text-[#8C7B62] bg-[#F5F2EB]" : "text-[#2D2D2D] hover:bg-[#F5F2EB]"}`}
                        onClick={() => setOpen(false)}
                    >
                        {l.label}
                    </Link>
                    
                    {l.id === 'kategoriler' && categories.length > 0 && (
                        <div className="pl-6 mt-1 space-y-1 border-l border-[#E0DCD5] ml-4">
                            {categories.map(cat => (
                                <Link 
                                    key={cat.id}
                                    to={`/kategori/${cat.slug}`}
                                    className="block w-full text-left text-sm text-[#5C5346] hover:text-[#2D2D2D] py-2 px-3 rounded-lg hover:bg-[#F5F2EB] transition-all"
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
            
            <div className="h-px bg-[#E0DCD5] my-6" />
            
            {/* Kullanıcı Paneli (Mobil) - Alt kısma itildi (mt-auto) */}
            <div className="mt-auto space-y-4">
                {user ? (
                  <div className="bg-[#F5F2EB] p-5 rounded-2xl border border-[#E0DCD5]">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#D6C4A8] text-[#5C5346] flex items-center justify-center font-bold text-lg shadow-sm">
                             {initial}
                          </div>
                          <div>
                              <div className="text-xs text-[#8C7B62] font-semibold">Hoş geldin</div>
                              <div className="font-semibold text-[#2D2D2D]">{user.name}</div>
                          </div>
                      </div>
                      
                      <Link to="/hesabim" className="w-full flex items-center gap-3 text-[#5C5346] py-3 px-4 hover:bg-white rounded-lg transition-all" onClick={() => setOpen(false)}>
                        <UserCircle size={18} /> Hesabım
                      </Link>

                      {role === "admin" && (
                        <Link to="/admin" className="w-full flex items-center gap-3 text-[#5C5346] py-3 px-4 hover:bg-white rounded-lg transition-all" onClick={() => setOpen(false)}>
                          <Settings size={18} /> Yönetim Paneli
                        </Link>
                      )}
                      
                      <button className="w-full flex items-center gap-3 text-red-500 py-3 px-4 hover:bg-white rounded-lg transition-all" onClick={() => { setOpen(false); handleLogout(); }}>
                        <LogOut size={18} /> Çıkış Yap
                      </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/giris-yap" className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-[#E0DCD5] rounded-2xl text-[#2D2D2D] hover:border-[#8C7B62] transition-all" onClick={() => setOpen(false)}>
                        <User strokeWidth={1.5} size={24} /> 
                        <span className="text-sm font-semibold">Giriş Yap</span>
                    </Link>
                    <Link to="/favorilerim" className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-[#E0DCD5] rounded-2xl text-[#2D2D2D] hover:border-[#8C7B62] transition-all" onClick={() => setOpen(false)}>
                        <Heart strokeWidth={1.5} size={24} /> 
                        <span className="text-sm font-semibold">Favoriler</span>
                    </Link>
                  </div>
                )}
                
                <Link to="/sepet" className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium shadow-lg hover:bg-[#8C7B62] transition-all" onClick={() => setOpen(false)}>
                  <ShoppingBag strokeWidth={1.5} size={20} /> 
                  SEPETE GİT
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 bg-white text-black text-xs font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}