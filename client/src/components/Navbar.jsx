import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Search } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

export default function Navbar({ search, setSearch }) {
  const { cart, user, logout, setIsCartOpen } = useContext(ShopContext);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 active:scale-95 transition-all duration-200">
          SHOPPULSE
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <input
            type="search"
            placeholder="Search 300+ products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 transition-all duration-200"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Navigation Action Buttons */}
        <nav className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1 text-slate-700 hover:text-indigo-600 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-500 transition-all duration-200 active:scale-95 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}