from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class Review(BaseModel):
    author: str
    rating: int
    title: str
    text: str
    date: str


class Product(BaseModel):
    id: str
    slug: str
    name: str
    category: str
    collection: str
    price: float
    compare_at_price: Optional[float] = None
    badge: Optional[str] = None
    tagline: str
    description: str
    story: str
    materials: str
    specs: List[dict]
    images: List[str]
    rating: float
    review_count: int
    reviews: List[Review]
    affiliate_url: str
    featured: bool = False
    bestseller: bool = False


class NewsletterInput(BaseModel):
    email: str


class ContactInput(BaseModel):
    name: str
    email: str
    subject: str
    message: str


IMG = {
    "w1": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600",
    "w2": "https://images.unsplash.com/photo-1676701497146-c11ddfe7c0c5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB3YXRjaCUyMGNpbmVtYXRpY3xlbnwwfHx8fDE3ODQyNDkwMzJ8MA&ixlib=rb-4.1.0&q=85",
    "w3": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600",
    "s1": "https://images.unsplash.com/photo-1664076423411-e570cfdfcbed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBzdW5nbGFzc2VzJTIwZWRpdG9yaWFsfGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85",
    "s2": "https://images.unsplash.com/photo-1710407625705-fe00b2ecf9e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdW5nbGFzc2VzJTIwbWluaW1hbCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3ODQyNDkwNTF8MA&ixlib=rb-4.1.0&q=85",
    "s3": "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1600",
    "b1": "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwaGFuZGJhZyUyMG1pbmltYWx8ZW58MHx8fHwxNzg0MjQ5MDMzfDA&ixlib=rb-4.1.0&q=85",
    "b2": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600",
    "b3": "https://images.unsplash.com/photo-1620109176813-e91290f6c795?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsZWF0aGVyJTIwd2FsbGV0JTIwbWluaW1hbHxlbnwwfHx8fDE3ODQyNDkwNTJ8MA&ixlib=rb-4.1.0&q=85",
    "j1": "https://images.unsplash.com/photo-1623279743107-152e86999257?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxnb2xkJTIwamV3ZWxyeSUyMG1pbmltYWxpc3R8ZW58MHx8fHwxNzg0MjQ5MDMzfDA&ixlib=rb-4.1.0&q=85",
    "j2": "https://images.unsplash.com/photo-1767391255584-763f98ced9d0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxyeSUyMG1pbmltYWxpc3R8ZW58MHx8fHwxNzg0MjQ5MDMzfDA&ixlib=rb-4.1.0&q=85",
    "t1": "https://images.unsplash.com/photo-1545639599-e049a5b6478a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB0ZWNoJTIwYWNjZXNzb3JpZXMlMjBtaW5pbWFsfGVufDB8fHx8MTc4NDI0OTA1Mnww&ixlib=rb-4.1.0&q=85",
    "t2": "https://images.unsplash.com/photo-1522591599907-d8bd97c4c948?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB0ZWNoJTIwYWNjZXNzb3JpZXMlMjBtaW5pbWFsfGVufDB8fHx8MTc4NDI0OTA1Mnww&ixlib=rb-4.1.0&q=85",
    "l1": "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600",
    "l2": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
    "n2": "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1600&auto=format&fit=crop",
    "l3": "https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwbHV4dXJ5fGVufDB8fHx8MTc4NDI0OTAzM3ww&ixlib=rb-4.1.0&q=85",
}


def P(slug, name, category, collection, price, tagline, description, story, materials, specs, images, rating, reviews, badge=None, compare=None, featured=False, bestseller=False):
    return {
        "id": str(uuid.uuid4()), "slug": slug, "name": name, "category": category,
        "collection": collection, "price": price, "compare_at_price": compare,
        "badge": badge, "tagline": tagline, "description": description, "story": story,
        "materials": materials, "specs": specs, "images": images, "rating": rating,
        "review_count": len(reviews) * 14 + 9, "reviews": reviews,
        "affiliate_url": f"https://partner.vara-atelier.com/shop/{slug}",
        "featured": featured, "bestseller": bestseller,
    }


