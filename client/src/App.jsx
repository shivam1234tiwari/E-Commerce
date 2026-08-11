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
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

import { fetchProducts } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors">
      <div>
        <Navbar search={search} setSearch={setSearch} />
        <CartDrawer />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Loading Store...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home products={products} search={search} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminDashboard products={products} setProducts={setProducts} />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}