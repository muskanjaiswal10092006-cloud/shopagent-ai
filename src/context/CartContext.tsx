import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: any;
  paymentId: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
}

interface CartContextType {
  items: CartItem[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  promoCode: string | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  grandTotal: number;
  finalTotal: number;
  lastAddedItem: CartItem | null;
  resetLastAdded: () => void;
  recentOrder: OrderDetails | null;
  setRecentOrder: (order: OrderDetails | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopagent_ai_cart_v1';
const PROMO_STORAGE_KEY = 'shopagent_ai_promo_v1';
const ORDER_STORAGE_KEY = 'shopagent_ai_recent_order_v1';

const sanitizeItem = (raw: any): CartItem | null => {
  if (!raw || !raw.product || !raw.product.id) return null;
  const selectedColor = raw.selectedColor || raw.product.colors?.[0] || 'Standard';
  const selectedSize = raw.selectedSize || (raw.product.sizes && raw.product.sizes.length > 0 ? raw.product.sizes[0] : undefined);
  const id = raw.id || `${raw.product.id}-${selectedColor}-${selectedSize || 'nosize'}`;
  const quantity = Math.max(1, typeof raw.quantity === 'number' && !isNaN(raw.quantity) ? raw.quantity : 1);
  return {
    id,
    product: raw.product,
    quantity,
    selectedColor,
    selectedSize,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeItem).filter(Boolean) as CartItem[];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [recentOrder, setRecentOrderState] = useState<OrderDetails | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setRecentOrder = (order: OrderDetails | null) => {
    setRecentOrderState(order);
    try {
      if (order) {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
      } else {
        localStorage.removeItem(ORDER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save order in localStorage', e);
    }
  };

  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promoCode to localStorage', e);
    }
  }, [promoCode]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    color?: string,
    size?: string
  ) => {
    const selectedColor = color || product.colors[0] || 'Standard';
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const itemInstanceId = `${product.id}-${selectedColor}-${selectedSize || 'nosize'}`;
    const addQty = Math.max(1, quantity);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemInstanceId || (item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize));
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + addQty;
        const maxStock = product.stock || 20;
        updated[existingIndex] = {
          ...updated[existingIndex],
          id: itemInstanceId,
          quantity: Math.min(newQty, maxStock),
        };
        setLastAddedItem(updated[existingIndex]);
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemInstanceId,
          product,
          quantity: Math.min(addQty, product.stock || 20),
          selectedColor,
          selectedSize,
        };
        setLastAddedItem(newItem);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const hasExact = prev.some((item) => item.id === itemId);
      if (hasExact) {
        return prev.filter((item) => item.id !== itemId);
      }
      return prev.filter((item) => item.product?.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return; // Keep minimum 1 as specified
    setItems((prev) => {
      const hasExact = prev.some((item) => item.id === itemId);
      return prev.map((item) => {
        const matches = hasExact ? item.id === itemId : item.product?.id === itemId;
        if (matches) {
          const maxStock = item.product?.stock || 20;
          return {
            ...item,
            quantity: Math.min(Math.max(1, quantity), maxStock),
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
  };

  const resetLastAdded = () => setLastAddedItem(null);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const discountTotal = items.reduce((sum, item) => {
    const originalPrice = item.product?.originalPrice || item.product?.price || 0;
    const currentPrice = item.product?.price || 0;
    const diff = Math.max(0, originalPrice - currentPrice);
    return sum + diff * item.quantity;
  }, 0);

  let promoDiscount = 0;
  if (promoCode && subtotal > 0) {
    const code = promoCode.toUpperCase();
    if (code === 'SHOPAGENT10' || code === 'SHOPAI10' || code === 'AGENT10') {
      promoDiscount = Math.round(subtotal * 0.1); // 10% off
    } else if (code === 'FIRSTBUY' || code === 'WELCOME200') {
      promoDiscount = Math.min(200, Math.round(subtotal * 0.5)); // ₹200 off
    } else if (code === 'FREESHIP') {
      promoDiscount = 0;
    }
  }

  const subtotalAfterPromo = Math.max(0, subtotal - promoDiscount);
  // Free delivery over ₹999 or empty cart or FREESHIP
  const deliveryFee = subtotal === 0 || subtotalAfterPromo >= 999 || promoCode === 'FREESHIP' ? 0 : 99;
  const grandTotal = subtotal === 0 ? 0 : subtotalAfterPromo + deliveryFee;

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SHOPAGENT10' || clean === 'SHOPAI10' || clean === 'AGENT10') {
      setPromoCode(clean);
      return { success: true, message: `Coupon "${clean}" applied! 10% discount added.` };
    }
    if (clean === 'FIRSTBUY' || clean === 'WELCOME200') {
      setPromoCode(clean);
      return { success: true, message: `Coupon "${clean}" applied! Flat ₹200 discount added.` };
    }
    if (clean === 'FREESHIP') {
      setPromoCode(clean);
      return { success: true, message: 'Coupon "FREESHIP" applied! Free shipping active.' };
    }
    return { success: false, message: 'Invalid coupon code. Try "SHOPAGENT10" or "FIRSTBUY"' };
  };

  const removePromoCode = () => {
    setPromoCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cart: items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountTotal,
        deliveryFee,
        promoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        grandTotal,
        finalTotal: grandTotal,
        lastAddedItem,
        resetLastAdded,
        recentOrder,
        setRecentOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
