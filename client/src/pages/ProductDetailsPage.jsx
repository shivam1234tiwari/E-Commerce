import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { ShopContext } from '../context/ShopContext';
import { Star, ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2 } from 'lucide-react';

export default function ProductDetailsPage({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    // 1. First check if product exists in local products state
    const existingProduct = products.find((p) => p._id === id);
    if (existingProduct) {
      setProduct(existingProduct);
      setSelectedImage(existingProduct.image);
      setLoading(false);
    } else {
      // 2. Fallback to API fetch by ID if accessed directly via URL
      fetchProductById(id)
        .then((data) => {
          setProduct(data);
          setSelectedImage(data.image);
        })
        .catch((err) => console.error('Failed to load product details:', err))
        .finally(() => setLoading(false));
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-slate-600 font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Product Not Found</h3>
        <p className="text-slate-500 text-sm mt-2">The requested product does not exist or was removed.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-sm mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Left Column: Image Showcase */}
        <div className="space-y-4">
          <div className="w-full h-80 sm:h-96 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition duration-300"
            />
          </div>
        </div>

        {/* Right Column: Product Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Brand: <strong className="text-slate-800">{product.brand}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200/50 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating} / 5.0</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock ({product.stock} available)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
              <span className="text-xs text-slate-400 font-medium">Free Shipping & Taxes Included</span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action & Value Props */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Fast Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>100% Authentic Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}