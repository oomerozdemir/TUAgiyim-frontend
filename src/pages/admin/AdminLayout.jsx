import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar";

const tabs = [
  { to: "/admin", label: "Özet", end: true },
  { to: "/admin/categories", label: "Kategoriler" },
  { to: "/admin/products", label: "Ürünler" },
  { to: "/admin/orders", label: "Siparişler" },
  { to: "/admin/users", label: "Kullanıcılar" },
  { to: "/admin/messages", label: "Mesajlar" },
  { to: "/admin/settings", label: "Ayarlar" },
];

export default function AdminLayout() {
  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto pt-28 px-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Paneli</h1>

      {/* Sekmeler */}
      <div className="border-b border-beige/60 mb-6">
        <nav className="-mb-px flex gap-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `px-3 py-2 border-b-2 ${
                  isActive ? "border-gold text-black" : "border-transparent text-black/70 hover:text-black"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* İçerik */}
      <div className="pb-16">
        <Outlet />
      </div>
    </div>
    
    </>
  );
}
