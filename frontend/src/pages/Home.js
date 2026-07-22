import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getHomeFeatured, getHomeBestsellers } from "../lib/homeShowcase";
import { ProductCard } from "../components/ProductCard";
import { Reveal, MaskReveal, EASE } from "../components/Reveal";

const HERO_IMG = "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1920";
const STORY_IMG = "https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwbHV4dXJ5fGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85";
const LIFESTYLE_IMG = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1920";

const TESTIMONIALS = [
  "Finding useful products is much easier when the best options are already organized in one place.",
  "I discovered several products here that I would not have found through normal marketplace searches.",
  "A simple and convenient platform for browsing product recommendations across different categories.",
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800", tag: "#theMeridian" },
  { src: "https://images.unsplash.com/photo-1664076423411-e570cfdfcbed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBzdW5nbGFzc2VzJTIwZWRpdG9yaWFsfGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85", tag: "#obsidianHours" },
  { src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwaGFuZGJhZyUyMG1pbmltYWx8ZW58MHx8fHwxNzg0MjQ5MDMzfDA&ixlib=rb-4.1.0&q=85", tag: "#marlowInTuscany" },
  { src: "https://images.unsplash.com/photo-1623279743107-152e86999257?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxnb2xkJTIwamV3ZWxyeSUyMG1pbmltYWxpc3R8ZW58MHx8fHwxNzg0MjQ5MDMzfDA&ixlib=rb-4.1.0&q=85", tag: "#circleOfLight" },
  { src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800", tag: "#noirDays" },
  { src: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsZWF0aGVyJTIwd2FsbGV0JTIwbWluaW1hbHxlbnwwfHx8fDE3ODQyNDkwNTJ8MA&ixlib=rb-4.1.0&q=85", tag: "#everydayLedger" },
];

export default function Home() {
  const featured = getHomeFeatured();
  const bestsellers = getHomeBestsellers();
  const heroRef = useRef(null);
  const lifestyleRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const { scrollYProgress: lsProgress } = useScroll({ target: lifestyleRef, offset: ["start end", "end start"] });
  const lsY = useTransform(lsProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen overflow-hidden bg-[#121212]" aria-label="Hero">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={HERO_IMG} alt="VARA lifestyle editorial" className="h-[115%] w-full object-cover" />
          <div className="absolute inset-0 bg-[#121212]/35" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              className="overline-label !text-[#D7C3A5]"
            >
              Discover quality products
            </motion.p>
            <h1 className="font-serif-display mt-6 text-5xl font-light leading-[0.95] tracking-tight text-[#F8F6F2] sm:text-6xl lg:text-[6.5rem]">
              <MaskReveal delay={0.5}>Shop Smarter.</MaskReveal>
              <br />
              <MaskReveal delay={0.7}>
                <em className="font-light">Choose Better.</em>
              </MaskReveal>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: EASE }}
              className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"
            >
              <Link to="/shop" data-testid="hero-cta-shop" className="btn-light w-fit">
                Explore products <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <p className="max-w-xs text-sm font-light leading-relaxed text-[#F8F6F2]/70">
                Carefully selected products across multiple categories, helping you discover useful options without spending hours searching online.
              </p>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 right-8 hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[#F8F6F2]/60 md:flex"
        >
          Scroll
          <span className="block h-px w-12 bg-[#F8F6F2]/40" />
        </motion.div>
      </section>

      {/* FEATURED COLLECTION — asymmetric editorial */}
      <section className="py-24 md:py-36" aria-label="Featured products">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <p className="overline-label">Featured products</p>
              <h2 className="font-serif-display mt-5 max-w-xl text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Finding the right product<br />should feel simple.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <Link to="/shop" data-testid="featured-view-all" className="link-underline flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] font-medium">
                View all products <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>

          {featured.length > 0 && (
            <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
              <div className="md:col-span-7">
                <ProductCard product={featured[0]} index={0} tall />
              </div>
              <div className="md:col-span-4 md:col-start-9 md:mt-32">
                {featured[1] && <ProductCard product={featured[1]} index={1} />}
              </div>
              <div className="md:col-span-4 md:col-start-2 md:-mt-10">
                {featured[2] && <ProductCard product={featured[2]} index={2} />}
              </div>
              <div className="md:col-span-5 md:col-start-7 md:mt-20">
                {featured[3] && <ProductCard product={featured[3]} index={3} tall />}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-[#F5F2EC] py-24 md:py-40" aria-label="Brand story">
        <div className="mx-auto grid max-w-[1500px] items-center gap-16 px-6 md:px-12 lg:grid-cols-2 lg:gap-8">
          <Reveal className="relative lg:pr-16">
            <div className="img-hover-zoom aspect-[4/5] max-w-xl">
              <img src={STORY_IMG} alt="Curated product discovery" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-2 hidden bg-[#121212] px-8 py-7 lg:block">
              <p className="font-serif-display text-4xl font-light text-[#F8F6F2]">11<span className="text-[#C9A66B]">h</span></p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.24em] text-[#F8F6F2]/60">per object, by hand</p>
            </div>
          </Reveal>
          <div className="lg:pl-8">
            <Reveal>
              <p className="overline-label">About the platform</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif-display mt-6 text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                We do not sell products.<br />
                <em>We help you find the right ones.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-[#1C1C1C]/75">
                We bring together carefully selected products from trusted online marketplaces so visitors can explore useful options in one place.
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#1C1C1C]/75">
                Instead of browsing through thousands of listings, users can discover recommended products across different categories and then visit the official seller or marketplace to complete their purchase.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link to="/about" data-testid="story-cta-about" className="btn-ghost mt-10">
                Learn more <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BEST SELLERS — horizontal scroll */}
      <section className="py-24 md:py-36" aria-label="Best sellers">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="overline-label">Popular recommendations</p>
              <h2 className="font-serif-display mt-5 text-4xl font-light tracking-tight sm:text-5xl">
                Products worth discovering
              </h2>
            </div>
          </Reveal>
        </div>
        <div className="mt-14 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max gap-8 px-6 md:px-12">
            {bestsellers.map((p, i) => (
              <div key={p.slug} className="w-[75vw] sm:w-[42vw] lg:w-[26vw]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIFESTYLE PARALLAX */}
      <section ref={lifestyleRef} className="relative h-[80vh] overflow-hidden" aria-label="Lifestyle">
        <motion.div style={{ y: lsY }} className="absolute inset-0 -top-[12%] h-[124%]">
          <img src={LIFESTYLE_IMG} alt="VARA worn in the city" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#121212]/30" />
        </motion.div>
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <Reveal>
              <p className="overline-label !text-[#D7C3A5]">Discover. Compare. Choose.</p>
              <h2 className="font-serif-display mt-6 max-w-2xl text-4xl font-light leading-tight text-[#F8F6F2] sm:text-5xl lg:text-7xl">
                Your next great find<br />starts here.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY VARA */}
      <section className="bg-[#2D3B34] py-24 text-[#F8F6F2] md:py-36" aria-label="Why VARA">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal>
            <p className="overline-label !text-[#D7C3A5]">Why use this platform</p>
            <h2 className="font-serif-display mt-5 max-w-2xl text-4xl font-light leading-tight sm:text-5xl">
              A simpler way to discover products
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-px bg-[#F8F6F2]/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Carefully Selected", d: "Products are reviewed and selected to help visitors find useful and relevant options more easily." },
              { n: "02", t: "Multiple Categories", d: "Discover products across electronics, fashion, home, accessories, lifestyle, and other categories." },
              { n: "03", t: "Trusted Marketplaces", d: "Each product links to an external seller or marketplace where visitors can review the full details and complete their purchase." },
              { n: "04", t: "Easy to Explore", d: "The website provides a simple and organized way to browse product recommendations without unnecessary searching." },
            ].map((f, i) => (
              <Reveal key={f.n} delay={i * 0.1} className="bg-[#2D3B34] p-10">
                <p className="font-serif-display text-2xl font-light text-[#C9A66B]">{f.n}</p>
                <h3 className="mt-6 text-base font-medium tracking-wide">{f.t}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-[#F8F6F2]/60">{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-36" aria-label="Testimonials">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal className="text-left">
            <p className="overline-label">What Visitors Can Expect</p>
          </Reveal>
          <div className="mt-14 grid gap-14 lg:grid-cols-3 lg:gap-10">
            {TESTIMONIALS.map((statement, i) => (
              <Reveal key={statement} delay={i * 0.12} className={i === 1 ? "lg:mt-20" : i === 2 ? "lg:mt-40" : ""}>
                <p className="font-serif-display mt-6 text-2xl font-light leading-snug text-[#121212] lg:text-3xl">
                  {statement}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="pb-24 md:pb-36" aria-label="Gallery">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal className="flex items-end justify-between">
            <h2 className="font-serif-display text-3xl font-light tracking-tight sm:text-4xl">Featured finds</h2>
            <p className="overline-label">Explore more recommendations</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 px-2 md:grid-cols-6">
          {GALLERY.map((g, i) => (
            <Reveal key={g.tag} delay={(i % 6) * 0.06} className="img-hover-zoom group relative aspect-square">
              <img src={g.src} alt={g.tag} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-end bg-[#121212]/0 p-4 opacity-0 transition-opacity duration-500 group-hover:bg-[#121212]/40 group-hover:opacity-100">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#F8F6F2]">{g.tag}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
