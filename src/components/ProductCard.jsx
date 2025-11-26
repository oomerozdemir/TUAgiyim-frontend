import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "../context/CartContext"; 

export default function ProductCard({
  product,
  tl,
  showFavorite = true,
  showCartButton = true,
  className = "",
}) {
  const { addItem, openCart } = useCart();

  // --- STATE'LER ---
  // Renk seçimi zaten vardı
  const [selectedColorKey, setSelectedColorKey] = useState(null);
  
  // YENİ: Beden seçimi ve Hata kontrolü
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [showError, setShowError] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    price,
    images,
    image,
    sizes,
    colors,
    ratingCount,
    averageRating,
    isFavorited,
    stock,
  } = product;

  const hasColors = Array.isArray(colors) && colors.length > 0;
  const hasSizes = Array.isArray(sizes) && sizes.length > 0;

  // --- RENK MANTIĞI ---
  useEffect(() => {
    // Component yüklendiğinde varsayılan rengi ayarla
    if (hasColors && !selectedColorKey) {
        const defaultKey = colors[0].id ?? colors[0].label;
        setSelectedColorKey(defaultKey);
    }
  }, [hasColors, colors, selectedColorKey]);

  const currentColor =
    hasColors &&
    colors.find(
      (c) =>
        c.id === selectedColorKey ||
        (!c.id && c.label === selectedColorKey)
    );

  // --- GÖRSEL SEÇİMİ ---
  const imageList = Array.isArray(images) ? images : [];
  
  // Seçili renge göre görsel bulma
  const colorImages =
    currentColor && currentColor.id
      ? imageList.filter((im) => im.colorId === currentColor.id)
      : [];

  const genericImages = imageList.filter((im) => !im.colorId);
  
  const fallbackSingle =
    image?.url || (typeof image === "string" ? image : null) || null;

  const primaryImage =
    colorImages[0]?.url ||
    genericImages[0]?.url ||
    imageList[0]?.url ||
    fallbackSingle ||
    "";

  const imageUrl = primaryImage;
  const priceLabel = tl ? tl(price) : `${price ?? ""} ₺`;

  // --- İŞLEVLER ---

  // Beden Seçimi
  const handleSizeSelect = (sId) => {
    setSelectedSizeId(sId);
    setShowError(false); // Seçim yapılınca hatayı kaldır
  };

  // Sepete Ekleme (Validasyonlu)
  const handleAddToCart = () => {
    // 1. Validasyon: Eğer ürünün bedenleri var ama seçili beden yoksa
    if (hasSizes && !selectedSizeId) {
      setShowError(true);
      // 3 saniye sonra hatayı otomatik kaldır (kullanıcıyı çok sıkmamak için)
      setTimeout(() => setShowError(false), 3000);
      return; 
    }

    // 2. Payload Hazırlama
    // Seçilen bedeni bul
    const selectedSizeObj = hasSizes ? sizes.find(s => s.id === selectedSizeId) : null;

    const payload = {
      productId: id,
      name: name,
      price: Number(price),
      image: imageUrl,
      quantity: 1,
      // Renk bilgisi
      colorId: currentColor?.id || null,
      colorLabel: currentColor?.label || null,
      // Beden bilgisi (Artık dolu gidiyor)
      sizeId: selectedSizeObj?.id || null,
      sizeLabel: selectedSizeObj?.label || null, 
    };

    addItem(payload);
    openCart();
    
    // İsteğe bağlı: Ekleme sonrası bedeni sıfırlama
    // setSelectedSizeId(null); 
  };

  const hasRating =
    typeof ratingCount === "number" &&
    ratingCount > 0 &&
    typeof averageRating === "number";

  return (
    <article
      className={`relative group bg-cream px-6 pt-6 pb-10 border-l border-black/10 first:border-l-0 flex flex-col h-full ${className}`}
    >
      {/* ÜRÜNE GİDEN LİNK */}
      <Link to={`/urun/${id}`} className="block mb-2">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-sm relative">
            {/* Stok Tükendi Etiketi */}
            {stock === 0 && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <span className="bg-black text-white text-xs px-2 py-1 font-bold">TÜKENDİ</span>
                </div>
            )}
            
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full grid place-items-center bg-black/5 text-xs text-black/50">
              Görsel yok
            </div>
          )}
        </div>

        <div className="mt-5 pr-14">
          <h3 className="text-sm font-medium text-black/80 leading-snug line-clamp-2 min-h-[2.5em]">
            {name}
          </h3>
          {price != null && (
            <div className="mt-2 text-lg font-semibold text-black">{priceLabel}</div>
          )}
        </div>
      </Link>

       {/* Favori Butonu */}
          {showFavorite && (
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <FavoriteButton
          productId={id}
          initial={isFavorited}
          className="bg-white hover:bg-gold hover:text-white border-gray-200 shadow-md w-11 h-11"
          />
          </div>
          )}
      {/* --- BEDEN SEÇİMİ (GÜNCELLENDİ) --- */}
      <div className="mt-auto mb-2">
        {hasSizes ? (
            <div className="flex flex-col gap-1">
                {/* Hata Mesajı */}
                {showError && (
                    <span className="text-[10px] text-red-600 font-bold animate-pulse">
                        * Lütfen beden seçiniz
                    </span>
                )}
                
                <div className={`flex flex-wrap gap-1.5 transition-all duration-300 ${showError ? 'p-1 bg-red-50 rounded border border-red-200' : ''}`}>
                    {sizes.map((s) => {
                        const inStock = s.stock > 0;
                        const isSelected = selectedSizeId === s.id;

                        return (
                        <button
                            key={s.id ?? s.label}
                            type="button"
                            disabled={!inStock}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (inStock) handleSizeSelect(s.id);
                            }}
                            title={inStock ? `Stok: ${s.stock}` : "Tükendi"}
                            className={`
                                min-w-[32px] h-7 px-2 text-[11px] font-medium rounded border transition-all
                                flex items-center justify-center
                                ${!inStock 
                                    ? "border-black/5 bg-black/5 text-black/20 cursor-not-allowed decoration-slice line-through" 
                                    : isSelected 
                                        ? "bg-black text-white border-black shadow-md scale-105" 
                                        : "bg-white text-black border-black/20 hover:border-black hover:bg-gray-50"
                                }
                            `}
                        >
                            {s.label}
                        </button>
                        );
                    })}
                </div>
          </div>
        ) : stock != null ? (
          <div className="min-h-[24px] flex items-center">
             <span className="text-xs text-black/60">
                Stok: {Number(stock ?? 0)}
            </span>
          </div>
        ) : <div className="min-h-[24px]"></div>}
      </div>

      {/* --- RENK SWATCH'LARI --- */}
      <div className="mt-2 min-h-[28px] flex flex-wrap gap-1.5">
        {hasColors &&
          colors.map((c, index) => {
            const key = c.id ?? c.label ?? index;
            const isActive =
              currentColor &&
              (currentColor.id
                ? currentColor.id === c.id
                : currentColor.label === c.label);

            const lower = (c.label || "").toLowerCase();
            let bgColor = c.hex || c.code || c.color || "";
            // Basit renk mapping
            if (!bgColor) {
              if (lower.includes("siyah")) bgColor = "#000000";
              else if (lower.includes("beyaz")) bgColor = "#ffffff";
              else if (lower.includes("kırmızı")) bgColor = "#d32f2f";
              else if (lower.includes("yeşil")) bgColor = "#388e3c";
              else if (lower.includes("mavi")) bgColor = "#1976d2";
              else if (lower.includes("lacivert")) bgColor = "#000080";
              else if (lower.includes("sarı")) bgColor = "#fbc02d";
              else if (lower.includes("gri")) bgColor = "#9e9e9e";
              else if (lower.includes("bej")) bgColor = "#f5f5dc";
              else if (lower.includes("mor")) bgColor = "#7b1fa2";
              else bgColor = "#e5e5e5";
            }

            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColorKey(c.id ?? c.label ?? index);
                }}
                title={`${c.label ?? ""}`}
                className={`w-5 h-5 rounded-full border shadow-sm transition-transform hover:scale-110
                  ${
                    isActive
                      ? "border-white ring-1 ring-black scale-110"
                      : "border-black/10"
                  }`}
                style={{ backgroundColor: bgColor }}
              />
            );
          })}
      </div>

      {/* Rating */}
      <div className="mt-2 min-h-[18px] flex items-center gap-1 text-xs mb-2">
        {hasRating ? (
          <>
            <Star
              size={14}
              className="fill-yellow-400 stroke-yellow-400"
            />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-black/40">({ratingCount})</span>
          </>
        ) : null}
      </div>

      {/* SEPET İKONU */}
      {showCartButton && (
        <button
          type="button"
          aria-label="Sepete ekle"
          className={`absolute right-6 bottom-10 grid place-items-center w-11 h-11 rounded-md text-white transition-all active:scale-90 shadow-lg
            ${showError ? 'bg-red-600 hover:bg-red-700 animate-shake' : 'bg-gold/90 hover:bg-black/80'}
          `}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6l-2 0" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
          </svg>
        </button>
      )}
    </article>
  );
}