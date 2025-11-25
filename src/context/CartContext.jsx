import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(items));
  }, [items]);

  const addItem = (payload) => {
    // payload: { productId, name, price, image, sizeId?, sizeLabel?, colorId?, colorLabel?, quantity }
    const qty = Math.max(1, Number(payload.quantity || 1));
    const key = `${payload.productId}_${payload.sizeId || ""}_${payload.colorId || ""}`;

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          key,
          productId: payload.productId,
          name: payload.name,
          price: Number(payload.price),
          image: payload.image || null,
          sizeId: payload.sizeId || null,
          sizeLabel: payload.sizeLabel || null,
          colorId: payload.colorId || null,
          colorLabel: payload.colorLabel || null,
          quantity: qty,
        },
      ];
    });
  };

  const updateQty = (key, quantity) => {
    const q = Math.max(1, Number(quantity || 1));
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, quantity: q } : it)));
  };

  const increment = (key) => setItems((prev) => prev.map((it) => (it.key === key ? { ...it, quantity: it.quantity + 1 } : it)));
  const decrement = (key) =>
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))
    );

  const removeItem = (key) => setItems((prev) => prev.filter((it) => it.key !== key));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((a, it) => a + it.price * it.quantity, 0), [items]);

  const value = {
    items,
    addItem,
    updateQty,
    increment,
    decrement,
    removeItem,
    clear,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
