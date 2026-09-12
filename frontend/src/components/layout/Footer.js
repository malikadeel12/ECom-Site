import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "../../lib/api";
import { SITE_NAME, SITE_NAME_UPPER } from "../../lib/brand";
import { Reveal } from "../Reveal";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return toast("Please enter a valid email.");
    setBusy(true);
    try {
      await subscribeNewsletter(email);
      toast("Subscribed. We will share occasional product discoveries and updates.");
      setEmail("");
    } catch {
      toast("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer data-testid="main-footer" className="bg-[#121212] text-[#F8F6F2]">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-16 border-b border-[#F8F6F2]/10 py-24 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="overline-label !text-[#C9A66B]">Product updates</p>
            <h2 className="font-serif-display mt-6 text-4xl font-light leading-tight sm:text-5xl">
              Useful finds.<br />Occasional emails.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#F8F6F2]/60">
              Occasional product recommendations, category updates, and useful finds from external marketplaces.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="flex items-end">
            <form onSubmit={onSubscribe} className="w-full" data-testid="newsletter-form">
              <div className="flex items-end gap-4 border-b border-[#F8F6F2]/25 pb-3 transition-colors duration-500 focus-within:border-[#C9A66B]">
                <input
                  data-testid="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent text-lg font-light text-[#F8F6F2] outline-none placeholder:text-[#F8F6F2]/35"
                />
                <button
                  data-testid="newsletter-submit-button"
                  type="submit"
                  disabled={busy}
                  aria-label="Subscribe"
                  className="group flex items-center gap-2 pb-1 text-[0.68rem] uppercase tracking-[0.24em] text-[#C9A66B]"
                >
                  {busy ? "…" : "Join"}
                  <ArrowRight size={14} strokeWidth={1.25} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>

        <div className="grid gap-12 py-20 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="max-w-xs text-sm font-light leading-relaxed text-[#F8F6F2]/55">
              {SITE_NAME} helps visitors discover selected products and then connects them with the relevant external seller or marketplace.
            </p>
            <div className="mt-8 flex gap-6">
              {[{ Icon: Instagram, label: "Instagram" }, { Icon: Twitter, label: "Twitter" }, { Icon: Youtube, label: "YouTube" }].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  data-testid={`footer-social-${label.toLowerCase()}`}
                  className="text-[#F8F6F2]/50 transition-colors duration-300 hover:text-[#C9A66B]"
                >
                  <Icon size={18} strokeWidth={1.25} />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer shop">
            <p className="overline-label !text-[#F8F6F2]/40">Explore</p>
            <ul className="mt-6 space-y-3.5 text-sm font-light">
              {[["All products", "/shop"], ["Watches", "/shop?category=Watches"], ["Bags", "/shop?category=Bags%20%26%20Luggage"], ["Jewelry", "/shop?category=Jewelry%20%26%20Accessories"], ["Wishlist", "/wishlist"]].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="link-underline text-[#F8F6F2]/70 hover:text-[#F8F6F2]">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer house">
            <p className="overline-label !text-[#F8F6F2]/40">Information</p>
            <ul className="mt-6 space-y-3.5 text-sm font-light">
              {[["About", "/about"], ["How it works", "/about"], ["Contact", "/contact"], ["Privacy", "/contact"], ["Terms", "/contact"]].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="link-underline text-[#F8F6F2]/70 hover:text-[#F8F6F2]">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="overflow-hidden border-t border-[#F8F6F2]/10">
        <Reveal y={60}>
          <p className="font-serif-display select-none text-center text-[14vw] font-light leading-[0.85] tracking-[0.08em] text-[#F8F6F2]/[0.07] lg:text-[12vw]" aria-hidden="true">
            {SITE_NAME_UPPER}
          </p>
        </Reveal>
      </div>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-6 pb-8 text-[0.62rem] uppercase tracking-[0.22em] text-[#F8F6F2]/35 md:flex-row md:items-center md:justify-between md:px-12">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Product discovery platform.</p>
        <p>This website may earn commissions from qualifying purchases made through affiliate links.</p>
      </div>
      <div className="mx-auto max-w-[1500px] px-6 pb-8 text-[0.62rem] leading-relaxed tracking-[0.12em] text-[#F8F6F2]/35 md:px-12">
        Some links on this website are affiliate links. This means we may receive a commission when a visitor makes a qualifying purchase through one of these links, at no additional cost to the customer. Product prices, availability, shipping, returns, and order fulfilment are managed by the relevant third-party seller or marketplace.
      </div>
    </footer>
  );
};
