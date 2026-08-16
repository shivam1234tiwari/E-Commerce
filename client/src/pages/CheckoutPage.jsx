// client/src/pages/CheckoutPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';
import { formatINR } from '../utils/currency';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, user, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online / UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: {
          address,
          city,
          state,
          pincode,
        },
        paymentMethod,
        totalPrice: grandTotal,
      };

      // 1. Post order to MongoDB Database
      await API.post('/orders', orderData);

      // 2. Clear Cart
      clearCart();

      // 3. Navigate straight to My Orders page where the new order appears
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Secure Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold">1. Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="House/Flat No., Building Name, Street Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {['Online / UPI / NetBanking', 'Cash on Delivery (COD)'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === method
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{method}</span>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs sticky top-24">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>

            {/* Item Previews */}
            <div className="max-h-56 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800 mb-4 pr-1">
              {cart.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : formatINR(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Payable</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Place Order Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}