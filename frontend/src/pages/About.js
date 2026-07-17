import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, MaskReveal } from "../components/Reveal";

const IMG_HERO = "https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwbHV4dXJ5fGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85";
const IMG_CRAFT = "https://images.unsplash.com/photo-1620109176813-e91290f6c795?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsZWF0aGVyJTIwd2FsbGV0JTIwbWluaW1hbHxlbnwwfHx8fDE3ODQyNDkwNTJ8MA&ixlib=rb-4.1.0&q=85";
const IMG_FOUNDER = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600";
const IMG_ATELIER = "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200";

const TIMELINE = [
  { year: "2021", title: "A drawer full of regret", text: "Our founder counted forty-one accessories she owned and three she loved. VARA began as a question: what if a brand only sold the three?" },
  { year: "2022", title: "The first sixteen", text: "One year, four countries, eleven rejected tanneries. The founding edit of sixteen objects launched from a studio above a bakery in Lisbon." },
  { year: "2023", title: "The lifetime guarantee", text: "Our bridle-leather wallets became the first pieces guaranteed for life. Repairs done free, forever. Nobody has needed one yet." },
  { year: "2024", title: "One in, one out", text: "We formalised the rule: the edit never grows. A new object enters only when an existing one retires with honour." },
  { year: "2026", title: "The house today", text: "Sixteen objects, six categories, ateliers across Italy, Japan and Switzerland — and a waiting list we refuse to rush." },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div data-testid="about-page">
      {/* HERO */}
      <section ref={heroRef} className="relative flex h-[92vh] items-end overflow-hidden bg-[#121212]">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={IMG_HERO} alt="The VARA house" className="h-[115%] w-full object-cover" />
          <div className="absolute inset-0 bg-[#121212]/40" />
        </motion.div>
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-24 md:px-12">
          <p className="overline-label !text-[#D7C3A5]">The House of VARA</p>
          <h1 className="font-serif-display mt-6 text-5xl font-light leading-[0.95] text-[#F8F6F2] sm:text-6xl lg:text-8xl">
            <MaskReveal delay={0.3}>Less, made</MaskReveal><br />
            <MaskReveal delay={0.5}><em>impossibly well.</em></MaskReveal>
          </h1>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <p className="overline-label">The manifesto</p>
            </Reveal>
            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal>
                <p className="font-serif-display text-3xl font-light leading-snug text-[#121212] sm:text-4xl lg:text-[2.75rem]">
                  The world does not need another accessories brand. It needs
                  fewer, better objects — and someone willing to say
                  <em className="text-[#7A8164]"> no</em> to everything else.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-10 max-w-xl text-base font-light leading-relaxed text-[#1C1C1C]/75">
                  VARA is a curated house, not a factory. We design, prototype and
                  obsess; our partner ateliers — third-generation workshops in
                  Tuscany, Vicenza, Geneva and Sabae — craft and fulfill. This
                  affiliate model keeps our edit honest: we only earn when
                  something is good enough for you to keep forever.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-[#F5F2EC] py-24 md:py-36" aria-label="Timeline">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <Reveal>
            <p className="overline-label">The years</p>
            <h2 className="font-serif-display mt-5 text-4xl font-light sm:text-5xl">A short history<br />of saying no.</h2>
          </Reveal>
          <div className="mt-20">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={0.05 * i}>
                <div className="grid gap-4 border-t border-[#DAD8D2] py-10 md:grid-cols-12 md:items-baseline">
                  <p className="font-serif-display text-5xl font-light text-[#C9A66B] md:col-span-3">{t.year}</p>
                  <h3 className="font-serif-display text-2xl font-medium md:col-span-4">{t.title}</h3>
                  <p className="max-w-md text-sm font-light leading-relaxed text-[#1C1C1C]/75 md:col-span-5">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP — alternating */}
      <section className="py-24 md:py-36" aria-label="Craftsmanship">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="img-hover-zoom aspect-[4/5] max-w-lg">
              <img src={IMG_CRAFT} alt="Hand-stitched leather" loading="lazy" className="h-full w-full object-cover" />
            </Reveal>
            <div>
              <Reveal>
                <p className="overline-label">Craft</p>
                <h2 className="font-serif-display mt-5 text-4xl font-light leading-tight sm:text-5xl">
                  Machines are faster.<br /><em>Hands are honest.</em>
                </h2>
                <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[#1C1C1C]/75">
                  Saddle stitching takes four times longer than machine stitching
                  and lasts four times longer. Vegetable tanning takes forty days
                  instead of three. We choose the slow option every time — not
                  from nostalgia, but from arithmetic.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-12 grid grid-cols-3 gap-8">
                {[["11h", "per object"], ["40", "days of tanning"], ["0", "shortcuts taken"]].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-serif-display text-4xl font-light text-[#121212]">{n}</p>
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-[#7A8164]">{l}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>

          <div className="mt-28 grid items-center gap-14 lg:grid-cols-2">
            <div className="lg:order-2 lg:justify-self-end">
              <Reveal className="img-hover-zoom aspect-[4/5] max-w-lg">
                <img src={IMG_FOUNDER} alt="Founder of VARA" loading="lazy" className="h-full w-full object-cover" />
              </Reveal>
            </div>
            <div className="lg:order-1">
              <Reveal>
                <p className="overline-label">The founder</p>
                <h2 className="font-serif-display mt-5 text-4xl font-light leading-tight sm:text-5xl">
                  “I wanted a brand<br />that would tell me <em>no</em>.”
                </h2>
                <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[#1C1C1C]/75">
                  Amara Valette spent nine years as a buyer for European luxury
                  houses, watching beautiful things get replaced by newer beautiful
                  things. VARA is her answer — a house where the catalogue is a
                  promise, not a feed. Where the best thing we can tell a customer
                  is: you already own enough.
                </p>
                <p className="mt-6 font-serif-display text-xl italic text-[#7A8164]">— Amara Valette, Founder</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#2D3B34] py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-6 text-center md:px-12">
          <Reveal>
            <p className="overline-label !text-[#D7C3A5]">The edit awaits</p>
            <h2 className="font-serif-display mx-auto mt-6 max-w-3xl text-4xl font-light leading-tight text-[#F8F6F2] sm:text-5xl lg:text-6xl">
              Sixteen objects. One of them is probably yours.
            </h2>
            <Link to="/shop" data-testid="about-cta-shop" className="btn-light mt-12">
              Enter the edit <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
        <img src={IMG_ATELIER} alt="" aria-hidden="true" className="absolute -right-20 top-1/2 hidden w-72 -translate-y-1/2 opacity-20 lg:block" />
      </section>
    </div>
  );
}
