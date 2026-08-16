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
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export default function CartPage() {
  const { 
    cartItems = [], 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    user 
  } = useContext(ShopContext);
  
  const navigate = useNavigate();

  // Safe Array Handling
  const itemsList = Array.isArray(cartItems) ? cartItems : [];

  // Calculations
  const itemsPrice = itemsList.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  if (itemsList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-3xl flex items-center justify-center mb-5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 mb-6">
          Looks like you haven't added any products to your bag yet. Explore our latest collection!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <span className="font-bold text-indigo-600">{itemsList.length} unique items</span> in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {itemsList.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              {/* Product Thumbnail */}
              <Link
                to={`/product/${item._id}`}
                className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 shrink-0 flex items-center justify-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </Link>

              {/* Details */}
              <div className="grow w-full text-center sm:text-left space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                  {item.category || 'Product'}
                </span>
                <Link to={`/product/${item._id}`}>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs font-black text-slate-900 dark:text-slate-100 pt-1">
                  {formatINR(item.price)} <span className="text-[10px] font-normal text-slate-400">/ unit</span>
                </p>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1">
                  <button
                    onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                    className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                    {item.quantity || 1}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                    className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 block">
                    {formatINR((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Delivery</span>
                <span>
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatINR(shippingPrice)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST (18%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(taxPrice)}</span>
              </div>

              {shippingPrice > 0 && (
                <p className="text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl">
                  Add items worth <span className="font-bold">{formatINR(1000 - itemsPrice)}</span> more for <strong>FREE Delivery</strong>!
                </p>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-indigo-600">{formatINR(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Safe & Secure Checkout
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-500" /> Free Returns within 7 Days
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}