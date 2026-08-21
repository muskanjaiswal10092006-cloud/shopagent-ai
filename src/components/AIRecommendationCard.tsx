import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Layers, Check, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

interface AIRecommendationCardProps {
  product: Product;
  rationale: string;
  matchScore?: number;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  product,
  rationale,
  matchScore = 94,
}) => {
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const [added, setAdded] = useState(false);

  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors[0], product.sizes?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-teal-400/80 shadow-sm hover:shadow-md transition-all p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3.5 group">
      {/* Image Thumbnail */}
      <div className="relative w-full sm:w-28 h-32 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info & Rationale */}
      <div className="flex flex-col justify-between flex-grow gap-2">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Rationale highlight box */}
          <div className="mt-1.5 bg-teal-50/80 border border-teal-200/70 rounded-lg p-2 text-xs text-teal-900 leading-snug flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-teal-800">Why this matches: </span>
              <span>{rationale}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900 font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleCompare}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                inCompare
                  ? 'bg-slate-900 text-teal-400 border-slate-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Compare this item'}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <Link
              to={`/products/${product.id}`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="View product details"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
