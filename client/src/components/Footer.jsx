// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-16">
      {/* Guarantees Bar */}
      <div className="border-b border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Free Express Delivery</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">7-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Genuine Brands</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">24/7 AI & Live Support</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant assistance anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">
              SHOP<span className="text-indigo-600">PULSE</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            India’s premier online store for authentic gadgets, signature fragrances, designer fashion, and lifestyle essentials.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Shop Categories
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li><Link to="/" className="hover:text-indigo-600 transition">Electronics</Link></li>
            <li><Link to="/" className="hover:text-indigo-600 transition">Fashion & Apparel</Link></li>
            <li><Link to="/" className="hover:text-indigo-600 transition">Signature Fragrances</Link></li>
            <li><Link to="/" className="hover:text-indigo-600 transition">Beauty & Skincare</Link></li>
            <li><Link to="/" className="hover:text-indigo-600 transition">Home & Kitchen</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li><Link to="/my-orders" className="hover:text-indigo-600 transition">Track My Orders</Link></li>
            <li><Link to="/profile" className="hover:text-indigo-600 transition">My Profile & Address</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-600 transition">Shopping Bag</Link></li>
            <li><Link to="/auth" className="hover:text-indigo-600 transition">Account Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Stay Updated
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Subscribe for flash deals and exclusive drops.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter!'); }} className="space-y-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-indigo-500 outline-hidden dark:text-white"
            />
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-6 text-center text-[11px] font-semibold text-slate-400">
        © 2026 ShopPulse India. All rights reserved. Built with ❤️ for seamless shopping.
      </div>
    </footer>
  );
}