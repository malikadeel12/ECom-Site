import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { fetchProduct, fetchRelated, fetchProducts, formatPrice } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { Reveal, EASE } from "../components/Reveal";
import { MagneticButton } from "../components/MagneticButton";

const FAQS = [
  { q: "How does purchasing work?", a: "VARA is a curated affiliate house. 'Acquire' takes you to the partner atelier that crafts and fulfills this piece. Your purchase, warranty and delivery are handled by them — our standards are guaranteed either way." },
  { q: "What is the delivery time?", a: "Most partner ateliers dispatch within 48 hours. European delivery arrives in 2–4 business days; worldwide in 5–9. Every piece ships in protective, plastic-free packaging." },
  { q: "Can I return it?", a: "Yes — 30 days, no questions, through the partner atelier. Items must be unworn with original packaging. Personalised pieces are final sale." },
  { q: "Is there a warranty?", a: "Every object in the edit carries at least a 2-year warranty; watches carry 5 years and our bridle-leather wallets are guaranteed for life." },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const { toggle, has } = useWishlist();

  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setVariant(0);
    fetchProduct(slug).then(setProduct).catch(() => {});
    fetchRelated(slug).then(setRelated).catch(() => {});
    try {
      const seen = JSON.parse(localStorage.getItem("vara_recent")) || [];
      const others = seen.filter((s) => s !== slug).slice(0, 3);
      if (others.length) {
        fetchProducts().then((all) => setRecent(all.filter((p) => others.includes(p.slug))));
      } else {
        setRecent([]);
      }
      localStorage.setItem("vara_recent", JSON.stringify([slug, ...others].slice(0, 8)));
    } catch {}
  }, [slug]);

  if (!product) {
    return <div className="flex h-screen items-center justify-center"><p className="overline-label animate-pulse">VARA</p></div>;
  }

  const variants = ["Signature", "Noir", "Sand"];
  const saved = has(product.slug);

  const onAcquire = () => {
    toast(`Taking you to our partner atelier for ${product.name}…`);
    window.open(product.affiliate_url, "_blank", "noopener");
  };

  const onZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ active: true, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div data-testid="product-detail-page" className="pt-[76px]">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <nav className="py-6 text-[0.62rem] uppercase tracking-[0.24em] text-[#7A8164]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#121212]">Home</Link> <span className="mx-2">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#121212]">{product.category}</Link> <span className="mx-2">/</span>
          <span className="text-[#121212]">{product.name}</span>
        </nav>

        <div className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
          {/* GALLERY */}
          <div className="lg:col-span-7">
            <div
              className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-[#EFECE5]"
              onMouseMove={onZoomMove}
              onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
              data-testid="product-main-image"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: zoom.active ? 1.6 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : {}}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              {product.badge && (
                <span className="absolute left-5 top-5 bg-[#F8F6F2] px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] font-semibold">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  data-testid={`gallery-thumb-${i}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`img-hover-zoom aspect-[4/5] w-20 overflow-hidden transition-opacity duration-300 ${activeImg === i ? "ring-1 ring-[#121212] ring-offset-2 ring-offset-[#F8F6F2]" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* STICKY INFO */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[110px]">
              <Reveal y={24}>
                <p className="overline-label">{product.collection} Collection · {product.category}</p>
                <h1 className="font-serif-display mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl" data-testid="product-name">
                  {product.name}
                </h1>
                <p className="font-serif-display mt-2 text-lg italic text-[#7A8164]">{product.tagline}</p>

                <div className="mt-5 flex items-center gap-4">
                  <p className="text-2xl font-light" data-testid="product-detail-price">{formatPrice(product.price)}</p>
                  <span className="flex items-center gap-1.5 text-xs text-[#7A8164]">
                    <Star size={12} className="fill-[#C9A66B] text-[#C9A66B]" />
                    {product.rating} · {product.review_count} reviews
                  </span>
                </div>

                <p className="mt-7 max-w-md text-[0.95rem] font-light leading-relaxed text-[#1C1C1C]/80">
                  {product.description}
                </p>

                <div className="mt-9">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] font-semibold text-[#1C1C1C]">
                    Finish — <span className="text-[#7A8164]">{variants[variant]}</span>
                  </p>
                  <div className="mt-4 flex gap-3">
                    {variants.map((v, i) => (
                      <button
                        key={v}
                        data-testid={`variant-option-${v.toLowerCase()}`}
                        onClick={() => setVariant(i)}
                        className={`px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] border transition-colors duration-300 ${
                          variant === i ? "border-[#121212] bg-[#121212] text-[#F8F6F2]" : "border-[#DAD8D2] text-[#1C1C1C] hover:border-[#121212]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-9 flex items-stretch gap-4">
                  <div className="flex items-center border border-[#DAD8D2]">
                    <button data-testid="qty-decrease" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 transition-colors duration-300 hover:bg-[#F5F2EC]">
                      <Minus size={13} strokeWidth={1.5} />
                    </button>
                    <span data-testid="qty-value" className="w-8 text-center text-sm">{qty}</span>
                    <button data-testid="qty-increase" aria-label="Increase quantity" onClick={() => setQty(qty + 1)} className="px-4 py-3 transition-colors duration-300 hover:bg-[#F5F2EC]">
                      <Plus size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                  <MagneticButton data-testid="acquire-button" onClick={onAcquire} className="btn-primary flex-1">
                    Acquire <ArrowUpRight size={14} strokeWidth={1.5} />
                  </MagneticButton>
                  <button
                    data-testid="detail-wishlist-button"
                    aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => { toggle(product.slug); toast(saved ? "Removed from your wishlist." : "Saved to your wishlist."); }}
                    className="flex w-12 items-center justify-center border border-[#DAD8D2] transition-colors duration-300 hover:border-[#121212]"
                  >
                    <Heart size={16} strokeWidth={1.5} className={saved ? "fill-[#C9A66B] text-[#C9A66B]" : ""} />
                  </button>
                </div>
                <p className="mt-3 text-[0.62rem] uppercase tracking-[0.2em] text-[#7A8164]">
                  Fulfilled by our partner atelier — opens in a new tab
                </p>

                <div className="mt-9 grid grid-cols-3 gap-px border border-[#DAD8D2] bg-[#DAD8D2]">
                  {[{ Icon: Truck, t: "Free shipping", d: "Over $150" }, { Icon: RotateCcw, t: "30-day returns", d: "No questions" }, { Icon: ShieldCheck, t: "Warranty", d: "2–5 years" }].map(({ Icon, t, d }) => (
                    <div key={t} className="bg-[#F8F6F2] p-4 text-center">
                      <Icon size={16} strokeWidth={1.25} className="mx-auto text-[#7A8164]" />
                      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] font-semibold">{t}</p>
                      <p className="text-[0.58rem] text-[#7A8164]">{d}</p>
                    </div>
                  ))}
                </div>

                <Accordion type="single" collapsible className="mt-9">
                  <AccordionItem value="specs" className="border-[#DAD8D2]">
                    <AccordionTrigger data-testid="specs-accordion" className="text-[0.68rem] uppercase tracking-[0.22em] font-semibold hover:no-underline">
                      Specifications
                    </AccordionTrigger>
                    <AccordionContent>
                      <dl className="space-y-3">
                        {product.specs.map((s) => (
                          <div key={s.label} className="flex justify-between text-sm font-light">
                            <dt className="text-[#7A8164]">{s.label}</dt>
                            <dd className="text-[#1C1C1C]">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="materials" className="border-[#DAD8D2]">
                    <AccordionTrigger className="text-[0.68rem] uppercase tracking-[0.22em] font-semibold hover:no-underline">
                      Materials
                    </AccordionTrigger>
                    <AccordionContent className="text-sm font-light leading-relaxed text-[#1C1C1C]/80">
                      {product.materials}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <section className="bg-[#F5F2EC] py-24 md:py-32" aria-label="Product story">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-6 md:px-12 lg:grid-cols-2">
          <Reveal>
            <p className="overline-label">The story</p>
            <h2 className="font-serif-display mt-5 text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
              Behind the {product.name}
            </h2>
            <p className="mt-7 max-w-lg text-base font-light leading-relaxed text-[#1C1C1C]/80">
              {product.story}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="img-hover-zoom aspect-[4/3] lg:ml-12">
            <img src={product.images[1] || product.images[0]} alt={`${product.name} in context`} loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 md:py-32" aria-label="Reviews">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="overline-label">Reviews</p>
              <h2 className="font-serif-display mt-4 text-3xl font-light sm:text-4xl">From those who own it</h2>
            </div>
            <p className="font-serif-display text-6xl font-light">
              {product.rating}<span className="text-2xl text-[#7A8164]"> / 5</span>
            </p>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {product.reviews.map((r, i) => (
              <Reveal key={r.author} delay={i * 0.1} className="border-t border-[#DAD8D2] pt-8">
                <div className="flex gap-1 text-[#C9A66B]">
                  {[...Array(r.rating)].map((_, s) => <Star key={s} size={11} className="fill-current" />)}
                </div>
                <h3 className="font-serif-display mt-4 text-xl font-medium">{r.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#1C1C1C]/75">{r.text}</p>
                <p className="mt-5 text-[0.62rem] uppercase tracking-[0.22em] text-[#7A8164] font-semibold">{r.author} · {r.date}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#DAD8D2] py-24 md:py-32" aria-label="FAQ">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-6 md:px-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="overline-label">Good to know</p>
            <h2 className="font-serif-display mt-4 text-3xl font-light sm:text-4xl">Questions,<br /><em>answered.</em></h2>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible data-testid="faq-accordion">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-[#DAD8D2]">
                  <AccordionTrigger className="font-serif-display py-6 text-left text-xl font-normal hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-xl text-sm font-light leading-relaxed text-[#1C1C1C]/75">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-[#F5F2EC] py-24 md:py-32" aria-label="Related products">
          <div className="mx-auto max-w-[1500px] px-6 md:px-12">
            <Reveal>
              <p className="overline-label">Continue the edit</p>
              <h2 className="font-serif-display mt-4 text-3xl font-light sm:text-4xl">You may also consider</h2>
            </Reveal>
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <section className="py-24" aria-label="Recently viewed">
          <div className="mx-auto max-w-[1500px] px-6 md:px-12">
            <Reveal>
              <p className="overline-label">Recently viewed</p>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
