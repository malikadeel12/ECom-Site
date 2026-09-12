/**
 * Change summary
 * What: Admin can add many product image URLs and optional video URLs.
 * Why: The storefront gallery needs more than one photo, plus product videos.
 * Related: productMedia.js, firestoreApi.js, ProductMediaGallery.js
 */

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ArrowRight, LogOut, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "../context/AdminAuthContext";
import { addProduct, deleteProduct, fetchProducts, formatPrice, dataSource } from "../lib/api";
import { PRODUCT_CATEGORIES, createProductSlug } from "../lib/productStore";
import { cleanUrlList } from "../lib/productMedia";
import { Reveal } from "../components/Reveal";

const emptyForm = {
  name: "",
  category: PRODUCT_CATEGORIES[0],
  price: "",
  affiliateUrl: "",
  imageUrls: [""],
  videoUrls: [""],
  description: "",
  badge: "Featured",
};

const AdminLogin = () => {
  const { authenticated, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const code = err && err.code;
      const message =
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "Incorrect admin email or password."
          : code === "auth/too-many-requests"
            ? "Too many attempts. Try again later."
            : err && err.message
              ? err.message
              : "Could not sign in.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] px-6 pb-24 pt-36 md:px-12">
      <Reveal className="mx-auto max-w-lg border border-[#DAD8D2] bg-[#F8F6F2] p-8 sm:p-12">
        <p className="overline-label">Protected access</p>
        <h1 className="font-serif-display mt-5 text-4xl font-light sm:text-5xl">Admin login</h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-[#1C1C1C]/65">Sign in with your administrator account to add or remove product recommendations.</p>
        <form onSubmit={submit} className="mt-10 space-y-8">
          <div>
            <label htmlFor="admin-email" className="overline-label">Admin email</label>
            <input id="admin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-line mt-2" required />
          </div>
          <div>
            <label htmlFor="admin-password" className="overline-label">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-line mt-2" required />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? "Signing in…" : "Sign in"} <ArrowRight size={14} /></button>
        </form>
      </Reveal>
    </div>
  );
};

const AdminDashboard = () => {
  const { authenticated, loading, logout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => fetchProducts().then((data) => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  useEffect(() => { if (authenticated) loadProducts(); }, [authenticated]);

  if (loading) return null;
  if (!authenticated) return <Navigate to="/admin" replace />;

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const updateList = (key, index, value) => {
    setForm((current) => {
      const next = [...current[key]];
      next[index] = value;
      return { ...current, [key]: next };
    });
  };

  const addListRow = (key) => {
    setForm((current) => ({ ...current, [key]: [...current[key], ""] }));
  };

  const removeListRow = (key, index) => {
    setForm((current) => {
      const next = current[key].filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [key]: next.length ? next : [""] };
    });
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    const images = cleanUrlList(form.imageUrls);
    const videos = cleanUrlList(form.videoUrls);

    try {
      const affiliateUrl = new URL(form.affiliateUrl);
      if (!/^https?:$/.test(affiliateUrl.protocol)) throw new Error();
    } catch {
      toast.error("Use a valid http or https affiliate link.");
      return;
    }

    if (!images.length) {
      toast.error("Add at least one valid product image URL.");
      return;
    }

    const leftoverImages = form.imageUrls.filter((value) => value.trim() && !cleanUrlList([value]).length);
    const leftoverVideos = form.videoUrls.filter((value) => value.trim() && !cleanUrlList([value]).length);
    if (leftoverImages.length || leftoverVideos.length) {
      toast.error("Every filled image or video row must be a valid http or https URL.");
      return;
    }

    if (!form.name.trim() || !Number.isFinite(price) || price < 0) {
      toast.error("Enter a product name and a valid price.");
      return;
    }

    setSaving(true);
    const product = {
      slug: createProductSlug(form.name),
      name: form.name.trim(),
      tagline: "Available from an external seller.",
      collection: "Selected Product",
      category: form.category,
      price,
      badge: form.badge,
      description: form.description.trim() || "A selected product available from an external marketplace.",
      images,
      videos,
      affiliate_url: form.affiliateUrl.trim(),
      specs: [],
      materials: "See the external seller listing for current product materials and specifications.",
      reviews: [],
    };
    try {
      await addProduct(product);
    } catch (err) {
      setSaving(false);
      const message = err && err.message ? err.message : "Could not save the product.";
      toast.error(`${message} Check Firestore rules / that you are signed in as admin.`);
      return;
    }
    setForm(emptyForm);
    await loadProducts();
    setSaving(false);
    toast.success(`Product added (${dataSource}).`);
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete “${product.name}” from the storefront?`)) return;
    try {
      await deleteProduct(product.slug);
    } catch (err) {
      const message = err && err.message ? err.message : "Could not delete the product.";
      toast.error(`${message} Check Firestore rules / that you are signed in as admin.`);
      return;
    }
    await loadProducts();
    toast.success("Product deleted.");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] pb-24 pt-[76px]">
      <section className="border-b border-[#DAD8D2] py-16 md:py-20">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-8 px-6 md:px-12">
          <div>
            <p className="overline-label">Product management</p>
            <h1 className="font-serif-display mt-4 text-5xl font-light sm:text-6xl">Admin dashboard</h1>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/55">Data source: {dataSource}</p>
          </div>
          <button onClick={logout} className="btn-ghost">Log out <LogOut size={14} /></button>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] gap-16 px-6 py-16 md:px-12 lg:grid-cols-12">
        <section className="lg:col-span-5" aria-labelledby="add-product-heading">
          <p className="overline-label">Add a product</p>
          <h2 id="add-product-heading" className="font-serif-display mt-4 text-3xl font-light">New recommendation</h2>
          <form onSubmit={handleAddProduct} className="mt-10 space-y-7">
            <div><label className="overline-label" htmlFor="product-name">Product name</label><input id="product-name" value={form.name} onChange={set("name")} className="input-line mt-2" required /></div>
            <div><label className="overline-label" htmlFor="product-category">Category</label><select id="product-category" value={form.category} onChange={set("category")} className="input-line mt-2 cursor-pointer">{PRODUCT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
            <div className="grid gap-7 sm:grid-cols-2">
              <div><label className="overline-label" htmlFor="product-price">Price (USD)</label><input id="product-price" type="number" min="0" step="0.01" value={form.price} onChange={set("price")} className="input-line mt-2" required /></div>
              <div><label className="overline-label" htmlFor="product-badge">Label</label><select id="product-badge" value={form.badge} onChange={set("badge")} className="input-line mt-2 cursor-pointer">{["Featured", "Popular", "Recommended", "Best Value"].map((badge) => <option key={badge}>{badge}</option>)}</select></div>
            </div>
            <div><label className="overline-label" htmlFor="affiliate-url">Affiliate link</label><input id="affiliate-url" type="url" placeholder="https://marketplace.com/product" value={form.affiliateUrl} onChange={set("affiliateUrl")} className="input-line mt-2" required /></div>

            <UrlListFields
              label="Product image URLs"
              hint="Add every photo you want in the product gallery. At least one is required."
              idPrefix="image-url"
              values={form.imageUrls}
              placeholder="https://example.com/image.jpg"
              onChange={(index, value) => updateList("imageUrls", index, value)}
              onAdd={() => addListRow("imageUrls")}
              onRemove={(index) => removeListRow("imageUrls", index)}
              addLabel="Add another image"
            />

            <UrlListFields
              label="Product video URLs"
              hint="Optional. YouTube, Vimeo, or a direct .mp4 / .webm link."
              idPrefix="video-url"
              values={form.videoUrls}
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(index, value) => updateList("videoUrls", index, value)}
              onAdd={() => addListRow("videoUrls")}
              onRemove={(index) => removeListRow("videoUrls", index)}
              addLabel="Add another video"
            />

            <div><label className="overline-label" htmlFor="product-description">Short description</label><textarea id="product-description" rows={4} value={form.description} onChange={set("description")} className="input-line mt-2 resize-none" /></div>
            <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? "Adding…" : "Add product"} <Plus size={14} /></button>
          </form>
        </section>

        <section className="lg:col-span-7 lg:col-start-7" aria-labelledby="product-list-heading">
          <div className="flex items-end justify-between gap-4">
            <div><p className="overline-label">Current products</p><h2 id="product-list-heading" className="font-serif-display mt-4 text-3xl font-light">{products.length} products</h2></div>
          </div>
          <div className="mt-10 divide-y divide-[#DAD8D2] border-y border-[#DAD8D2]">
            {products.length === 0 && (
              <p className="py-8 text-sm font-light text-[#1C1C1C]/60">No products yet. Add the first recommendation on the left.</p>
            )}
            {products.map((product) => (
              <article key={product.slug} className="flex items-center gap-5 py-5">
                <img src={product.images?.[0]} alt="" className="h-24 w-20 shrink-0 bg-[#EFECE5] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif-display text-xl font-medium">{product.name}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-[#7A8164]">{product.category}</p>
                  <p className="mt-2 text-sm">{formatPrice(product.price)}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#1C1C1C]/50">
                    {(product.images || []).length} photos · {(product.videos || []).length} videos
                  </p>
                </div>
                <button onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#DAD8D2] transition-colors hover:border-red-700 hover:text-red-700"><Trash2 size={16} strokeWidth={1.5} /></button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const UrlListFields = ({
  label,
  hint,
  idPrefix,
  values,
  placeholder,
  onChange,
  onAdd,
  onRemove,
  addLabel,
}) => (
  <div>
    <p className="overline-label">{label}</p>
    <p className="mt-2 text-xs font-light leading-relaxed text-[#1C1C1C]/55">{hint}</p>
    <div className="mt-4 space-y-3">
      {values.map((value, index) => (
        <div key={`${idPrefix}-${index}`} className="flex items-end gap-3">
          <input
            id={`${idPrefix}-${index}`}
            type="url"
            value={value}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={placeholder}
            className="input-line flex-1"
            required={idPrefix === "image-url" && index === 0}
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${label} row ${index + 1}`}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center border border-[#DAD8D2] text-[#1C1C1C]/60 transition-colors hover:border-[#121212] hover:text-[#121212]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
    <button type="button" onClick={onAdd} className="btn-ghost mt-4">
      {addLabel} <Plus size={14} />
    </button>
  </div>
);

export { AdminLogin, AdminDashboard };
