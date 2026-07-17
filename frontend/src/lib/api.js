import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const fetchProducts = (params = {}) =>
  axios.get(`${API}/products`, { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  axios.get(`${API}/products/${slug}`).then((r) => r.data);

export const fetchRelated = (slug) =>
  axios.get(`${API}/products/${slug}/related`).then((r) => r.data);

export const fetchCategories = () =>
  axios.get(`${API}/categories`).then((r) => r.data);

export const subscribeNewsletter = (email) =>
  axios.post(`${API}/newsletter`, { email }).then((r) => r.data);

export const submitContact = (data) =>
  axios.post(`${API}/contact`, data).then((r) => r.data);

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
