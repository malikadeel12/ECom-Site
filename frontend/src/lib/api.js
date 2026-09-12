import {
  addProductToFirestore,
  deleteProductFromFirestore,
  fetchCategoriesFromFirestore,
  fetchProductFromFirestore,
  fetchProductsFromFirestore,
  fetchRelatedFromFirestore,
  submitContactToFirestore,
  subscribeNewsletterToFirestore,
} from "./firestoreApi";
import { HOME_SHOWCASE_PRODUCTS } from "./homeShowcase";

export const fetchProducts = (params = {}) => fetchProductsFromFirestore(params);

// Firestore first; homepage samples fill in when a slug is only on the landing page.
export const fetchProduct = async (slug) => {
  try {
    const fromDb = await fetchProductFromFirestore(slug);
    if (fromDb) return fromDb;
  } catch {
    // Missing Firebase config should not hide the homepage sample products.
  }
  return HOME_SHOWCASE_PRODUCTS.find((item) => item.slug === slug) || null;
};
export const fetchRelated = (slug) => fetchRelatedFromFirestore(slug);
export const fetchCategories = () => fetchCategoriesFromFirestore();
export const subscribeNewsletter = (email) => subscribeNewsletterToFirestore(email);
export const submitContact = (data) => submitContactToFirestore(data);
export const addProduct = (product) => addProductToFirestore(product);
export const deleteProduct = (slug) => deleteProductFromFirestore(slug);

export const dataSource = "firebase";

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
