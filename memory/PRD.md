# VARA — Luxury Affiliate eCommerce Experience

## Original Problem Statement
Build a high-end luxury affiliate/eCommerce experience that looks like it cost $250k+ to design. No template/Shopify/Bootstrap feel, no generic cards or repetitive grids. Editorial, cinematic, minimal — inspired by Apple, Aesop, COS, Bottega Veneta, SSENSE (quality only, no copying). Apple-quality motion (smooth scroll, parallax, mask reveals, magnetic buttons).

## User Choices
- Products: luxury accessories (Watches, Eyewear, Bags, Wallets, Jewelry, Tech)
- Brand: invented original identity — **VARA** ("Objects of intention", quiet-luxury voice, Cormorant Garamond + Manrope, warm white/ivory + charcoal + champagne gold/olive/sand palette)
- Checkout: affiliate-style — "Acquire" opens partner URL in new tab, no cart
- Catalog: 16 handcrafted demo products seeded in MongoDB
- Auth: none

## Architecture
- FastAPI backend (`/app/backend/server.py`), all routes `/api`-prefixed, MongoDB via MONGO_URL
- React 19 frontend (CRA + craco), Tailwind, framer-motion, Lenis smooth scroll, shadcn accordion, sonner toasts
- Products seeded on startup (idempotent — seeds only when collection empty). To reseed after changing SEED_PRODUCTS: drop `products` collection + restart backend.

## Implemented (June 2026)
- **Backend**: GET /api/products (filters: category/featured/bestseller), GET /api/products/{slug}, GET /api/products/{slug}/related, GET /api/categories, POST /api/newsletter (idempotent), POST /api/contact. 16 products with reviews, ratings, specs, story, affiliate_url.
- **Home**: full-screen parallax hero w/ mask-reveal headline, asymmetric featured grid, editorial brand story, bestsellers horizontal scroll, parallax lifestyle band, "Why VARA" (forest green), staggered testimonials, Instagram gallery, footer newsletter.
- **Shop**: editorial header, sticky filter/sort bar, staggered 3-col grid.
- **Product detail**: gallery w/ hover zoom + thumbs, sticky info, variants, qty, magnetic Acquire button (affiliate window.open), trust grid, specs/materials accordions, product story, reviews, FAQ, related, recently viewed (localStorage).
- **About**: parallax hero, manifesto, timeline (2021–2026), craftsmanship stats, founder story (Amara Valette), CTA.
- **Contact**: split layout underline-input form → MongoDB, atelier info/hours, OpenStreetMap embed, FAQ accordion.
- **Wishlist**: localStorage context, header count badge, dedicated page.
- **Header**: transparent→solid on scroll, search overlay with live results, mobile fullscreen menu. **Footer**: editorial giant VARA type, newsletter.
- All interactive elements have data-testid. Testing agent iteration_1: 100% backend + frontend pass.

## Notes
- Affiliate URLs point to https://partner.vara-atelier.com/... (DEMO domain, will not resolve — intentional).
- All catalog images visually audited; branded/broken Unsplash images replaced.

## Backlog / Next
- P1: Product image zoom lens on hover (currently scale zoom), quick-view modal from cards
- P1: Newsletter/contact email validation (EmailStr) + admin view of messages
- P2: Page transition animations between routes, compare products view
- P2: FastAPI lifespan migration (deprecated on_event), currency switcher
