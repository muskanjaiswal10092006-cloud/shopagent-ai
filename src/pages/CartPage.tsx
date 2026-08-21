import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountTotal,
    deliveryFee,
    promoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    grandTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoInput('');
    } else {
      setPromoError(result.message);
    }
  };

  const isFreeDelivery = deliveryFee === 0;
  const shippingFee = deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any products to your cart yet. Let our AI Shopping Agent help you find the perfect match in seconds!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/assistant')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Discover with AI Assistant</span>
          </button>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
          >
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review your selected items and proceed to secure Razorpay checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              {/* Product Info with Image */}
              <div className="flex items-center gap-4 flex-grow">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/80"
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    {item.product.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {item.selectedColor && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    Unit: ₹{item.product.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900 select-none">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 font-sans">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  {item.product.originalPrice > item.product.price && (
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Saved ₹{((item.product.originalPrice - item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* AI Cross-Sell Banner */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-teal-950">Looking for matching accessories or pairs?</h4>
                <p className="text-[11px] text-teal-800">Ask ShopAgent AI to recommend accessories for your cart items.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/assistant?q=Show+matching+accessories+for+the+items+in+my+cart')}
              className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-teal-900 text-xs font-bold shrink-0 hover:bg-teal-100 transition-colors"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Order Summary Box (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Catalogue Subtotal</span>
                <span className="font-semibold text-slate-900 font-sans">
                  ₹{(subtotal + discountTotal).toLocaleString('en-IN')}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Product Discounts</span>
                  <span>-₹{discountTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {promoDiscount > 0 && promoCode && (
                <div className="flex justify-between text-teal-700 font-semibold bg-teal-50 p-2 rounded-lg border border-teal-200/60 items-center">
                  <span>Coupon ({promoCode})</span>
                  <div className="flex items-center gap-2">
                    <span>-₹{promoDiscount.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[10px] text-slate-400 hover:text-red-500 underline ml-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span className="font-semibold text-slate-900">
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 uppercase font-bold text-xs">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {!isFreeDelivery && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for <strong>FREE Delivery</strong>!
                </p>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900 font-sans">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-slate-400">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. SHOPAGENT10"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 uppercase focus:border-teal-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-red-600 font-medium">{promoError}</p>}
              {promoCode && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Coupon "{promoCode}" applied!
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center text-xs text-slate-500 pt-2">
              <div className="flex items-center justify-center gap-2 text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Protected by Razorpay Test & Live Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
