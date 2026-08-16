// client/src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Heart,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      
      {/* 1. Value Proposition / Trust Features Banner */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Free Express Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Orders above ₹999 across India</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">100% Authentic</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Guaranteed verified brands</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">7 Days Easy Return</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">No questions asked refund</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Support</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Live chat & instant AI help</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Navigation Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Shop<span className="text-indigo-400">Pulse</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Your next-generation shopping destination for curated premium electronics, fashion, beauty, and essentials delivered right to your doorstep.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-300 mb-2">Subscribe for exclusive offers</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60">
                  <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative grow">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 outline-hidden focus:border-indigo-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center transition cursor-pointer shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Shop Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/?category=Fragrances" className="hover:text-indigo-400 transition">Fragrances</Link></li>
              <li><Link to="/?category=Books%20%26%20Stationery" className="hover:text-indigo-400 transition">Books & Stationery</Link></li>
              <li><Link to="/?category=Fashion" className="hover:text-indigo-400 transition">Fashion & Apparel</Link></li>
              <li><Link to="/?category=Electronics" className="hover:text-indigo-400 transition">Tech & Gadgets</Link></li>
              <li><Link to="/?category=Home%20%26%20Kitchen" className="hover:text-indigo-400 transition">Home & Kitchen</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Customer Support</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/my-orders" className="hover:text-indigo-400 transition">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition">Shopping Bag</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">Account Settings</Link></li>
              <li><a href="#faq" className="hover:text-indigo-400 transition">Returns & Refunds</a></li>
              <li><a href="#shipping" className="hover:text-indigo-400 transition">Shipping Policies</a></li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Security & Policies</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#terms" className="hover:text-indigo-400 transition">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#security" className="hover:text-indigo-400 transition">PCI-DSS Safe Payments</a></li>
              <li><a href="#sustainability" className="hover:text-indigo-400 transition">Eco-friendly Packaging</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Credits & Payment Badges */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            © 2026 ShopPulse. Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for shoppers everywhere.
          </p>

          {/* Supported Payments */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-wrap justify-center">
            <span className="px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700">UPI</span>
            <span className="px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700">VISA</span>
            <span className="px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700">MasterCard</span>
            <span className="px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700">RuPay</span>
            <span className="px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700">COD</span>
          </div>

        </div>
      </div>

    </footer>
  );
}