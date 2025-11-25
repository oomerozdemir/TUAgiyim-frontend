// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true, // Cookie taşıma için
});

// Tokenları localStorage'dan al
let accessToken = localStorage.getItem("token") || null;
let refreshToken = localStorage.getItem("rt") || null;

export const setTokens = (at, rt) => {
  if (at) {
    accessToken = at;
    localStorage.setItem("token", at);
    api.defaults.headers.common.Authorization = `Bearer ${at}`;
  }
  if (rt) {
    refreshToken = rt;
    localStorage.setItem("rt", rt);
  }
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem("token");
  localStorage.removeItem("rt");
};

// Request Interceptor: Her isteğe token ekle
api.interceptors.request.use((config) => {
  // Bellektekini veya localStorage'dakini kullan
  const token = accessToken || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let waiters = [];

const wakeAll = (t) => { 
  waiters.forEach((cb) => cb(t)); 
  waiters = []; 
};

const NO_REFRESH_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    const url = (original?.url || "").toString();

    // 401 hatası alındıysa ve daha önce denenmediyse
    if (status === 401 && !original?._retry && !NO_REFRESH_PATHS.some((p) => url.includes(p))) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh Token'ı localStorage'dan al (Cookie çalışmazsa kurtarıcı)
          const currentRefreshToken = localStorage.getItem("rt");
          
          if (!currentRefreshToken) throw new Error("No refresh token");

          // Refresh isteği yaparken body içinde rt gönderiyoruz
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE}/api/auth/refresh`,
            { rt: currentRefreshToken }, 
            {
              withCredentials: true,
            }
          );

          if (data?.accessToken) {
            setTokens(data.accessToken, data.refreshToken || currentRefreshToken);
          }
          wakeAll(data.accessToken);
        } catch (e) {
          clearTokens();
          // Kullanıcıyı login sayfasına at (isteğe bağlı ama önerilir)
          window.location.href = "/giris-yap"; 
          wakeAll(null);
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        waiters.push((t) => {
          if (!t) return reject(error); // Token yenilenemedi
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${t}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;