import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Mail, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { submitContact } from "../lib/api";
import { Reveal, MaskReveal } from "../components/Reveal";
import { MagneticButton } from "../components/MagneticButton";

const FAQS = [
  { q: "Do you sell products directly?", a: "No. VARA is a product discovery platform. Product purchases are completed through the linked external seller or marketplace." },
  { q: "How do affiliate purchases work?", a: "A product link opens the relevant external seller. The seller or marketplace manages payment, shipping, returns, warranties, and order fulfilment." },
  { q: "Can you help with an order or return?", a: "Orders and returns are managed by the external platform where the purchase was completed. Please contact that seller or marketplace directly." },
  { q: "Can sellers suggest products?", a: "Yes. Sellers and partners may contact us with relevant products for consideration, but inclusion is not guaranteed." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General inquiry", message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.message) {
      return toast("Please complete your name, a valid email, and a message.");
    }
    setBusy(true);
    try {
      await submitContact(form);
      toast("Received. A human will reply within one business day.");
      setForm({ name: "", email: "", subject: "General inquiry", message: "" });
    } catch {
      toast("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="contact-page" className="pt-[76px]">
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          <p className="overline-label">Correspondence</p>
          <h1 className="font-serif-display mt-5 text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            <MaskReveal>Write to us.</MaskReveal><br />
            <MaskReveal delay={0.15}><em className="text-[#7A8164]">We write back.</em></MaskReveal>
          </h1>
        </div>
      </section>

      <section className="border-t border-[#DAD8D2]">
        <div className="mx-auto grid max-w-[1500px] px-6 md:px-12 lg:grid-cols-12">
          {/* FORM */}
          <div className="py-16 lg:col-span-6 lg:border-r lg:border-[#DAD8D2] lg:py-24 lg:pr-20">
            <Reveal>
              <form onSubmit={onSubmit} data-testid="contact-form" className="space-y-10">
                <div className="grid gap-10 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="overline-label">Name</label>
                    <input id="c-name" data-testid="contact-name-input" value={form.name} onChange={set("name")} placeholder="Your name" className="input-line mt-2" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="overline-label">Email</label>
                    <input id="c-email" data-testid="contact-email-input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="input-line mt-2" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="overline-label">Subject</label>
                  <select id="c-subject" data-testid="contact-subject-select" value={form.subject} onChange={set("subject")} className="input-line mt-2 cursor-pointer">
                    {["General inquiry", "Product suggestion", "Affiliate partnership", "Press", "Website feedback"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-message" className="overline-label">Message</label>
                  <textarea id="c-message" data-testid="contact-message-input" rows={5} value={form.message} onChange={set("message")} placeholder="Take your time. We will." className="input-line mt-2 resize-none" />
                </div>
                <MagneticButton type="submit" data-testid="contact-submit-button" disabled={busy} className="btn-primary">
                  {busy ? "Sending…" : "Send the letter"} <ArrowRight size={14} strokeWidth={1.5} />
                </MagneticButton>
              </form>
            </Reveal>
          </div>

          {/* INFO */}
          <div className="border-t border-[#DAD8D2] py-16 lg:col-span-6 lg:border-t-0 lg:py-24 lg:pl-20">
            <div className="space-y-14">
              <Reveal>
                <div className="flex items-start gap-5">
                  <MapPin size={18} strokeWidth={1.25} className="mt-1 text-[#7A8164]" />
                  <div>
                    <p className="overline-label">Online platform</p>
                    <p className="font-serif-display mt-3 text-2xl font-light leading-snug">
                      Product discovery<br />available online
                    </p>
                    <p className="mt-2 text-sm font-light text-[#7A8164]">No physical showroom or direct product sales</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="flex items-start gap-5">
                  <Clock size={18} strokeWidth={1.25} className="mt-1 text-[#7A8164]" />
                  <div>
                    <p className="overline-label">Response times</p>
                    <dl className="mt-3 space-y-2 text-sm font-light">
                      <div className="flex gap-10"><dt className="w-32 text-[#7A8164]">Messages</dt><dd>Reviewed regularly</dd></div>
                      <div className="flex gap-10"><dt className="w-32 text-[#7A8164]">Product orders</dt><dd>Contact the seller</dd></div>
                      <div className="flex gap-10"><dt className="w-32 text-[#7A8164]">Returns</dt><dd>Seller policy applies</dd></div>
                    </dl>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex items-start gap-5">
                  <Mail size={18} strokeWidth={1.25} className="mt-1 text-[#7A8164]" />
                  <div>
                    <p className="overline-label">Direct</p>
                    <a href="mailto:hello@vara.com" className="link-underline mt-3 inline-block font-serif-display text-2xl font-light">
                      hello@vara.com
                    </a>
                    <div className="mt-5 flex gap-5">
                      <a href="/" onClick={(e) => e.preventDefault()} aria-label="Instagram" className="text-[#7A8164] transition-colors duration-300 hover:text-[#121212]"><Instagram size={17} strokeWidth={1.25} /></a>
                      <a href="/" onClick={(e) => e.preventDefault()} aria-label="Twitter" className="text-[#7A8164] transition-colors duration-300 hover:text-[#121212]"><Twitter size={17} strokeWidth={1.25} /></a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section aria-label="Map" className="border-t border-[#DAD8D2]">
        <Reveal y={0}>
          <div className="relative h-[420px] w-full grayscale transition-[filter] duration-700 hover:grayscale-0">
            <iframe
              title="VARA platform information"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-9.1520%2C38.7060%2C-9.1360%2C38.7140&layer=mapnik&marker=38.7100%2C-9.1440"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32" aria-label="Contact FAQ">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-6 md:px-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="overline-label">Before you write</p>
            <h2 className="font-serif-display mt-4 text-3xl font-light sm:text-4xl">The usual<br /><em>questions.</em></h2>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible data-testid="contact-faq-accordion">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`cfaq-${i}`} className="border-[#DAD8D2]">
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
    </div>
  );
}
