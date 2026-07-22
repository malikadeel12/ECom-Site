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

export const fetchProducts = (params = {}) => fetchProductsFromFirestore(params);
export const fetchProduct = (slug) => fetchProductFromFirestore(slug);
export const fetchRelated = (slug) => fetchRelatedFromFirestore(slug);
export const fetchCategories = () => fetchCategoriesFromFirestore();
export const subscribeNewsletter = (email) => subscribeNewsletterToFirestore(email);
export const submitContact = (data) => submitContactToFirestore(data);
export const addProduct = (product) => addProductToFirestore(product);
export const deleteProduct = (slug) => deleteProductFromFirestore(slug);

export const dataSource = "firebase";

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
