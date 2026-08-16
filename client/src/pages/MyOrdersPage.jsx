// client/src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { formatINR } from '../utils/currency';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders/myorders');
        // Latest orders first
        setOrders(data.reverse());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">No Orders Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          You haven't placed any orders yet. Start exploring thousands of premium products!
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Orders</h1>
          <p className="text-xs font-semibold text-slate-500">Track and manage your order history</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 text-xs rounded-xl font-bold">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition"
          >
            {/* Order Header Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order Placed
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Amount
                </span>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {formatINR(order.totalPrice)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ship To
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                  {order.shippingAddress?.city || 'Address'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {order.isDelivered ? 'Delivered' : 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: <span className="font-semibold text-slate-600 dark:text-slate-300">{item.qty}</span> × {formatINR(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-black text-slate-900 dark:text-white shrink-0">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}