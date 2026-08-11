import axios from 'axios';

// Base URL pointing to Node.js / Express Server
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token from localStorage to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- PRODUCT API CALLS ---
export const fetchProducts = async (keyword = '', pageNumber = 1) => {
  const { data } = await API.get(`/products?keyword=${keyword}&pageNumber=${pageNumber}`);
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProductApi = async (productData) => {
  const { data } = await API.post('/products', productData);
  return data;
};

export const deleteProductApi = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

// --- AUTH API CALLS ---
export const loginApi = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const registerApi = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

export const googleLoginApi = async (googleToken) => {
  const { data } = await API.post('/auth/google', { token: googleToken });
  return data;
};

export const getUserProfileApi = async () => {
  const { data } = await API.get('/auth/profile');
  return data;
};

// --- ORDER API CALLS ---
export const createOrderApi = async (orderData) => {
  const { data } = await API.post('/orders', orderData);
  return data;
};

export const getMyOrdersApi = async () => {
  const { data } = await API.get('/orders/myorders');
  return data;
};

export default API;