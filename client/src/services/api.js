import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dummyjson.com',
});

// Fetch up to 300 products from DummyJSON
export const fetchProducts = async () => {
  const { data } = await API.get('/products?limit=300');
  
  // Normalize DummyJSON product schema to fit the UI
  return data.products.map((item) => ({
    _id: item.id.toString(),
    name: item.title,
    price: item.price,
    category: item.category,
    image: item.thumbnail || item.images?.[0],
    description: item.description,
    rating: item.rating || 4.5,
    stock: item.stock,
    brand: item.brand || 'Generic',
  }));
};

// Fetch single product details by ID
export const fetchProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return {
    _id: data.id.toString(),
    name: data.title,
    price: data.price,
    category: data.category,
    image: data.thumbnail || data.images?.[0],
    description: data.description,
    rating: data.rating || 4.5,
    stock: data.stock,
    brand: data.brand || 'Generic',
  };
};

export default API;