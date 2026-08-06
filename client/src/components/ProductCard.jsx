import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(ShopContext);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div>
        <Link to={`/product/${product._id}`} className="block relative bg-slate-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold rounded-full px-2.5 py-1">
            {product.category}
          </span>
        </Link>

        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-all duration-200">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-amber-500 my-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-xs font-bold text-slate-600">{product.rating}</span>
          </div>

          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <span className="text-base font-black text-slate-900">{formatINR(product.price)}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 font-semibold cursor-pointer shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}