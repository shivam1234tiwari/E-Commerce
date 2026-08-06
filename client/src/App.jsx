import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import { fetchProducts } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products from DummyJSON:', err);
        setError('Failed to fetch products. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <div>
        <Navbar search={search} setSearch={setSearch} />
        <CartDrawer />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p className="text-slate-600 font-medium text-sm">Loading products from DummyJSON...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto my-16 text-center p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home products={products} search={search} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}