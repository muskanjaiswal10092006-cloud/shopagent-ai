import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, ShieldCheck, Zap, RefreshCw, Truck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Feature Highlights Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Agentic AI Discovery</h4>
                <p className="text-xs text-slate-400">Natural language recommendation</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Razorpay Secure Checkout</h4>
                <p className="text-xs text-slate-400">HMAC-verified test/live payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free doorstep pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand & Agent Synopsis */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ShopAgent<span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your AI Shopping Agent — Discover, compare, decide, and buy. We replace exhausting catalog searches with intelligent conversational commerce and personalized rationale.
            </p>
            <div className="pt-2">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                <span>Try conversational assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-slate-400 hover:text-white transition-colors">
                  AI Shopping Agent
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-white transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-slate-400 hover:text-white transition-colors">
                  Agentic Commerce Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Dresses" className="text-slate-400 hover:text-white transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sneakers" className="text-slate-400 hover:text-white transition-colors">
                  Sneakers & Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Tops" className="text-slate-400 hover:text-white transition-colors">
                  Tops & Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bags" className="text-slate-400 hover:text-white transition-colors">
                  Backpacks & Totes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Watches" className="text-slate-400 hover:text-white transition-colors">
                  Watches & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="text-slate-400 hover:text-white transition-colors">
                  Fashion Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Payments */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-4">Commerce & Safety</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Integrated with Razorpay Test & Live mode for encrypted checkout. All transactions are digitally signed and verified server-side.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Test Mode Available</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Explore end-to-end purchasing safely in test mode with zero risk.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>SYSTEMS ACTIVE</span>
            </div>
            <span>© {new Date().getFullYear()} ShopAgent AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 uppercase tracking-widest text-[10px] font-semibold">
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Security</span>
            <span className="text-slate-600 font-mono">v2.0.4-agentic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
