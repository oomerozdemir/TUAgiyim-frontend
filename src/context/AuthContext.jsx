import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, {clearTokens} from "../lib/api";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem("auth");
      return saved ? JSON.parse(saved) : { user: null, token: null };
    } catch {
      return { user: null, token: null };
    }
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const login = (data) => {
    const token = data.accessToken || data.token || null; 
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role || null,
    };
    setAuth({ user, token });
    localStorage.setItem("auth", JSON.stringify({ user, token }));
  };
  const logout = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE;
      // rt cookie'yi de temizle
      await axios.post(`${base}/api/auth/logout`, {}, { withCredentials: true });
   } catch (_) {}
    // bellekteki ve localStorage'daki tüm tokenları sil
    clearTokens();
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
  };

    useEffect(() => {
    const hydrateProfile = async () => {
      if (!auth?.token) return;
      if (auth?.user?.role) return;
      try {
        const base = import.meta.env.VITE_API_BASE;
        const res = await axios.get(`${base}/api/auth/profile`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const role = res?.data?.role || null;
        if (role) {
          setAuth((prev) => ({
            ...prev,
            user: { ...(prev.user || {}), role },
          }));
        }
      } catch (e) {
        // sessiz geç
      }
    };
    hydrateProfile();
  }, [auth?.token, auth?.user?.role]);


  const value = useMemo(() => ({ auth, login, logout }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
