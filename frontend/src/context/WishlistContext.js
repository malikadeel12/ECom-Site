import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vara_wishlist")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("vara_wishlist", JSON.stringify(items));
  }, [items]);

  const toggle = (slug) =>
    setItems((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const has = (slug) => items.includes(slug);

  return (
    <WishlistContext.Provider value={{ items, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
