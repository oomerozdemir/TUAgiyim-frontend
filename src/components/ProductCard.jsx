import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Heart } from "lucide-react";
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
  const [selectedColorKey, setSelectedColorKey] = useState(null);
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
    if (hasColors && !selectedColorKey) {
      const defaultKey = colors[0].id ?? colors[0].label;
      setSelectedColorKey(defaultKey);
    }
  }, [hasColors, colors, selectedColorKey]);

  const currentColor =
    hasColors &&
    colors.find(
      (c) => c.id === selectedColorKey || (!c.id && c.label === selectedColorKey)
    );

  // --- GÖRSEL SEÇİMİ ---
  const imageList = Array.isArray(images) ? images : [];

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
  const handleSizeSelect = (sId) => {
    setSelectedSizeId(sId);
    setShowError(false);
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedSizeId) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const selectedSizeObj = hasSizes
      ? sizes.find((s) => s.id === selectedSizeId)
      : null;

    const payload = {
      productId: id,
      name: name,
      price: Number(price),
      image: imageUrl,
      quantity: 1,
      colorId: currentColor?.id || null,
      colorLabel: currentColor?.label || null,
      sizeId: selectedSizeObj?.id || null,
      sizeLabel: selectedSizeObj?.label || null,
    };

    addItem(payload);
    openCart();
  };

  const hasRating =
    typeof ratingCount === "number" &&
    ratingCount > 0 &&
    typeof averageRating === "number";

  // Renk Kodu Çevirici
  const getColorHex = (label) => {
    const lower = (label || "").toLocaleLowerCase("tr");
    if (lower.includes("siyah") || lower.includes("black")) return "#000000";
    if (lower.includes("beyaz") || lower.includes("white")) return "#ffffff";
    if (lower.includes("kırmızı") || lower.includes("kirmizi") || lower.includes("red") || lower.includes("bordo")) return "#d32f2f";
    if (lower.includes("mavi") || lower.includes("blue") || lower.includes("lacivert")) return "#1976d2";
    if (lower.includes("yeşil") || lower.includes("yesil") || lower.includes("green") || lower.includes("haki")) return "#388e3c";
    if (lower.includes("sarı") || lower.includes("sari") || lower.includes("yellow")) return "#fbc02d";
    if (lower.includes("turuncu") || lower.includes("orange") || lower.includes("kiremit")) return "#f57c00";
    if (lower.includes("mor") || lower.includes("purple") || lower.includes("lila")) return "#7b1fa2";
    if (lower.includes("pembe") || lower.includes("pink") || lower.includes("pudra")) return "#e91e63";
    if (lower.includes("gri") || lower.includes("grey") || lower.includes("füme")) return "#757575";
    if (lower.includes("bej") || lower.includes("beige") || lower.includes("krem") || lower.includes("ekru")) return "#f5f5dc";
    if (lower.includes("kahve") || lower.includes("brown") || lower.includes("taba")) return "#795548";
    return "#e5e5e5";
  };

  return (
    <article
      className={`relative group bg-cream px-3 py-3 md:px-4 md:pt-4 md:pb-6 border border-black/5 rounded-lg sm:border-l sm:border-t-0 sm:border-b-0 sm:border-r-0 sm:first:border-l-0 flex flex-col h-full ${className}`}
    >
      {/* ÜRÜNE GİDEN LİNK */}
      <Link to={`/urun/${id}`} className="block mb-3 relative">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md relative bg-gray-100">
          {stock === 0 && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <span className="bg-black text-white text-[10px] sm:text-xs px-2 py-1 font-bold tracking-wider">
                TÜKENDİ
              </span>
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

        {/* --- MOBİL AKSİYONLAR (Görselin Üzerinde) --- */}
        <div className="sm:hidden">
            {/* Favori: Sağ Üst */}
            {showFavorite && (
                <div
                    className="absolute top-2 right-2 z-20"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <FavoriteButton
                        productId={id}
                        initial={isFavorited}
                        className="bg-white/90 text-black border-none shadow-sm w-8 h-8 rounded-full"
                    />
                </div>
            )}

            {/* Sepet: Sağ Alt */}
            {showCartButton && stock !== 0 && (
                <button
                    type="button"
                    className={`absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors
                        ${showError ? 'bg-red-50 text-red-600' : 'bg-white/90 text-black'}
                    `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart();
                    }}
                >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                </button>
            )}
        </div>
      </Link>

      {/* ÜRÜN BİLGİLERİ (ALT KISIM) */}
      <div className="flex flex-col flex-grow">
        <div className="mb-2">
           <Link to={`/urun/${id}`} className="block group-hover:text-gold transition-colors">
             <h3 className="text-sm font-medium text-black/90 leading-snug line-clamp-2 min-h-[2.5em]">
               {name}
             </h3>
           </Link>
           
           {price != null && (
             <div className="mt-1 text-base font-bold text-black">{priceLabel}</div>
           )}
        </div>

        {/* --- BEDEN SEÇİMİ --- */}
        <div className="mt-auto mb-3">
          {hasSizes ? (
            <div className="flex flex-col gap-1">
              {showError && (
                <span className="text-[10px] text-red-600 font-bold animate-pulse block mb-1">
                  * Beden seçiniz
                </span>
              )}

              <div className="flex flex-wrap gap-1.5">
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
                      className={`
                                min-w-[28px] h-7 px-1.5 text-[10px] font-medium rounded border transition-all
                                flex items-center justify-center
                                ${!inStock 
                                    ? "border-black/5 bg-black/5 text-black/20 cursor-not-allowed decoration-slice line-through"
                                    : isSelected
                                    ? "bg-black text-white border-black shadow-md scale-105"
                                    : "bg-white text-black border-black/10 hover:border-black hover:bg-gray-50"
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
              <span className="text-[10px] text-black/50 font-medium">
                Stok: {Number(stock ?? 0)}
              </span>
            </div>
          ) : <div className="min-h-[24px]"></div>}
        </div>

        {/* --- RENK SWATCH'LARI & RATING --- */}
        <div className="flex items-center justify-between mt-1 border-t border-black/5 pt-2">
           <div className="flex flex-wrap gap-1.5">
             {hasColors &&
               colors.map((c, index) => {
                 const key = c.id ?? c.label ?? index;
                 const isActive =
                   currentColor && (currentColor.id ? currentColor.id === c.id : currentColor.label === c.label);
                 return (
                   <button
                     key={key}
                     type="button"
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       setSelectedColorKey(c.id ?? c.label ?? index);
                     }}
                     className={`w-4 h-4 rounded-full border shadow-sm transition-transform hover:scale-110
                       ${isActive ? "border-white ring-1 ring-black scale-110" : "border-black/10"}`}
                     style={{ backgroundColor: getColorHex(c.label) }}
                   />
                 );
               })}
           </div>
           
           {/* Rating - Artık sağ altta rahatça durabilir */}
           {hasRating && (
             <div className="flex items-center gap-1 text-[10px] text-black/50 font-medium ml-auto">
               <Star size={12} className="fill-yellow-400 stroke-yellow-400" />
               <span>{averageRating.toFixed(1)}</span>
               <span className="hidden sm:inline">({ratingCount})</span>
             </div>
           )}
        </div>
      </div>

      {/* --- DESKTOP AKSİYON BUTONLARI (Hover ile görünür - Eski Hal) --- */}
      <div className="hidden sm:flex absolute right-4 bottom-24 flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
        {showFavorite && (
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <FavoriteButton
              productId={id}
              initial={isFavorited}
              className="bg-white hover:bg-gold hover:text-white border-gray-200 shadow-md w-10 h-10"
            />
          </div>
        )}
        
        {showCartButton && (
          <button
            type="button"
            aria-label="Sepete ekle"
            className={`grid place-items-center w-10 h-10 rounded-full text-white transition-all active:scale-90 shadow-md
              ${showError ? 'bg-red-600 hover:bg-red-700 animate-shake' : 'bg-black hover:bg-gold'}
            `}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

    </article>
  );
}