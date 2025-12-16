import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";               
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

// Public sayfa/bileşenler
import HeroSection from "./components/heroSection";
import HomeProducts from "./components/HomeProducts";
import CategoriesShowcase from "./components/CategoriesShowcase";
import AboutBlock from "./components/AboutBlock";
import InfoHighlights from "./components/InfoHighlights";
import FAQSection from "./components/FAQSection"; 
import NewsletterCTA from "./components/NewsLetterCta";
import CartDrawer from "./components/CartDrawer";

import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SalesContractPage from "./pages/SalesContractPage";

import AdminProductsPage from "./pages/admin/AdminProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetail from "./pages/ProductDetail";
import FavoritesPage from "./pages/FavoritesPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AccountPage from "./pages/AccountPage";

// Auth / Admin
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import ProductFormPage from "./pages/admin/ProductFormPage";
import AdminCategories from "./pages/admin/AdminCategories";
import StockPage from "./pages/admin/StockPage";
import CategoryFormPage from "./pages/admin/CategoryFormPage";
import AllProductsPage from "./pages/AllProductsPage";
import LastViewedProducts from "./components/LastViewedProducts";
import AdminMessagesPage from "./pages/admin/AdminMessages";
import AdminReturnsPage from "./pages/admin/AdminReturnsPage";

import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
        <BrowserRouter>
        <CartDrawer />
          <Routes>
            {/* ---------- PUBLIC (Navbar + Global Breadcrumb her sayfada) ---------- */}
            <Route element={<RootLayout />}>
              {/* Anasayfa */}
              <Route
                index
                element={
                  <>
                    <HeroSection />
                    <HomeProducts />
                    <CategoriesShowcase />
                    <LastViewedProducts />
                    <AboutBlock />
                    <InfoHighlights />
                    <FAQSection />
                    <NewsletterCTA />
                  </>
                }
              />

              {/* Ürün detayı */}
              <Route path="/urun/:id" element={<ProductDetail />} />

              {/* Kategoriler (genel) ve kategori detayı (slug) */}
              <Route path="/kategoriler" element={<CategoriesPage />} />
              <Route path="/kategori/:slug" element={<CategoriesPage />} />

              {/* Favorilerim */}
              <Route path="/favorilerim" element={<FavoritesPage />} />


              <Route path="/hakkimizda" element={<AboutPage />} />
              <Route path="/sss" element={<FaqPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              <Route path="/iade-degisim" element={<ReturnPolicyPage />} />
              <Route path="/kullanim-kosullari" element={<TermsPage />} />
              <Route path="/gizlilik-politikasi" element={<PrivacyPage />} />
              <Route path="/mesafeli-satis-sozlesmesi" element={<SalesContractPage />} />

              {/* Auth sayfaları */}
              <Route path="/giris-yap" element={<Login />} />
              <Route path="/kayit-ol" element={<Register />} />

              <Route path="/urunler" element={<AllProductsPage />} />

              {/* ✅ Sepet sayfası */}
              <Route path="/sepet" element={<CartPage />} />

              {/* ✅ Ödeme sayfası */}
              <Route path="/odeme" element={<PaymentPage />} />

              <Route path="/siparis-basarili" element={<OrderSuccessPage />} />

              <Route path="/hesabim" element={<AccountPage />} />

            </Route>

            {/* ---------- ADMIN ---------- */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminHome />} />

                  {/* Ürünler */}
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<ProductFormPage />} />
                  <Route path="products/:id/edit" element={<ProductFormPage />} />
                  <Route path="products/:id/stock" element={<StockPage />} />

                  {/* Kategoriler (admin) */}
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="categories/new" element={<CategoryFormPage />} />
                  <Route path="categories/:id" element={<CategoryFormPage />} />

                  <Route path="returns" element={<AdminReturnsPage />} />

                  {/* Diğer sekmeler */}
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                    <Route path="messages" element={<AdminMessagesPage />} /> 
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
/* 
seo çalışması

belli bir fiyat üzeri kargo ücretsiz olarak tanımlama nasıl yapılır ona bak

kupon kodu

favicon duzenlemesi

urun detay duzenlemesi alt bilgi olarak

localden siteye ürün bilgisi çekme otomatik nasıl yapolır araştır

yeni sezon ve kampanyalı ürünler gibi ana kategorilerin altında ayrı bluz pantolon gibi alt kategoriler olsun
şu anda tek bir yapı var yani her ana kategorinin ayrı ayrı isimlendirmesi mi olmalı bu yapıyı nasıl çözeriz


blog üret


müşteri destek için whatsapp ikonu ekle sözderecedeki gibi olabilir veya tuviddeki gibi ama wp ye yönlendireninden


yandan açılan sepet sidebarında sil butonu yok

güvenlik için araştırma yap

mail marketing yapicaz
*/