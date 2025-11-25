import { Outlet, useLocation } from "react-router-dom";
import { BreadcrumbProvider } from "../context/BreadcrumbContext";
import Navbar from "../components/navbar";
import GlobalBreadcrumbBar from "../components/GlobalBreadcrumbBar";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/"; // sadece ana sayfa

  return (
    <BreadcrumbProvider>
      <div className="min-h-screen bg-cream text-black">
        {/* NAVBAR (her sayfada) */}
        <Navbar />

        {/* BREADCRUMB: ana sayfa HARİÇ tüm sayfalarda */}
        {!isHome && (
          <div className="bg-cream border-b border-beige/60">
            <GlobalBreadcrumbBar />
          </div>
        )}

        {/* SAYFA İÇERİĞİ */}
        <main className="pb-10">
          <Outlet />
        </main>
      </div>
    </BreadcrumbProvider>
  );
}
