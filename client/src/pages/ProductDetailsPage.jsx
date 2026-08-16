// client/src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import {
  Star,
  ShoppingCart,
  Zap,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [error, setError] = useState('');

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {error || 'The product you are looking for does not exist or has been removed.'}
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const inStock = product.countInStock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left: Product Image */}
        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 min-h-[380px] sm:min-h-[460px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[360px] sm:max-h-[420px] w-auto object-contain rounded-xl transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Brand Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-bold text-slate-400">by {product.brand}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                <span>{product.rating?.toFixed(1) || '4.5'}</span>
                <Star className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Verified Product Guarantee
              </span>
            </div>

            {/* Pricing */}
            <div className="pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Stock & Action Block */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Stock status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Availability:</span>
              {inStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.countInStock} units)
                </span>
              ) : (
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Quantity:</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-xl disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-black text-slate-900 dark:text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => Math.min(product.countInStock, prev + 1))}
                    disabled={qty >= product.countInStock}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-xl disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-3.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 active:scale-95 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer border border-indigo-200 dark:border-indigo-800"
              >
                <ShoppingCart className="w-4 h-4" />
                {addedMessage ? 'Added to Cart! ✓' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Guarantees / Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Fast Shipping</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">1-Year Warranty</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">7-Day Return</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}