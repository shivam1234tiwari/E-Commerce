import React, { useState } from 'react';
import { formatINR } from '../utils/currency';
import { Plus, Package, ShoppingBag, Users, DollarSign, Trash2 } from 'lucide-react';

export default function AdminDashboard({ products, setProducts }) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const created = {
      _id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'General',
      image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      description: 'Newly added store product.',
      rating: 5.0,
    };

    setProducts([created, ...products]);
    setNewProduct({ name: '', price: '', category: '', image: '' });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] text-slate-800 dark:text-slate-100">
      <h1 className="text-2xl font-black mb-6">Store Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Sales</p>
            <h3 className="text-xl font-black">{formatINR(12450)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Orders</p>
            <h3 className="text-xl font-black">148</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Active Products</p>
            <h3 className="text-xl font-black">{products.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Customers</p>
            <h3 className="text-xl font-black">1,240</h3>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8 space-y-4">
        <h2 className="text-lg font-bold">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            required
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm"
          />
          <input
            type="number"
            placeholder="Price (USD)"
            required
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </form>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold">Manage Inventory</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase font-bold text-slate-500">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.slice(0, 10).map((p) => (
                <tr key={p._id}>
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-slate-100" />
                    <span className="font-semibold line-clamp-1">{p.name}</span>
                  </td>
                  <td className="p-4 uppercase">{p.category}</td>
                  <td className="p-4 font-bold">{formatINR(p.price)}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}