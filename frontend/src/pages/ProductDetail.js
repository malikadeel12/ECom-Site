/**
 * Change summary
 * What: Product page now uses the multi-image / video gallery.
 * Why: Admin can save several photos and videos; they must display with the right shape.
 * Related: ProductMediaGallery.js, productMedia.js, brand.js
 */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUpRight, Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { fetchProduct, fetchRelated, fetchCatalogProducts, formatPrice } from "../lib/api";
import { buildProductGallery, getProductImages } from "../lib/productMedia";
import { SITE_NAME } from "../lib/brand";
import { ProductCard } from "../components/ProductCard";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { useWishlist } from "../context/WishlistContext";
import { Reveal } from "../components/Reveal";
import { MagneticButton } from "../components/MagneticButton";

const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect fill='%23EFECE5' width='400' height='500'/%3E%3C/svg%3E";

const FAQS = [
  { q: "How does purchasing work?", a: "Select 'Visit seller' to open the external marketplace. Payment and order processing take place on that platform." },
  { q: "What is the delivery time?", a: "Delivery estimates are set by the external seller or marketplace. Check the seller's listing for current shipping information." },
  { q: "Can I return it?", a: "Returns and refunds are managed by the external seller or marketplace according to its own policies." },
  { q: "Is there a warranty?", a: "Any warranty is provided by the product manufacturer, seller, or marketplace. Review the external listing before purchasing." },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [related, setRelated] = useState([]);
  const [recent, setRecent] = useState([]);
  const { toggle, has } = useWishlist();

  useEffect(() => {
    setLoaded(false);
    fetchProduct(slug)
      .then((next) => setProduct(next))
      .catch(() => setProduct(null))
      .finally(() => setLoaded(true));
    fetchRelated(slug).then(setRelated).catch(() => {});
    try {
      const seen = JSON.parse(localStorage.getItem("bysmart_recent") || localStorage.getItem("vara_recent")) || [];
      const others = seen.filter((s) => s !== slug).slice(0, 3);
      if (others.length) {
        fetchCatalogProducts().then((all) => setRecent(all.filter((p) => others.includes(p.slug))));
      } else {
        setRecent([]);
      }
      localStorage.setItem("bysmart_recent", JSON.stringify([slug, ...others].slice(0, 8)));
    } catch {}
  }, [slug]);

  if (!loaded) {
    return <div className="flex h-screen items-center justify-center"><p className="overline-label animate-pulse">{SITE_NAME}</p></div>;
  }

  if (!product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-serif-display text-4xl font-light">This product is no longer listed.</p>
        <Link to="/shop" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const saved = has(product.slug);

  const specs = product.specs || [];
  const materials = product.materials || "";
  const tagline = product.tagline || "";
  const collection = product.collection || "";
  const category = product.category || "";
  const description = product.description || "A selected product available from an external seller. Visit the marketplace listing for current product details before making a purchase.";
  const price = product.price || 0;
  const affiliateUrl = product.affiliate_url || "#";
  const images = getProductImages(product);
  const gallery = buildProductGallery(product);

  const onAcquire = () => {
    toast(`Opening the external seller for ${product.name}…`);
    const link = document.createElement("a");
    link.href = affiliateUrl;
    link.target = "_blank";
    link.rel = "nofollow sponsored noopener noreferrer";
    link.click();
  };

  return (
    <div data-testid="product-detail-page" className="pt-[76px]">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <nav className="py-6 text-[0.62rem] uppercase tracking-[0.24em] text-[#7A8164]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#121212]">Home</Link> <span className="mx-2">/</span>
          <Link to={`/shop?category=${encodeURIComponent(category)}`} className="hover:text-[#121212]">{category}</Link> <span className="mx-2">/</span>
          <span className="text-[#121212]">{product.name}</span>
        </nav>

        <div className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
          <ProductMediaGallery key={product.slug} product={product} gallery={gallery} />

          {/* STICKY INFO */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[110px]">
<Reveal y={24}>
                <p className="overline-label">{collection} · {category}</p>
                <h1 className="font-serif-display mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl" data-testid="product-name">
                  {product.name}
                </h1>
                <p className="font-serif-display mt-2 text-lg italic text-[#7A8164]">{tagline}</p>

                <div className="mt-5 flex items-center gap-4">
                  <p className="text-2xl font-light" data-testid="product-detail-price">{formatPrice(price)}</p>
                  <span className="text-xs text-[#7A8164]">Current details on seller website</span>
                </div>

                <p className="mt-7 max-w-md text-[0.95rem] font-light leading-relaxed text-[#1C1C1C]/80">
                  {description}
                </p>

                <div className="mt-9 flex items-stretch gap-4">
                  <MagneticButton data-testid="acquire-button" onClick={onAcquire} className="btn-primary flex-1">
                  Visit seller <ArrowUpRight size={14} strokeWidth={1.5} />
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
                  Opens the external seller or marketplace in a new tab
                </p>

                <div className="mt-9 grid grid-cols-3 gap-px border border-[#DAD8D2] bg-[#DAD8D2]">
                  {[{ Icon: Truck, t: "Shipping", d: "Seller managed" }, { Icon: RotateCcw, t: "Returns", d: "Seller policy" }, { Icon: ShieldCheck, t: "Payment", d: "External platform" }].map(({ Icon, t, d }) => (
                    <div key={t} className="bg-[#F8F6F2] p-4 text-center">
                      <Icon size={16} strokeWidth={1.25} className="mx-auto text-[#7A8164]" />
                      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] font-semibold">{t}</p>
                      <p className="text-[0.58rem] text-[#7A8164]">{d}</p>
                    </div>
                  ))}
                </div>

                {(specs.length > 0 || materials) && (
                  <Accordion type="single" collapsible className="mt-9">
                    {specs.length > 0 && (
                      <AccordionItem value="specs" className="border-[#DAD8D2]">
                        <AccordionTrigger data-testid="specs-accordion" className="text-[0.68rem] uppercase tracking-[0.22em] font-semibold hover:no-underline">
                          Specifications
                        </AccordionTrigger>
                        <AccordionContent>
                          <dl className="space-y-3">
                            {specs.map((s) => (
                              <div key={s.label} className="flex justify-between text-sm font-light">
                                <dt className="text-[#7A8164]">{s.label}</dt>
                                <dd className="text-[#1C1C1C]">{s.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {materials && (
                      <AccordionItem value="materials" className="border-[#DAD8D2]">
                        <AccordionTrigger className="text-[0.68rem] uppercase tracking-[0.22em] font-semibold hover:no-underline">
                          Materials
                        </AccordionTrigger>
                        <AccordionContent className="text-sm font-light leading-relaxed text-[#1C1C1C]/80">
                          {materials}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT INFORMATION */}
      <section className="bg-[#F5F2EC] py-24 md:py-32" aria-label="Product story">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-6 md:px-12 lg:grid-cols-2">
          <Reveal>
            <p className="overline-label">Product information</p>
            <h2 className="font-serif-display mt-5 text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
              About the {product.name}
            </h2>
            <p className="mt-7 max-w-lg text-base font-light leading-relaxed text-[#1C1C1C]/80">
              {description}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="img-hover-zoom aspect-[4/3] lg:ml-12">
            <img src={images[1] || images[0] || placeholderImg} alt={`${product.name} in context`} loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
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
