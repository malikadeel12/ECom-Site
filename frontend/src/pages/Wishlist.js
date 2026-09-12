import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchCatalogProducts } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { Reveal } from "../components/Reveal";

export default function Wishlist() {
  const { items } = useWishlist();
  const [all, setAll] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchCatalogProducts()
      .then((data) => setAll(Array.isArray(data) ? data : []))
      .catch(() => setAll([]))
      .finally(() => setReady(true));
  }, []);

  const saved = all.filter((p) => items.includes(p.slug));

  return (
    <div data-testid="wishlist-page" className="pt-[76px]">
      <section className="border-b border-[#DAD8D2] py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal>
            <p className="overline-label">Your shortlist</p>
            <h1 className="font-serif-display mt-5 text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
              Saved, <em className="text-[#7A8164]">for now.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[#1C1C1C]/70">
              The best purchases wait a week in a wishlist first. Take your time —
              the edit isn't going anywhere.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          {!ready ? (
            <p className="overline-label">Loading your shortlist…</p>
          ) : saved.length > 0 ? (
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          ) : (
            <Reveal className="py-16 text-center" data-testid="wishlist-empty-state">
              <p className="font-serif-display text-3xl font-light italic text-[#7A8164]">
                {items.length
                  ? "Those saved items are no longer listed."
                  : "Nothing saved yet — a rare kind of discipline."}
              </p>
              <Link to="/shop" data-testid="wishlist-empty-cta" className="btn-ghost mt-10">
                Browse the edit <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
