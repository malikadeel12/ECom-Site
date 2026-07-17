import axios from "axios";
import { mockApi } from "./mockData";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null;

const useMock = !API;

export const fetchProducts = (params = {}) =>
  useMock ? mockApi.fetchProducts(params) : axios.get(`${API}/products`, { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  useMock ? mockApi.fetchProduct(slug) : axios.get(`${API}/products/${slug}`).then((r) => r.data);

export const fetchRelated = (slug) =>
  useMock ? mockApi.fetchRelated(slug) : axios.get(`${API}/products/${slug}/related`).then((r) => r.data);

export const fetchCategories = () =>
  useMock ? mockApi.fetchCategories() : axios.get(`${API}/categories`).then((r) => r.data);

export const subscribeNewsletter = (email) =>
  useMock ? mockApi.subscribeNewsletter(email) : axios.post(`${API}/newsletter`, { email }).then((r) => r.data);

export const submitContact = (data) =>
  useMock ? mockApi.submitContact(data) : axios.post(`${API}/contact`, data).then((r) => r.data);

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
