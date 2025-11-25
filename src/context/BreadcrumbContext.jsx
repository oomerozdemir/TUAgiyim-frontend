import { createContext, useContext, useState, useMemo } from "react";

const BreadcrumbCtx = createContext({ items: [], setItems: () => {} });

export function BreadcrumbProvider({ children }) {
  const [items, setItems] = useState([]);
  const value = useMemo(() => ({ items, setItems }), [items]);
  return <BreadcrumbCtx.Provider value={value}>{children}</BreadcrumbCtx.Provider>;
}

// Sayfalarda kullanmak için hook
export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbCtx);
  if (!ctx) throw new Error("useBreadcrumbs must be used within BreadcrumbProvider");
  return ctx;
}
