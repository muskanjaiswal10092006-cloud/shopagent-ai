import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Layers, Check, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

interface ProductCardProps {
  product: Product;
  highlightReason?: string;
  showCompact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  highlightReason,
  showCompact = false,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();

  const [added, setAdded] = useState(false);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1, product.colors[0], product.sizes?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleCompare(product);
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            {product.discount}% OFF
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60">
          {product.category}
        </div>

        {/* Quick Compare Floating Button */}
        <button
          onClick={handleToggleCompare}
          className={`absolute bottom-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
            inCompare
              ? 'bg-slate-900 text-teal-400 border border-teal-500/40'
              : 'bg-white/90 text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200/60'
          }`}
          title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              {product.brand || 'ShopAgent Select'}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-amber-700 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
            {product.name}
          </h3>

          {/* Optional Agent Highlight */}
          {highlightReason && (
            <div className="mt-2 text-xs bg-teal-50 text-teal-800 p-2 rounded-lg border border-teal-200/60 flex items-start gap-1.5">
              <span className="text-teal-600 font-bold">★</span>
              <span className="line-clamp-2">{highlightReason}</span>
            </div>
          )}

          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && !showCompact && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] text-slate-400 font-medium">Colors:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.colors.slice(0, 3).map((c, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded"
                  >
                    {c}
                  </span>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-700 ml-auto">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <Link
              to={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
