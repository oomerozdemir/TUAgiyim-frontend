import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true, // cookie taşı
});

// access/refresh token’ları bellek + localStorage’da tut
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
  // auth objesini tutuyorsan onu da silme işlemi context'te yapılacak
};

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let waiters = [];
const wakeAll = (t) => { waiters.forEach((cb) => cb(t)); waiters = []; };

const NO_REFRESH_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    const url = (original?.url || "").toString();

    if (status === 401 && !original?._retry && !NO_REFRESH_PATHS.some((p) => url.includes(p))) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 1) Cookie ile dene + 2) Bearer rt fallback
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE}/api/auth/refresh`,
            refreshToken ? { rt: refreshToken } : {},
            {
              withCredentials: true,
              headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined,
            }
          );

          if (data?.accessToken) {
            setTokens(data.accessToken, data.refreshToken || refreshToken);
          }
          wakeAll(accessToken);
        } catch (e) {
          accessToken = null;
          refreshToken = null;
          localStorage.removeItem("token");
          localStorage.removeItem("rt");
          wakeAll(null);
          // İsteğe bağlı:
          // window.location.href = "/giris-yap";
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        waiters.push((t) => {
          if (!t) return reject(error);
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