def R(author, rating, title, text, date):
    return {"author": author, "rating": rating, "title": title, "text": text, "date": date}


SEED_PRODUCTS = [
    P("meridian-chronograph", "Meridian Chronograph", "Watches", "Heritage", 1240, "Time, measured quietly.",
      "A hand-finished chronograph in brushed steel with a smoked charcoal dial. Swiss automatic movement, visible through a sapphire caseback.",
      "The Meridian began as a sketch in our Geneva atelier — a study in restraint. Every index is applied by hand, every surface brushed in a single direction. It does not announce itself. It simply keeps perfect time, and looks extraordinary doing so.",
      "316L brushed steel, sapphire crystal, Italian calf strap",
      [{"label": "Movement", "value": "Swiss automatic, 41h reserve"}, {"label": "Case", "value": "40mm, 316L steel"}, {"label": "Water resistance", "value": "10 ATM"}, {"label": "Crystal", "value": "Domed sapphire"}, {"label": "Warranty", "value": "5 years international"}],
      [IMG["w1"], IMG["l1"], IMG["l2"]], 4.9,
      [R("Julien M.", 5, "Understated perfection", "I own pieces three times the price that feel less considered. The dial catches light like nothing I've seen.", "May 2026"),
       R("Sarah K.", 5, "My daily companion", "Wears beautifully with everything. The strap softened within a week and now fits like a second skin.", "April 2026"),
       R("Andreas B.", 4, "Quiet luxury, literally", "The movement is whisper-silent. Only wish there were more strap options.", "March 2026")],
      badge="Icon", featured=True, bestseller=True),

    P("solenne-automatic", "Solenne Automatic", "Watches", "Heritage", 980, "Light on the wrist, heavy on presence.",
      "A slim automatic dress watch with an ivory lacquer dial and champagne gold indices. Designed to disappear under a cuff and be missed when it does.",
      "Solenne is named for the golden hour — that brief window when light turns everything precious. Its dial is lacquered seven times, then polished by a single artisan who has done nothing else for twenty years.",
      "Rose gold PVD, ivory lacquer dial, suede strap",
      [{"label": "Movement", "value": "Automatic, 38h reserve"}, {"label": "Case", "value": "36mm, PVD gold"}, {"label": "Thickness", "value": "8.2mm"}, {"label": "Crystal", "value": "Sapphire, AR coated"}],
      [IMG["w3"], IMG["l1"]], 4.8,
      [R("Elena R.", 5, "Elegant beyond words", "The ivory dial is warmer in person. I receive compliments weekly.", "May 2026"),
       R("Tom H.", 5, "Perfect proportions", "36mm is the ideal size. Sits flat, feels weightless.", "February 2026")],
      featured=True),

    P("eclipse-noir", "Eclipse Noir", "Watches", "Heritage", 1580, "For the hours after dark.",
      "A limited black-on-black chronograph with a ceramic bezel and luminous sand-gold accents. Only 500 pieces made each year.",
      "Eclipse Noir was designed for the evening — dinners that run long, cities that never sleep. Its matte black case absorbs light while the gold seconds hand sweeps like a slow comet.",
      "Matte ceramic, DLC steel, fluoro-rubber strap",
      [{"label": "Movement", "value": "Swiss automatic chronograph"}, {"label": "Case", "value": "42mm, DLC black steel"}, {"label": "Edition", "value": "500 pieces / year"}, {"label": "Lume", "value": "Sand-gold Super-LumiNova"}],
      [IMG["w2"], IMG["l2"], IMG["l1"]], 4.9,
      [R("Marcus D.", 5, "The one they ask about", "Every time. The black ceramic is impossibly deep.", "June 2026"),
       R("Priya N.", 5, "Worth the wait", "Three month waitlist, zero regrets.", "April 2026")],
      badge="Limited", featured=True),

    P("obsidian-frame", "Obsidian Frame", "Eyewear", "Lumen", 420, "Architecture for the face.",
      "Sculpted acetate frames in deep obsidian with Zeiss lenses. Eight-millimetre Italian acetate, hand-polished for three days.",
      "We spent two years on the curve of this temple. The Obsidian is cut from a single block of Mazzucchelli acetate — the same material houses in Milan have used since 1849 — then tumbled in wood chips until it feels like river stone.",
      "Mazzucchelli acetate, Zeiss nylon lenses, titanium hinges",
      [{"label": "Lenses", "value": "Zeiss, 100% UVA/UVB"}, {"label": "Frame", "value": "8mm Italian acetate"}, {"label": "Hinges", "value": "5-barrel titanium"}, {"label": "Includes", "value": "Leather case, cloth"}],
      [IMG["s1"], IMG["l2"]], 4.8,
      [R("Camille F.", 5, "Sculptural and light", "They look carved, not molded. Weightless after ten hours.", "May 2026"),
       R("Daniel O.", 5, "Compliment machine", "The polish is genuinely different from anything at this price.", "March 2026"),
       R("Ines V.", 4, "Beautiful, runs slightly large", "Stunning quality. Size up note for narrow faces.", "January 2026")],
      badge="Bestseller", featured=True, bestseller=True),

    P("riva-sun", "Riva Sun", "Eyewear", "Lumen", 380, "The Riviera, distilled.",
      "Soft-square frames in translucent shell with gradient amber lenses. Made for long lunches and slow afternoons.",
      "Riva is our love letter to the Ligurian coast. The translucent shell acetate shifts from honey to smoke as the light moves — no two pairs read exactly the same.",
      "Translucent shell acetate, gradient CR-39 lenses",
      [{"label": "Lenses", "value": "Gradient amber, UV400"}, {"label": "Frame", "value": "Translucent shell acetate"}, {"label": "Fit", "value": "Medium, universal bridge"}],
      [IMG["s2"], IMG["s1"]], 4.7,
      [R("Louise P.", 5, "Golden hour, always", "The amber gradient makes the whole world warmer.", "April 2026"),
       R("Henrik S.", 4, "Summer essential", "Light, elegant, travels everywhere with me.", "May 2026")],
      bestseller=True),

    P("aurel-cat-eye", "Aurel Cat-Eye", "Eyewear", "Lumen", 460, "A classic, re-drawn.",
      "A refined cat-eye in champagne acetate with gold wire rims and gradient rose-smoke lenses. Lighter than a letter.",
      "The cat-eye is nearly a century old. We removed everything that made it ordinary — the drama, the gloss, the costume-party cliché — until only the essence remained: a champagne curve, a gold wire, perfect proportion.",
      "Champagne acetate, gold wire rims, gradient CR-39 lenses",
      [{"label": "Weight", "value": "19 grams"}, {"label": "Frame", "value": "Champagne acetate, gold wire"}, {"label": "Lenses", "value": "Gradient rose-smoke, UV400"}, {"label": "Fit", "value": "Medium, keyhole bridge"}],
      [IMG["s3"], IMG["s1"]], 4.8,
      [R("Nadia W.", 5, "Featherweight luxury", "Forgot I was wearing them on a 12-hour flight.", "June 2026"),
       R("Oliver T.", 5, "The perfect frame", "Understated gold, no logos screaming. Exactly right.", "March 2026")],
      badge="New"),

    P("marlow-tote", "Marlow Tote", "Bags", "Atelier", 890, "Carries the day, beautifully.",
      "A structured tote in vegetable-tanned taupe leather with hand-painted edges and a suede interior. Fits a 14-inch laptop and a life.",
      "Each Marlow takes eleven hours to make. The leather comes from a family tannery in Tuscany that still uses oak bark and time — no chrome, no shortcuts. It arrives matte and firm, then develops a glow that belongs only to you.",
      "Vegetable-tanned Tuscan leather, suede lining, brass hardware",
      [{"label": "Dimensions", "value": "38 × 30 × 12 cm"}, {"label": "Leather", "value": "Vegetable-tanned, full grain"}, {"label": "Interior", "value": "Suede, 3 pockets"}, {"label": "Fits", "value": "14\" laptop"}],
      [IMG["b1"], IMG["l3"], IMG["l1"]], 4.9,
      [R("Charlotte E.", 5, "Ages like wine", "Eight months in and the patina is gorgeous. Better every day.", "May 2026"),
       R("James L.", 5, "Bought one for my wife, then myself", "The craftsmanship is visible from across a room.", "April 2026"),
       R("Mia G.", 5, "My forever bag", "Structured but soft. The hand-painted edges are art.", "February 2026")],
      badge="New", featured=True, bestseller=True),

    P("noir-carryall", "Noir Carryall", "Bags", "Atelier", 1120, "Everything, in order.",
      "An architectural carryall in matte black grained leather. One clean silhouette, zero visible branding, absolute intent.",
      "The Noir Carryall was designed backwards — we started with what it should feel like to open it at the end of a long day, and worked outward from that feeling. Calm. Ordered. Yours.",
      "Grained calf leather, microsuede lining, gunmetal hardware",
      [{"label": "Dimensions", "value": "42 × 32 × 14 cm"}, {"label": "Leather", "value": "Grained calf, matte"}, {"label": "Closure", "value": "Magnetic + zip"}, {"label": "Strap", "value": "Detachable, adjustable"}],
      [IMG["b2"], IMG["l2"]], 4.8,
      [R("Victor A.", 5, "Serious quality", "The grain, the stitch density, the weight of the zip — all of it says decades, not seasons.", "June 2026"),
       R("Hana Y.", 5, "Minimal done right", "No logos. People who know, know.", "March 2026")],
      featured=True),

    P("sable-sling", "Sable Sling", "Bags", "Atelier", 640, "Hands free. Mind clear.",
      "A compact crossbody sling in smooth black leather, sized for essentials and nothing else. The edit, worn.",
      "Sable is for the walkers, the travellers, the ones who left the laptop at home. It holds a phone, a passport, a cardholder and keys — and refuses to hold anything more. Constraint is the luxury.",
      "Smooth calf leather, cotton twill lining",
      [{"label": "Dimensions", "value": "24 × 15 × 6 cm"}, {"label": "Leather", "value": "Smooth calf"}, {"label": "Strap", "value": "Adjustable, 65–120cm"}],
      [IMG["l3"], IMG["b2"]], 4.7,
      [R("Ren K.", 5, "Travel essential", "Wore it across four countries. Perfect size, zero fatigue.", "May 2026"),
       R("Alba M.", 4, "Chic and practical", "Wish it fit a small water bottle, but that's the point I suppose.", "April 2026")]),

    P("ledger-bifold", "Ledger Bifold", "Wallets", "Atelier", 290, "The last wallet you'll buy.",
      "A slim bifold in saddle-stitched bridle leather. Six cards, folded notes, and a lifetime guarantee we mean literally.",
      "Saddle stitching cannot be done by machine. Two needles, one thread, crossing inside each hole — it takes four times longer and lasts four times longer. The Ledger is stitched by hand, every one, and we guarantee it for life.",
      "English bridle leather, hand saddle-stitched, linen thread",
      [{"label": "Capacity", "value": "6 cards + notes"}, {"label": "Leather", "value": "English bridle"}, {"label": "Stitching", "value": "Hand saddle-stitch"}, {"label": "Guarantee", "value": "Lifetime"}],
      [IMG["b3"], IMG["l1"]], 4.9,
      [R("Paul C.", 5, "Heirloom quality", "My grandfather had one wallet his whole life. Now I understand.", "June 2026"),
       R("Sofia D.", 5, "Gifted three so far", "Everyone reacts the same way — they go quiet and just turn it over in their hands.", "February 2026"),
       R("Liam B.", 5, "Slimmer than expected", "Six cards and it still disappears in a front pocket.", "January 2026")],
      badge="Bestseller", bestseller=True),

    P("slim-cardholder", "Slim Cardholder", "Wallets", "Atelier", 180, "Four cards. Nothing else.",
      "A whisper-thin cardholder in the same bridle leather as the Ledger, for those who have finished minimizing.",
      "At 4mm thick, the Slim is barely there. It is the final destination of every wallet journey — the moment you realise you never needed more than this.",
      "English bridle leather, embossed logo interior only",
      [{"label": "Capacity", "value": "4 cards + folded note"}, {"label": "Thickness", "value": "4mm empty"}, {"label": "Leather", "value": "English bridle"}],
      [IMG["b3"], IMG["l2"]], 4.8,
      [R("Emma J.", 5, "Pocket jewelry", "It's so thin I check twice that it's there. Beautiful object.", "May 2026"),
       R("Noah F.", 5, "End of the search", "Tried every minimal wallet. This one wins on feel alone.", "March 2026")]),

    P("ora-hoops", "Ora Hoops", "Jewelry", "Fine Line", 340, "A circle of light.",
      "Sculptural hollow hoops in 18k gold vermeil. Bold in silhouette, feather-light on the ear.",
      "Ora means edge, border, hour. These hoops are all three — a clean line that frames the face, catches candlelight, and outlasts every trend that will come and go around them.",
      "18k gold vermeil over recycled sterling silver",
      [{"label": "Material", "value": "18k gold vermeil"}, {"label": "Diameter", "value": "32mm"}, {"label": "Weight", "value": "4.1g each"}, {"label": "Base", "value": "Recycled sterling"}],
      [IMG["j1"], IMG["l1"]], 4.8,
      [R("Isabelle T.", 5, "Everyday gold", "Worn daily for six months — shower, gym, sleep. Still perfect.", "June 2026"),
       R("Grace W.", 5, "The right kind of bold", "Big enough to notice, light enough to forget.", "April 2026")],
      badge="New", featured=True),

    P("cascade-chain", "Cascade Chain", "Jewelry", "Fine Line", 520, "Weight, where it matters.",
      "A substantial curb chain in polished gold vermeil with a hidden clasp. Made to be worn alone and noticed anyway.",
      "The Cascade is poured, linked, and polished in a third-generation Vicenza workshop. Its hidden clasp took eleven prototypes — because luxury is what you don't see.",
      "18k gold vermeil, hidden box clasp",
      [{"label": "Material", "value": "18k gold vermeil"}, {"label": "Length", "value": "45cm"}, {"label": "Clasp", "value": "Hidden box, secure"}, {"label": "Width", "value": "7mm curb"}],
      [IMG["j2"], IMG["l2"]], 4.9,
      [R("Yasmin H.", 5, "Solid, seamless, stunning", "The hidden clasp is genius. Reads like one continuous line.", "May 2026"),
       R("Theo R.", 5, "Unisex perfection", "My partner and I share it. Constant negotiation.", "March 2026")],
      bestseller=True),

    P("meridian-band", "Meridian Band", "Jewelry", "Fine Line", 410, "One line, worn forever.",
      "A minimal band ring in brushed gold vermeil with a single polished inner edge — a private detail only the wearer knows.",
      "We engrave nothing on the outside of the Meridian Band. Its only ornament is a polished line on the inside, against the skin. Some things are just for you.",
      "18k gold vermeil, brushed exterior, polished interior",
      [{"label": "Material", "value": "18k gold vermeil"}, {"label": "Width", "value": "4mm"}, {"label": "Finish", "value": "Brushed / polished interior"}, {"label": "Sizes", "value": "5–12"}],
      [IMG["j1"], IMG["l2"]], 4.7,
      [R("Anna S.", 5, "The inner polish detail", "Nobody sees it but me. That's exactly why I love it.", "April 2026"),
       R("Marco V.", 4, "Quietly excellent", "Brushed finish hides scratches beautifully.", "February 2026")]),

    P("voyage-tech-folio", "Voyage Tech Folio", "Tech", "Voyage", 310, "Order for the digital life.",
      "A zip-around folio in pebbled leather that holds cables, adapters, cards and a passport in engineered calm.",
      "The Voyage folio was designed by unpacking a hundred travellers' bags and counting what actually mattered. Then we built a home for exactly that, and nothing more.",
      "Pebbled calf leather, elastic organization system",
      [{"label": "Dimensions", "value": "23 × 13 × 3 cm"}, {"label": "Slots", "value": "8 elastic + 2 mesh"}, {"label": "Closure", "value": "YKK Excella zip"}],
      [IMG["t1"], IMG["l1"]], 4.8,
      [R("Derek P.", 5, "Cured my cable chaos", "Everything has a place. TSA agents have complimented it.", "June 2026"),
       R("Lena M.", 5, "Gift of the year", "Bought for my father. He shows everyone.", "May 2026")],
      badge="New"),

    P("second-skin-sleeve", "Second Skin Sleeve", "Tech", "Voyage", 150, "Protection, unnoticed.",
      "A magnetic phone sleeve in vegetable-tanned leather that molds to your device within a week and to your habits within two.",
      "The Second Skin has no clasp, no flap, no bulk — a precise leather envelope held closed by hidden magnets. It gets better looking every single day you use it.",
      "Vegetable-tanned leather, hidden magnets, microfiber interior",
      [{"label": "Fits", "value": "6.1\"–6.7\" phones"}, {"label": "Leather", "value": "Vegetable-tanned"}, {"label": "Closure", "value": "Hidden magnetic"}],
      [IMG["t2"], IMG["l2"]], 4.7,
      [R("Chloe B.", 5, "Molds like magic", "Week two and it fits my phone like it grew around it.", "April 2026"),
       R("Sam R.", 4, "Minimal and lovely", "Wish it had a card slot, but the purity is the point.", "March 2026")]),
]

