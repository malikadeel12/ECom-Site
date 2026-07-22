import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Menu, X, ArrowRight } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { fetchProducts, formatPrice } from "../../lib/api";
import { EASE } from "../Reveal";

const NAV = [
  { label: "Shop", to: "/shop" },
  { label: "Watches", to: "/shop?category=Watches" },
  { label: "Bags", to: "/shop?category=Bags" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [all, setAll] = useState([]);
  const { items } = useWishlist();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && all.length === 0) fetchProducts().then(setAll).catch(() => {});
  }, [searchOpen, all.length]);

  useEffect(() => {
    if (!query.trim()) return setResults([]);
    const q = query.toLowerCase();
    setResults(all.filter((p) => `${p.name} ${p.category} ${p.collection}`.toLowerCase().includes(q)).slice(0, 5));
  }, [query, all]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      <header
        data-testid="main-header"
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#DAD8D2]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-6 md:px-12">
          <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
            {NAV.slice(0, 3).map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                data-testid={`nav-link-${n.label.toLowerCase()}`}
                className={`link-underline text-[0.7rem] uppercase tracking-[0.24em] font-medium transition-colors duration-300 ${
                  solid || isHome ? (solid ? "text-[#1C1C1C]" : "text-[#F8F6F2]") : "text-[#1C1C1C]"
                }`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <button
            data-testid="mobile-menu-button"
            aria-label="Open menu"
            className={`lg:hidden ${solid ? "text-[#1C1C1C]" : "text-[#F8F6F2]"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>

          <Link
            to="/"
            data-testid="header-logo"
            aria-label="VARA home"
            className={`absolute left-1/2 -translate-x-1/2 font-serif-display text-[1.7rem] tracking-[0.42em] font-medium pl-2 transition-colors duration-500 ${
              solid ? "text-[#121212]" : "text-[#F8F6F2]"
            }`}
          >
            VARA
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-9" aria-label="Secondary">
              {NAV.slice(3).map((n) => (
                <NavLink
                  key={n.label}
                  to={n.to}
                  data-testid={`nav-link-${n.label.toLowerCase()}`}
                  className={`link-underline text-[0.7rem] uppercase tracking-[0.24em] font-medium transition-colors duration-300 ${
                    solid ? "text-[#1C1C1C]" : "text-[#F8F6F2]"
                  }`}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <button
              data-testid="search-open-button"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
              className={`transition-colors duration-300 hover:opacity-60 ${solid ? "text-[#1C1C1C]" : "text-[#F8F6F2]"}`}
            >
              <Search size={18} strokeWidth={1.25} />
            </button>
            <Link
              to="/wishlist"
              data-testid="wishlist-header-link"
              aria-label="Wishlist"
              className={`relative transition-colors duration-300 hover:opacity-60 ${solid ? "text-[#1C1C1C]" : "text-[#F8F6F2]"}`}
            >
              <Heart size={18} strokeWidth={1.25} />
              {items.length > 0 && (
                <span
                  data-testid="wishlist-count"
                  className="absolute -right-2.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A66B] text-[0.55rem] font-semibold text-[#121212]"
                >
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 bg-[#F8F6F2] pt-[76px] lg:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-8 pb-24" aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: EASE }}
                >
                  <Link
                    to={n.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif-display block py-3 text-5xl font-light text-[#121212]"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="overline-label mt-10"
              >
                Objects of intention
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            data-testid="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[60] bg-[#F8F6F2]/97 backdrop-blur-sm"
          >
            <div className="mx-auto max-w-3xl px-6 pt-32">
              <button
                data-testid="search-close-button"
                aria-label="Close search"
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="absolute right-8 top-8 text-[#1C1C1C] transition-transform duration-300 hover:rotate-90"
              >
                <X size={26} strokeWidth={1} />
              </button>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              >
                <p className="overline-label mb-6">Search products</p>
                <input
                  data-testid="search-input"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Fashion, electronics, home…"
                  className="input-line font-serif-display text-4xl md:text-5xl font-light"
                />
              </motion.div>
              <div className="mt-10 space-y-1">
                {results.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  >
                    <Link
                      to={`/product/${p.slug}`}
                      data-testid={`search-result-${p.slug}`}
                      className="group flex items-center justify-between border-b border-[#DAD8D2] py-5"
                    >
                      <div className="flex items-center gap-5">
                        <img src={p.images[0]} alt={p.name} className="h-14 w-11 object-cover" />
                        <div>
                          <p className="font-serif-display text-xl text-[#121212]">{p.name}</p>
                          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[#7A8164]">{p.category}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-3 text-sm text-[#1C1C1C]">
                        {formatPrice(p.price)}
                        <ArrowRight size={14} strokeWidth={1.25} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
                {query && results.length === 0 && (
                  <p className="py-6 text-sm text-[#7A8164]">Nothing found — try “watch” or “leather”.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
