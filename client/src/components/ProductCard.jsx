// client/src/components/ProductCard.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { Star, ShoppingCart, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const { user, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Guarded Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth');
      return;
    }
    addToCart(product, 1);
  };

  // Guarded Buy Now
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth');
      return;
    }
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group">
      
      {/* Image Container */}
      <Link
        to={`/product/${product._id}`}
        className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-3 relative block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.countInStock <= 5 && product.countInStock > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
            Only {product.countInStock} Left
          </span>
        )}
        {product.countInStock === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Meta */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-black px-2 py-0.5 rounded-md">
            <span>{product.rating?.toFixed(1) || '4.5'}</span>
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing & Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {formatINR(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              title={user ? 'Add to Cart' : 'Login to Add to Cart'}
              className="flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-xl transition cursor-pointer disabled:opacity-40"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.countInStock === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer disabled:opacity-40"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}