CATEGORIES = ["Watches", "Eyewear", "Bags", "Wallets", "Jewelry", "Tech"]


@api_router.get("/")
async def root():
    return {"message": "VARA API"}


@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None, bestseller: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if bestseller is not None:
        query["bestseller"] = bestseller
    docs = await db.products.find(query, {"_id": 0}).to_list(100)
    return docs


@api_router.get("/categories")
async def list_categories():
    return CATEGORIES


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@api_router.get("/products/{slug}/related", response_model=List[Product])
async def get_related(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    related = await db.products.find({"category": doc["category"], "slug": {"$ne": slug}}, {"_id": 0}).to_list(4)
    if len(related) < 4:
        extra = await db.products.find({"category": {"$ne": doc["category"]}, "slug": {"$ne": slug}}, {"_id": 0}).to_list(4 - len(related))
        related += extra
    return related[:4]


@api_router.post("/newsletter")
async def subscribe_newsletter(input: NewsletterInput):
    existing = await db.newsletter.find_one({"email": input.email})
    if not existing:
        await db.newsletter.insert_one({"id": str(uuid.uuid4()), "email": input.email, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"status": "subscribed"}


@api_router.post("/contact")
async def submit_contact(input: ContactInput):
    doc = input.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contact_messages.insert_one(doc)
    return {"status": "received"}


@app.on_event("startup")
async def seed_products():
    count = await db.products.count_documents({})
    if count == 0:
        await db.products.insert_many([dict(p) for p in SEED_PRODUCTS])
        logging.info("Seeded %d products", len(SEED_PRODUCTS))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
