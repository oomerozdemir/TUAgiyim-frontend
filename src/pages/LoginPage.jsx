import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setItems: setBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumb([{ label: "Anasayfa", to: "/" }, { label: "Giriş Yap" }]);
  }, [setBreadcrumb]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const base = import.meta.env.VITE_API_BASE;

      // 1) LOGIN — cookie için withCredentials şart
      const { data } = await axios.post(
        `${base}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // 2) Tokenları kaydet (fallback: cookie çalışmasa bile)
      const accessToken = data?.accessToken || data?.token || "";
      const refreshToken = data?.refreshToken || "";
      if (accessToken) localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("rt", refreshToken);

      // 3) AuthContext'e kullanıcıyı yaz
      login({
        id: data?.id,
        name: data?.name,
        email: data?.email,
        accessToken,
      });

      // 4) HEMEN yönlendir (profil beklenmez)
      navigate("/", { replace: true });

      // 5) Profil rolünü arkaplanda getir (başarısız olsa da sorun yok)
      (async () => {
        try {
          const prof = await axios.get(`${base}/api/auth/profile`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          // eğer Context’te rol tutuyorsan burada güncelle
          // login({ ...data, role: prof?.data?.role });
          // admin'se istersen /admin'e yönlendirebilirsin:
          // if (String(prof?.data?.role).toLowerCase() === "admin") {
          //   navigate("/admin/products", { replace: true });
          // }
        } catch (e) {
          if (import.meta.env.DEV) console.warn("Profil alınamadı:", e);
        }
      })();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Giriş başarısız. Bilgileri kontrol edin.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-black mb-6 text-center">
          Giriş Yap
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
            disabled={loading}
            className={`bg-gold text-black font-medium py-2 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gold/90"
            }`}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Hesabın yok mu?{" "}
          <Link to="/kayit-ol" className="text-gold hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
