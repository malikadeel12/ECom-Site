import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, MaskReveal } from "../components/Reveal";

const IMG_HERO = "https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwbHV4dXJ5fGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85";

const PROCESS = [
  { n: "01", title: "Browse", text: "Explore products across the available categories." },
  { n: "02", title: "Discover", text: "Review selected products and find an option that suits your needs." },
  { n: "03", title: "Visit the Seller", text: "Click the product link to open the relevant marketplace or seller website." },
  { n: "04", title: "Purchase Securely", text: "Complete the purchase directly through the external platform." },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div data-testid="about-page">
      <section ref={heroRef} className="relative flex h-[92vh] items-end overflow-hidden bg-[#121212]">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={IMG_HERO} alt="Curated product discovery" className="h-[115%] w-full object-cover" />
          <div className="absolute inset-0 bg-[#121212]/40" />
        </motion.div>
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-24 md:px-12">
          <p className="overline-label !text-[#D7C3A5]">About the platform</p>
          <h1 className="font-serif-display mt-6 text-5xl font-light leading-[0.95] text-[#F8F6F2] sm:text-6xl lg:text-8xl">
            <MaskReveal delay={0.3}>Discover more.</MaskReveal><br />
            <MaskReveal delay={0.5}><em>Search less.</em></MaskReveal>
          </h1>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-[#F8F6F2]/75">
            We bring selected products from external marketplaces together in one place, helping visitors compare useful options and choose where to buy.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F2EC] py-24 md:py-36" aria-label="How it works">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal>
            <p className="overline-label">How it works</p>
            <h2 className="font-serif-display mt-5 max-w-3xl text-4xl font-light leading-tight sm:text-5xl">
              Simple product discovery, from search to purchase
            </h2>
            <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-[#1C1C1C]/75">
              We research and organize products across different categories to make them easier to discover.
            </p>
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[#1C1C1C]/75">
              Visitors can browse the available recommendations, select a product, and follow the provided link to the relevant external marketplace. Product availability, pricing, shipping, returns, payment processing, and order fulfilment are managed by the external seller or marketplace.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-px bg-[#DAD8D2] sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.1} className="bg-[#F5F2EC] p-10">
                <p className="font-serif-display text-2xl font-light text-[#C9A66B]">{item.n}</p>
                <h3 className="mt-6 text-base font-medium tracking-wide">{item.title}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-[#1C1C1C]/65">{item.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Link to="/shop" data-testid="about-cta-shop" className="btn-primary mt-12">
              Explore products <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
