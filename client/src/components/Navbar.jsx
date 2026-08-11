import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Search, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar({ search, setSearch }) {
  const { cart, user, logout, setIsCartOpen } = useContext(ShopContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 active:scale-95 transition-all">
          SHOPPULSE
        </Link>

        <div className="flex-1 max-w-md relative">
          <input
            type="search"
            placeholder="Search 300+ products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700 transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <nav className="flex items-center space-x-3 sm:space-x-5">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-90 transition cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin Dashboard Quick Link */}
          <Link
            to="/admin"
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 transition"
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 hover:text-indigo-600 transition">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">{user.name}</span>
              </Link>
              <button onClick={logout} className="text-slate-500 hover:text-red-500 active:scale-95 transition cursor-pointer">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}