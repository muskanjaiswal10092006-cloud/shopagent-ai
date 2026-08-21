import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  Printer,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { recentOrder } = useCart();

  const handlePrint = () => {
    window.print();
  };

  if (!recentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Recent Order Found</h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
          You have not completed any purchases in this session yet. Explore our curated catalogue or ask ShopAgent AI to find what you need.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Explore Catalogue
          </Link>
          <Link
            to="/assistant"
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl font-semibold text-xs transition-colors"
          >
            Ask AI Assistant
          </Link>
        </div>
      </div>
    );
  }

  const order = recentOrder;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-75">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Thank you for shopping with <strong className="text-slate-900">ShopAgent AI</strong>. Your order has been confirmed and forwarded for express dispatch.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
        {/* Order Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 bg-slate-50/60 p-4 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</span>
            <div className="font-mono text-sm font-bold text-slate-900">{order.orderId}</div>
            <div className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="flex flex-col sm:items-end space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment Status</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Verified (PAID)</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">Ref: {order.paymentId}</div>
          </div>
        </div>

        {/* Ordered Products */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            <span>Items Ordered ({order.items?.length || 0})</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                    <p className="text-xs text-slate-500">
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                      {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      {` • Qty: ${item.quantity}`}
                    </p>
                  </div>
                </div>

                <div className="text-right font-extrabold text-slate-900 text-sm font-sans">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              <span>Delivery Address</span>
            </h4>
            <p className="font-bold text-slate-800 text-sm">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p className="text-slate-500">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 sm:text-right">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Payment Summary
            </h4>
            <div className="flex sm:justify-end justify-between gap-4">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex sm:justify-end justify-between gap-4">
              <span>Express Delivery:</span>
              <span className="font-bold text-emerald-700 uppercase">FREE</span>
            </div>
            <div className="flex sm:justify-end justify-between gap-4 pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
              <span>Total Paid:</span>
              <span className="text-xl font-extrabold text-teal-700 font-sans">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/assistant?q=Show+styling+tips+for+my+recent+purchase')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold hover:bg-teal-100 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Ask AI for Styling Tips</span>
          </button>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
