import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(ShopContext);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Strictly Only Product Image Container */}
        <Link to={`/product/${product._id}`} className="block relative bg-white dark:bg-slate-800 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1 hover:text-indigo-600 transition">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-amber-500 my-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{product.rating}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
        <span className="text-base font-black text-slate-900 dark:text-white">{formatINR(product.price)}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold cursor-pointer shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}