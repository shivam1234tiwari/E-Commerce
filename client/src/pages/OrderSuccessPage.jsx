import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
      <p className="text-slate-500 mt-2">Thank you for shopping with us.</p>
      <Link
        to="/"
        className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium"
      >
        Continue Shopping
      </Link>
    </div>
  );
}