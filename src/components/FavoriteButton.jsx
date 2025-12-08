import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function FavoriteButton({ productId, initial, className = "" }) {
  const [fav, setFav] = useState(Boolean(initial));
  const [loading, setLoading] = useState(false);
  const [burst, setBurst] = useState(0); 
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (initial !== undefined) return;
    if (!user) return; 

    (async () => {
      try {
        const { data } = await api.get(`/api/favorites/check/${productId}`);
        setFav(Boolean(data?.favorited));
      } catch (err) {
        if (import.meta.env.DEV) console.warn("Fav check failed:", err);
      }
    })();
  }, [productId, initial, user]);

  useEffect(() => {
    if (initial !== undefined) setFav(Boolean(initial));
  }, [initial]);

  const shards = useMemo(() => Array.from({ length: 8 }, (_, i) => i * (360 / 8)), []);

  const toggle = async (e) => { 
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    
    if (!user) {
        addToast("Favorilere eklemek için lütfen giriş yapınız.", "error"); 
        return;
    }

    setLoading(true);
    
    const previousState = fav;
    
    setFav(!previousState);
    if (!previousState) setBurst((prev) => prev + 1);

    try {
     
      const { data } = await api.post(`/api/favorites/${productId}`);
      
      setFav(data.favorited);
      
      if (data.favorited) {
        addToast("Ürün favorilere eklendi.", "success");
      } else {
        addToast("Ürün favorilerden kaldırıldı.", "info");
      }

    } catch (error) {
      setFav(previousState);
      console.error("Favori işlemi başarısız:", error);
      
      const msg = error.response?.data?.message || "İşlem sırasında bir hata oluştu.";
      addToast(msg, "error"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-busy={loading}
      className={`relative inline-grid place-items-center w-10 h-10 rounded-full border border-beige/60 
                  bg-white/90 hover:bg-gold/90 hover:text-black transition-colors 
                  ${loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      whileTap={{ scale: 0.92 }}
      animate={{ scale: fav ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 18, mass: 0.2 }}
      title={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      {/* Ripple halkası */}
      <AnimatePresence mode="wait">
        {fav && (
          <motion.span
            key={`ring-${burst}`}
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0.6, opacity: 0.35 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ border: "2px solid rgba(212,175,55,0.6)" }} 
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Konfeti parçacıkları */}
      <AnimatePresence>
        {fav && (
          <motion.span
            key={`burst-${burst}`}
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            aria-hidden
          >
            {shards.map((deg, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ width: 6, height: 6, background: i % 2 ? "#d4af37" : "#000" }}
                initial={{ x: -3, y: -3, scale: 0, rotate: 0 }}
                animate={{
                  x: 26 * Math.cos((deg * Math.PI) / 180),
                  y: 26 * Math.sin((deg * Math.PI) / 180),
                  scale: 1,
                  rotate: deg * 2,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Kalp */}
      <motion.span
        key={fav ? "on" : "off"}
        initial={{ scale: 0.9, rotate: 0 }}
        animate={{ scale: 1, rotate: fav ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 20 }}
      >
        <Heart
          size={18}
          strokeWidth={1.8}
          className={`${fav ? "fill-gold/90 stroke-black" : "stroke-black"} transition-all duration-200`}
        />
      </motion.span>
    </motion.button>
  );
}