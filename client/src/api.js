import axios from 'axios';

const API_BASE = "https://flipkart-clone-production-8a9f.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity });
export const updateCartItem = (id, quantity) =>
  api.put(`/cart/${id}`, { quantity });
export const removeCartItem = (id) => api.delete(`/cart/${id}`);

// Orders
export const placeOrder = (shippingAddress) =>
  api.post('/orders', { shippingAddress });
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);

export default api;
