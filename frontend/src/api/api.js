import axios from "./axiosInstance";

export const loginApi = (email, password) =>
  axios.post("/auth/login", { email, password });

export const registerApi = (name, email, password) =>
  axios.post("/auth/register", { name, email, password });

export const getProfileApi = () => axios.get("/auth/profile");

export const getHomepageApi = () => axios.get("/products/home");

export const getProductsApi = (params) => axios.get("/products", { params });

export const getProductDetailApi = (slug) => axios.get(`/products/${slug}`);

export const getCategoriesApi = () => axios.get("/categories");

export const getProductsByCategoryApi = (categorySlug, params) =>
  axios.get(`/products/category/${categorySlug}`, { params });

export const getBestSellersApi = (params) =>
  axios.get("/products/top/bestsellers", { params });

export const getMostViewedApi = (params) =>
  axios.get("/products/top/mostviewed", { params });

export const getCartApi = () => axios.get("/cart");

export const addToCartApi = (productId, quantity) =>
  axios.post("/cart", { productId, quantity });

export const removeCartItemApi = (productId) =>
  axios.delete(`/cart/${productId}`);

export const clearCartApi = () => axios.delete("/cart");

export const createOrderApi = (data) => axios.post("/orders", data);

export const getOrdersApi = () => axios.get("/orders");

export const getOrderDetailApi = (orderId) => axios.get(`/orders/${orderId}`);

export const cancelOrderApi = (orderId) =>
  axios.patch(`/orders/${orderId}/cancel`);
