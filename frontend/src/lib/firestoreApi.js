import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured, ADMIN_UID } from "./firebase";
import { auth } from "./firebase";

const PRODUCTS = "products";
const CONTACT = "contact";
const NEWSLETTER = "newsletter";

const slugify = (name) =>
  `${name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "product"}-${Date.now()}`;

const ensureDb = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Add REACT_APP_FIREBASE_* to your .env file.");
  }
  return db;
};

const requireAdmin = () => {
  const current = auth && auth.currentUser;
  if (!current || current.uid !== ADMIN_UID) {
    throw new Error("Admin sign-in required to write to the database.");
  }
};

export const fetchProductsFromFirestore = async (params = {}) => {
  const database = ensureDb();
  const constraints = [];
  if (params.category && params.category !== "All") {
    constraints.push(where("category", "==", params.category));
  }
  if (params.search) {
    constraints.push(where("name", ">=", params.search));
    constraints.push(where("name", "<=", `${params.search}\uf8ff`));
  }
  constraints.push(orderBy("createdAt", "desc"));
  if (params.limit) constraints.push(limit(params.limit));

  const snap = await getDocs(query(collection(database, PRODUCTS), ...constraints));
  const items = snap.docs.map((d) => ({ id: d.id, slug: d.id, ...d.data() }));
  return Promise.all(items.map((p) => normalizeProduct(p)));
};

export const fetchProductFromFirestore = async (slug) => {
  const database = ensureDb();
  const ref = doc(database, PRODUCTS, slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalizeProduct({ id: snap.id, slug: snap.id, ...snap.data() });
};

export const fetchRelatedFromFirestore = async (slug, max = 4) => {
  const database = ensureDb();
  const current = await getDoc(doc(database, PRODUCTS, slug));
  if (!current.exists()) return [];
  const { category } = current.data();
  const q = query(
    collection(database, PRODUCTS),
    where("category", "==", category),
    limit(max + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, slug: d.id, ...d.data() }))
    .filter((p) => p.slug !== slug)
    .slice(0, max);
};

export const fetchCategoriesFromFirestore = async () => {
  const database = ensureDb();
  const snap = await getDocs(query(collection(database, PRODUCTS)));
  const set = new Set();
  snap.forEach((docSnap) => {
    const category = docSnap.data().category;
    if (category) set.add(category);
  });
  return Array.from(set).sort();
};

export const addProductToFirestore = async (product) => {
  const database = ensureDb();
  requireAdmin();
  const slug = product.slug || slugify(product.name || "product");
  const ref = doc(database, PRODUCTS, slug);
  const payload = {
    ...product,
    slug,
    images: Array.isArray(product.images) ? product.images : [],
    videos: Array.isArray(product.videos) ? product.videos : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: ADMIN_UID,
  };
  await setDoc(ref, payload);
  return { slug, ...product };
};

export const deleteProductFromFirestore = async (slug) => {
  const database = ensureDb();
  requireAdmin();
  await deleteDoc(doc(database, PRODUCTS, slug));
  return slug;
};

export const subscribeNewsletterToFirestore = async (email) => {
  const database = ensureDb();
  const clean = String(email || "").trim().toLowerCase();
  if (!clean) throw new Error("Email is required.");
  const ref = doc(collection(database, NEWSLETTER), clean);
  await setDoc(
    ref,
    { email: clean, subscribedAt: serverTimestamp() },
    { merge: true }
  );
  return { email: clean };
};

export const submitContactToFirestore = async (data) => {
  const database = ensureDb();
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(database, CONTACT), payload);
  return { id: ref.id, ...data };
};

const normalizeProduct = async (product) => ({
  ...product,
  images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
  videos: Array.isArray(product.videos) ? product.videos.filter(Boolean) : [],
});

export const firestoreHelpers = {
  slugify,
};
