import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Star,
  Check,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCategory, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const occasionsList = ['college', 'party', 'casual', 'gifting', 'formal', 'sports', 'travel', 'summer'];

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceMax(5000);
    setMinRating(0);
    setSelectedOccasions([]);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesTags && !matchesDesc) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Price
      if (product.price > priceMax) return false;

      // 4. Rating
      if (minRating > 0 && product.rating < minRating) return false;

      // 5. Occasion
      if (selectedOccasions.length > 0) {
        const matchesOccasion = selectedOccasions.some((occ) =>
          product.occasion.some((po) => po.toLowerCase().includes(occ.toLowerCase())) ||
          product.tags.some((t) => t.toLowerCase().includes(occ.toLowerCase()))
        );
        if (!matchesOccasion) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      return 0; // featured default
    });
  }, [searchQuery, selectedCategory, priceMax, minRating, selectedOccasions, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalogue
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Discover {PRODUCTS.length} curated fashion, lifestyle, and footwear essentials in Indian Rupees (₹).
          </p>
        </div>

        {/* AI Shopping Assistant CTA */}
        <button
          onClick={() => navigate('/assistant')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold hover:bg-teal-100/80 transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Can't find what you need? Ask AI</span>
        </button>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span>{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-teal-700">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>₹500</span>
              <span>₹2,500</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Customer Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { label: 'All', value: 0 },
                { label: '4.5★+', value: 4.5 },
                { label: '4.8★+', value: 4.8 },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setMinRating(r.value)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                    minRating === r.value
                      ? 'bg-amber-500 border-amber-600 text-white font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Occasion
            </label>
            <div className="flex flex-wrap gap-1.5">
              {occasionsList.map((occ) => {
                const active = selectedOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    onClick={() => toggleOccasion(occ)}
                    className={`text-xs px-2.5 py-1 rounded-full border capitalize transition-colors ${
                      active
                        ? 'bg-teal-600 border-teal-600 text-white font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Results (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Count & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {PRODUCTS.length} products
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:border-teal-600"
                >
                  <option value="featured">Featured Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory !== 'All' || selectedOccasions.length > 0 || searchQuery || minRating > 0 || priceMax < 5000) && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {priceMax < 5000 && (
                <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Under ₹{priceMax}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setPriceMax(5000)} />
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  {minRating}★+
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setMinRating(0)} />
                </span>
              )}
              {selectedOccasions.map((occ) => (
                <span key={occ} className="bg-teal-50 text-teal-800 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  {occ}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleOccasion(occ)} />
                </span>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-teal-700 hover:text-teal-800 font-bold underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your specific combination of filters.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => navigate(`/assistant?q=${encodeURIComponent(searchQuery || 'Find best products')}`)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
