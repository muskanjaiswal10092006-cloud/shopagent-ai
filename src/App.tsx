import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ComparePage } from './pages/ComparePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { InsightsPage } from './pages/InsightsPage';

export default function App() {
  return (
    <CartProvider>
      <CompareProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white font-sans">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Real-time Cart/Compare Notification Toast */}
            <ToastNotification />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </CartProvider>
  );
}
