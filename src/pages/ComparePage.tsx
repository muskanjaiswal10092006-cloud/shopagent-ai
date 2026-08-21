import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  ShoppingBag,
  Trash2,
  Plus,
  Check,
  Star,
  ArrowRight,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { compareProductsAPI } from '../services/api';
import { Product } from '../types';

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { comparedProducts, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();

  const [comparisonAnalysis, setComparisonAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('Which of these offers the best value and comfort for everyday college use?');
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  // Auto-run comparison analysis whenever compared products change (if 2 or more)
  useEffect(() => {
    if (comparedProducts.length >= 2) {
      handleRunComparison();
    } else {
      setComparisonAnalysis('');
    }
  }, [comparedProducts]);

  const handleRunComparison = async (question?: string) => {
    if (comparedProducts.length < 2) return;
    setIsAnalyzing(true);
    try {
      const q = question || customQuestion;
      const res = await compareProductsAPI(
        comparedProducts.map((p) => p.id),
        q
      );
      setComparisonAnalysis(res.analysis);
    } catch (e) {
      console.error('Comparison error:', e);
      setComparisonAnalysis(
        'Unable to load live AI comparison. You can inspect the side-by-side specification table below.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, product.colors[0], product.sizes?.[0]);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleAddPopularPair = (p1Id: string, p2Id: string) => {
    clearCompare();
    const p1 = PRODUCTS.find((p) => p.id === p1Id);
    const p2 = PRODUCTS.find((p) => p.id === p2Id);
    if (p1) addToCompare(p1);
    if (p2) addToCompare(p2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200/60">
              Side-by-Side Matrix
            </span>
            <span className="text-xs text-slate-400">({comparedProducts.length} of 4 items selected)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Comparison
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Evaluate price, ratings, features, and AI-driven trade-off rationales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparedProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={() => navigate('/assistant')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">No products in comparison</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Select up to 4 items from the catalogue to compare side-by-side or try one of our popular comparison matchups:
            </p>
          </div>

          {/* Quick preset pairs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <button
              onClick={() => handleAddPopularPair('prod-snk-01', 'prod-snk-02')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Sneakers Matchup</span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 mt-0.5">
                CloudStride Daily vs Velocity Pro Runners
              </h4>
              <span className="text-[11px] text-slate-500">Compare cushion, weight & price</span>
            </button>

            <button
              onClick={() => handleAddPopularPair('prod-dress-01', 'prod-dress-02')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Dresses Matchup</span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 mt-0.5">
                College Skater Dress vs Velvet Evening Dress
              </h4>
              <span className="text-[11px] text-slate-500">Compare fabrics, cuts & occasions</span>
            </button>
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              <span>Browse Products Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Populated Comparison View */
        <div className="space-y-8">
          {/* Quick Add Dropdown */}
          {comparedProducts.length < 4 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-teal-600" />
                Add to Comparison:
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-grow">
                <select
                  value={selectedToAdd}
                  onChange={(e) => setSelectedToAdd(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-600"
                >
                  <option value="">Select a product from catalogue...</option>
                  {PRODUCTS.filter((p) => !comparedProducts.some((cp) => cp.id === p.id)).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price} ({p.category})
                    </option>
                  ))}
                </select>
                <button
                  disabled={!selectedToAdd}
                  onClick={() => {
                    const found = PRODUCTS.find((p) => p.id === selectedToAdd);
                    if (found) {
                      addToCompare(found);
                      setSelectedToAdd('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* AI Comparative Analysis Section */}
          {comparedProducts.length >= 2 && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      ShopAgent AI Comparative Analysis
                    </h3>
                    <p className="text-xs text-slate-400">Intelligent breakdown of pros, cons, and recommendations</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunComparison()}
                    disabled={isAnalyzing}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-400 flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
                  </button>
                </div>
              </div>

              {/* Custom scenario question input */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Ask a specific comparison question (e.g. 'Which is better for daily walking?')..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={() => handleRunComparison(customQuestion)}
                  disabled={isAnalyzing || !customQuestion.trim()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shrink-0 transition-colors"
                >
                  Analyze Question
                </button>
              </div>

              {/* AI Analysis Text Output */}
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                {isAnalyzing ? (
                  <div className="flex items-center gap-3 py-4 text-teal-300">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>ShopAgent AI is synthesizing specifications, durability and value trade-offs...</span>
                  </div>
                ) : (
                  comparisonAnalysis || 'Select at least 2 items to view the AI comparative analysis.'
                )}
              </div>
            </div>
          )}

          {/* Comparison Side-by-Side Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 sm:p-5 w-48 font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Product
                  </th>
                  {comparedProducts.map((prod) => (
                    <th key={prod.id} className="p-4 sm:p-5 font-bold text-slate-900 relative">
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-2 pr-6">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                        />
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{prod.name}</h4>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          {prod.category}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Price Row */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Price</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-extrabold text-slate-900 font-sans">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {prod.discount}% Discount
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Rating & Reviews</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5">
                      <div className="flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{prod.rating}</span>
                        <span className="text-slate-400 font-normal">({prod.reviewCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Best For Row */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Best For</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5 font-medium text-teal-800">
                      <span className="bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-lg">
                        {prod.bestFor}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Occasions Row */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Occasions</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5">
                      <div className="flex flex-wrap gap-1">
                        {prod.occasion.map((occ, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium capitalize"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Available Colors */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Colors</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5">
                      <div className="flex flex-wrap gap-1">
                        {prod.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Features */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Key Features</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 sm:p-5">
                      <ul className="space-y-1.5">
                        {prod.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">Purchase</td>
                  {comparedProducts.map((prod) => {
                    const isAdded = addedItemMap[prod.id];
                    return (
                      <td key={prod.id} className="p-4 sm:p-5">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAddToCart(prod)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Added to Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/products/${prod.id}`}
                            className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Full Details</span>
                          </Link>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
