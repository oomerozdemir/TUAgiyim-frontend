import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setItems: setBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumb([{ label: "Anasayfa", to: "/" }, { label: "Kayıt Ol" }]);
  }, [setBreadcrumb]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const base = import.meta.env.VITE_API_BASE;

      // 🔥 Cookie’nin doğru set edilmesi için withCredentials: true
      const { data } = await axios.post(
        `${base}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );

      // ✅ accessToken + refreshToken’ı localStorage’a kaydet
      if (data?.accessToken || data?.token) {
        localStorage.setItem("token", data.accessToken || data.token);
      }
      if (data?.refreshToken) {
        localStorage.setItem("rt", data.refreshToken);
      }

      // AuthContext'e login bilgilerini ver
      login({
        id: data.id,
        name: data.name,
        email: data.email,
        accessToken: data.accessToken || data.token,
      });

      // ✅ Anasayfaya yönlendir
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Kayıt hatası:", err);
      const msg =
        err?.response?.data?.message ||
        "Kayıt başarısız. Bilgileri kontrol edin.";
      alert(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-black mb-6 text-center">
          Kayıt Ol
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-beige rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-beige rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-beige rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <button
            type="submit"
            className="bg-gold text-black font-medium py-2 rounded-lg hover:bg-gold/90 transition"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Zaten hesabın var mı?{" "}
          <Link to="/giris-yap" className="text-gold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
