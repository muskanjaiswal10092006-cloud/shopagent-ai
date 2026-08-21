import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Search,
  ShoppingBag,
  Zap,
  TrendingUp,
  ShieldCheck,
  Send,
  Star,
  Layers
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const EXAMPLE_PROMPTS = [
  'Black dress under ₹2000',
  'Daily use college sneakers',
  'Gift for ₹1500',
  'Waterproof laptop backpack',
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  const handlePromptClick = (prompt: string) => {
    navigate(`/assistant?q=${encodeURIComponent(prompt)}`);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(quickInput.trim())}`);
    }
  };

  // Top featured products for home
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section with Professional Polish 2-Column Layout */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-teal-100/40 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  Agentic Commerce 2025
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                  Shopping, powered by an <span className="text-teal-600">AI agent.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg">
                  Tell us what you need. ShopAgent AI understands your preferences, discovers relevant products, and guides you toward the right purchase.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-1">
                <button
                  onClick={() => navigate('/assistant')}
                  className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800 active:bg-slate-950 transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </button>
                <Link
                  to="/products"
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center"
                >
                  Explore Products
                </Link>
              </div>

              {/* Try these prompts */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Try these prompts
                </p>
                <div className="flex flex-wrap gap-2.5 text-sm">
                  {EXAMPLE_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 cursor-pointer hover:border-teal-400 hover:text-teal-600 transition-all shadow-sm text-xs sm:text-sm font-medium"
                    >
                      '{prompt}'
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive AI Agent Window Mockup */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[520px]">
                {/* Window Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-auto text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    SHOPPING SESSION #842
                  </div>
                </div>

                {/* Simulated Conversation Body */}
                <div className="flex-1 p-5 sm:p-6 space-y-5 overflow-y-auto">
                  {/* User bubble */}
                  <div className="flex flex-col items-end">
                    <div className="bg-teal-600 text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-md">
                      I need a classic minimalist watch under ₹5000.
                    </div>
                  </div>

                  {/* Agent bubble & match card */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-xs">
                      <Bot className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none text-sm shadow-xs leading-relaxed">
                        I found the perfect match for you. It's high-rated and fits your minimalist preference.
                      </div>

                      {/* Product Preview Card */}
                      <div
                        onClick={() => navigate('/products/prod-wat-01')}
                        className="border border-slate-200 rounded-xl p-3 flex gap-3.5 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80"
                          alt="Titan Neo IV Minimalist Watch"
                          className="w-20 h-20 bg-slate-50 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mb-0.5">
                            BEST MATCH
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            Titan Neo IV Minimalist Watch
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-extrabold text-slate-900 font-sans">₹4,495</span>
                            <span className="text-xs text-slate-400 line-through">₹5,995</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/products/prod-wat-01');
                            }}
                            className="w-full py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Agent Insight badge */}
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-[11px] leading-relaxed text-emerald-800">
                          <span className="font-bold">Agent Insight:</span> This matches your ₹5000 budget and 'minimalist' search. It has a 4.8★ rating from 1,200+ verified buyers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Footer */}
                <div className="p-3.5 border-t border-slate-100 bg-slate-50 shrink-0">
                  <form
                    onSubmit={handleQuickSubmit}
                    className="flex gap-2 items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-inner focus-within:border-teal-500 transition-colors"
                  >
                    <div className="text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="Ask the shopping agent..."
                      className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-800 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      className="text-teal-600 hover:text-teal-700 font-bold text-xs uppercase tracking-widest cursor-pointer px-1"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Agentic Commerce Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How ShopAgent AI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            A frictionless agentic shopping flow designed to save hours of manual scrolling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900">Natural-Language Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe your occasion, budget, styling, or specific needs in natural English just as you would to a personal stylist.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900">Understand & Rank</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ShopAgent extracts categories, constraints, and preferences, ranking products mathematically against your exact criteria.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900">Compare & Refine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask follow-up questions, compare trade-offs side-by-side, or request cheaper, more casual, or alternative color options.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900">1-Click Cart & Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instruct the agent to add the best match to your cart, then complete purchase via secure Razorpay payment.
            </p>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Product Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Curated fashion, footwear, bags, watches, and lifestyle essentials.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-200 shadow-xs flex flex-col justify-end p-4 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="font-bold text-base group-hover:text-teal-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular AI Recommendations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Top-rated items frequently recommended by ShopAgent AI.
            </p>
          </div>
          <button
            onClick={() => navigate('/assistant')}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Ask AI to Pick</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
          >
            <span>Browse Full Catalogue ({PRODUCTS.length} Products)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
