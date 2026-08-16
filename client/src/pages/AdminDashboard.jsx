// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { formatINR } from '../utils/currency';
import { ShieldCheck, Plus, Trash2, Edit3, Package, Users, DollarSign, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // New Product Modal Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('20');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [prodsRes, ordersRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders').catch(() => ({ data: [] }))
      ]);
      setProducts(Array.isArray(prodsRes.data) ? prodsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const newProd = {
        name,
        brand,
        category,
        price: Number(price),
        image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        countInStock: Number(countInStock),
        description: `Authentic ${name} with manufacturer warranty.`
      };
      const { data } = await API.post('/products', newProd);
      setProducts([data, ...products]);
      setName('');
      setPrice('');
      setBrand('');
      setImage('');
      alert('Product created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Admin Control Center
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Only verified administrators have access to this portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      {/* Tab: Add Product Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreateProduct} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Add Product to Live Catalog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-hidden dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Brand</label>
              <input
                type="text"
                required
                placeholder="Brand Name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-hidden dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-hidden dark:text-white"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Fragrances</option>
                <option>Beauty & Personal Care</option>
                <option>Home & Kitchen</option>
                <option>Books & Stationery</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                placeholder="Price in INR"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-hidden dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-hidden dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Save & Publish Item
          </button>
        </form>
      )}

      {/* Tab: Products List Table */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-black text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.slice(0, 30).map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-100 max-w-[200px] truncate">
                        {prod.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-semibold">{prod.category}</td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">{formatINR(prod.price)}</td>
                    <td className="p-4 font-semibold text-emerald-500">{prod.countInStock} pcs</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}