import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Layers,
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Share2,
  Heart,
  ChevronRight
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { ProductCard } from '../components/ProductCard';
import { ProductReviews } from '../components/ProductReviews';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();

  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [liveRating, setLiveRating] = useState<number>(product?.rating || 4.8);
  const [liveReviewCount, setLiveReviewCount] = useState<number>(product?.reviewCount || 0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-600">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || product.colors[0], selectedSize || product.sizes?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || product.colors[0], selectedSize || product.sizes?.[0]);
    navigate('/checkout');
  };

  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-slate-900 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/products?category=${product.category}`} className="hover:text-slate-900 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-teal-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow">
                {product.discount}% OFF
              </span>
            )}
            <button
              onClick={() => toggleCompare(product)}
              className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                inCompare
                  ? 'bg-slate-900 text-teal-400 border border-teal-500/50'
                  : 'bg-white/90 text-slate-700 hover:bg-slate-900 hover:text-white'
              }`}
              title={inCompare ? 'In Comparison' : 'Add to Comparison'}
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>

          {/* AI Agent Verdict Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  ShopAgent AI Analysis
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Best For: <strong className="text-white">{product.bestFor}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Recommended for shoppers seeking top-tier comfort and durability. Holds a high {product.rating}★ customer satisfaction index with verified materials.
            </p>

            <button
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Tell me why I should buy the ${product.name} and compare it with alternatives`)}`)}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-600/30 hover:bg-teal-600/40 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Assistant about this product</span>
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                {product.category}
              </span>

              <a
                href="#customer-reviews"
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/60 font-semibold text-xs transition-colors cursor-pointer"
                title="Scroll down to read and write reviews"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{liveRating}</span>
                <span className="text-slate-500 hover:text-slate-800 underline underline-offset-2">
                  ({liveReviewCount || product.reviewCount} reviews)
                </span>
              </a>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-3xl font-extrabold text-slate-900 font-sans">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 ml-auto">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}% Off)
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Color: <span className="text-slate-900 capitalize">{selectedColor || product.colors[0]}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => {
                    const isSelected = (selectedColor || product.colors[0]) === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Size: <span className="text-slate-900">{selectedSize || product.sizes[0]}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => {
                    const isSelected = (selectedSize || product.sizes[0]) === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">In Stock (Instant Dispatch)</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-teal-400" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Buy Now with Razorpay</span>
              </button>
            </div>
          </div>

          {/* Key Product Features & Badges */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Specifications & Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Truck className="w-4 h-4 text-teal-600" />
                <span>Free delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>100% Genuine</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RotateCcw className="w-4 h-4 text-teal-600" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <ProductReviews
        product={product}
        onRatingUpdate={(newRating, newCount) => {
          setLiveRating(newRating);
          setLiveReviewCount(newCount);
        }}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Similar in {product.category}</h2>
            <Link
              to={`/products?category=${product.category}`}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              View More in Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
