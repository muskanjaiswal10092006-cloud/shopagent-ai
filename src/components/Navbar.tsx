import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Layers,
  BarChart3,
  Search,
  Menu,
  X,
  Bot,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { comparedProducts } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Assistant', path: '/assistant', highlight: true },
    { label: 'Products', path: '/products' },
    { label: 'Compare', path: '/compare', badge: comparedProducts?.length || 0 },
    { label: 'Insights', path: '/insights' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 shrink-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="ShopAgent AI Home"
          >
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ShopAgent <span className="text-teal-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors relative py-1 flex items-center gap-1.5 ${
                    active
                      ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                      : 'hover:text-teal-600 text-slate-600'
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-teal-500'}`} />
                  )}
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Compare icon button */}
            <Link
              to="/compare"
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex items-center"
              title="Compare Products"
            >
              <Layers className="w-5 h-5" />
              {(comparedProducts?.length || 0) > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {comparedProducts.length}
                </span>
              )}
            </Link>

            {/* Cart icon button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Shop with AI Primary Button */}
            <button
              onClick={() => navigate('/assistant')}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-sm transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Shop with AI</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.highlight && <Sparkles className="w-4 h-4 text-teal-600" />}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/assistant');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow transition-colors"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Shop with AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
