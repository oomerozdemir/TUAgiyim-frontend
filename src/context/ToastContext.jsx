import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // 3 saniye sonra otomatik silinir
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-500 animate-in slide-in-from-right-12 fade-in
              ${toast.type === "success" ? "bg-white border-gold/50 text-black" : ""}
              ${toast.type === "error" ? "bg-white border-red-200 text-black" : ""}
              ${toast.type === "info" ? "bg-[#1a1a1a] text-white border-black" : ""}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle size={20} className="text-gold" />}
              {toast.type === "error" && <AlertCircle size={20} className="text-red-500" />}
              {toast.type === "info" && <Info size={20} className="text-white/80" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);