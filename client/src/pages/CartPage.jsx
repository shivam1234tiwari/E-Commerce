// client/src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our latest deals and products!
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {cart.reduce((acc, item) => acc + item.qty, 0)} items in your cart
          </p>
        </div>
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:shadow-md transition"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 min-w-0">
                <Link to={`/product/${item._id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700"
                  />
                </Link>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {item.category || 'Product'}
                  </span>
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 hover:text-indigo-600 transition truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {formatINR(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Counter & Delete Button */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                    disabled={item.qty <= 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-xl disabled:opacity-30 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-black text-slate-800 dark:text-slate-200 min-w-[2rem] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-xl transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-sm font-black text-slate-900 dark:text-white min-w-[5rem] text-right">
                  {formatINR(item.price * item.qty)}
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Pricing Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs sticky top-24 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

            <div className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-500 font-bold">FREE</strong>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg">
                  💡 Add items worth <strong>{formatINR(1000 - subtotal)}</strong> more for FREE delivery!
                </p>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition cursor-pointer"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}