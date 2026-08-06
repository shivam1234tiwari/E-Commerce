import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty, cartTotal, isCartOpen, setIsCartOpen } =
    useContext(ShopContext);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-slate-500 hover:text-slate-800 active:scale-95 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-slate-500 text-center py-8 text-sm">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                  <p className="text-indigo-600 font-black text-xs mt-0.5">{formatINR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-90 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-90 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-slate-400 hover:text-red-500 active:scale-90 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50">
            <div className="flex justify-between font-black text-slate-900 text-base">
              <span>Total Amount</span>
              <span className="text-indigo-600">{formatINR(cartTotal)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-sm shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}