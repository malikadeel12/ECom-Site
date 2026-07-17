import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts, fetchCategories } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { Reveal, EASE } from "../components/Reveal";

const SORTS = [
  { key: "curated", label: "Curated" },
  { key: "price_asc", label: "Price, low → high" },
  { key: "price_desc", label: "Price, high → low" },
  { key: "rating", label: "Top rated" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("curated");
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "All";

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = active === "All" ? [...products] : products.filter((p) => (p.category || "") === active);
    if (sort === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, active, sort]);

  return (
    <div data-testid="shop-page" className="pt-[76px]">
      <section className="border-b border-[#DAD8D2] py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal>
            <p className="overline-label">The complete edit</p>
            <h1 className="font-serif-display mt-5 text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
              {active === "All" ? "Sixteen objects." : active + "."}
              <em className="block text-[#7A8164]">Nothing more.</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-[76px] z-30 border-b border-[#DAD8D2] bg-[#F8F6F2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-12">
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Category filter">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                data-testid={`category-filter-${c.toLowerCase()}`}
                onClick={() => (c === "All" ? setParams({}) : setParams({ category: c }))}
                className={`link-underline text-[0.68rem] uppercase tracking-[0.22em] font-medium transition-colors duration-300 ${
                  active === c ? "active text-[#121212]" : "text-[#7A8164] hover:text-[#121212]"
                }`}
              >
                {c}
              </button>
            ))}
          </nav>
          <select
            data-testid="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="cursor-pointer bg-transparent text-[0.68rem] uppercase tracking-[0.22em] font-medium text-[#1C1C1C] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <motion.p
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            data-testid="shop-result-count"
            className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7A8164]"
          >
            {filtered.length} {filtered.length === 1 ? "object" : "objects"}
          </motion.p>
          <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div key={p.slug} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
