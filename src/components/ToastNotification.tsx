import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { lastAddedItem, resetLastAdded } = useCart();

  if (!lastAddedItem) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700/80 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Added to Cart</p>
            <h4 className="text-sm font-bold text-white line-clamp-1">{lastAddedItem.product.name}</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              ₹{lastAddedItem.product.price.toLocaleString('en-IN')} • Qty: {lastAddedItem.quantity} • {lastAddedItem.selectedColor}
            </p>
          </div>
        </div>

        <button
          onClick={resetLastAdded}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={resetLastAdded}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          Continue Shopping
        </button>
        <Link
          to="/cart"
          onClick={resetLastAdded}
          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
