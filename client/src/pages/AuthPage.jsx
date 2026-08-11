import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockUser = { name: isLogin ? email.split('@')[0] : name, email };
    login(mockUser, 'mock-jwt-token-12345');
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6 bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200 dark:border-slate-800">
        
        {/* Left Side Image Panel - Hidden on Mobile, Visible on Laptop/Desktop */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-slate-900 text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
            alt="E-commerce shopping showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-400" />
            <span className="text-xl font-black tracking-wider text-indigo-400">SHOPPULSE</span>
          </div>

          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold leading-tight">
              {isLogin ? 'Welcome Back to Your Shopping Hub!' : 'Start Your Premium Shopping Journey.'}
            </h3>
            <p className="text-sm text-slate-300">
              {isLogin
                ? 'Sign in to access your orders, saved items, and personalized recommendations.'
                : 'Create an account to unlock exclusive deals, order tracking, and seamless checkout.'}
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SHOPPULSE Inc.
          </div>
        </div>

        {/* Right Side Auth Form - Adapts to Mobile & Desktop */}
        <div className="p-6 sm:p-12 flex flex-col justify-center">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isLogin ? 'Sign In' : 'Create an Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {isLogin ? 'Enter your credentials to continue.' : 'Fill in the details below to register.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Tiwari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md text-sm"
            >
              {isLogin ? 'Sign In' : 'Register'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign up here"
                : 'Already have an account? Sign in here'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}