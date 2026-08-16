// client/src/pages/CheckoutPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';
import { formatINR } from '../utils/currency';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShoppingBag 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems = [], user, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'UPI' | 'Card'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Safe Calculations (Handles undefined/empty arrays gracefully)
  const itemsList = Array.isArray(cartItems) ? cartItems : [];
  const itemsPrice = itemsList.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (itemsList.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        orderItems: itemsList.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      // Create Order in Backend
      await API.post('/orders', orderPayload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/my-orders');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Order Confirmed!</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Thank you for shopping with ShopPulse! Your order has been placed and is being processed.
        </p>
        <p className="text-xs text-indigo-600 font-bold mt-4">Redirecting to your orders...</p>
      </div>
    );
  }

  if (itemsList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Add items before proceeding to checkout</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Secure Checkout</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  placeholder="Rahul Tiwari"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Street Address & Flat / House No.
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingAddress.address}
                  onChange={handleChange}
                  placeholder="Flat 402, Sunshine Residency, Main Road"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="Pune"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  placeholder="411001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Payment Option
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                { id: 'UPI', label: 'UPI / QR Code', desc: 'GPay, PhonePe, Paytm' },
                { id: 'Card', label: 'Debit / Credit Card', desc: 'Visa, MasterCard, RuPay' },
              ].map((method) => (
                <label
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{method.label}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-indigo-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{method.desc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary ({itemsList.length} items)
            </h2>

            {/* Item list preview */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
              {itemsList.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800"
                  />
                  <div className="grow min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {formatINR((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatINR(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatINR(shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST (18%)</span>
                <span>{formatINR(taxPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-indigo-600">{formatINR(totalPrice)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Place Order ({formatINR(totalPrice)})
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-2">
              <Truck className="w-3.5 h-3.5" /> Fast delivery within 2-4 business days
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}