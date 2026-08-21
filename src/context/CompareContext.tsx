import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface CompareContextType {
  comparedProducts: Product[];
  addToCompare: (product: Product) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'shopagent_ai_compare_v1';

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        return PRODUCTS.filter((p) => ids.includes(p.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const ids = comparedProducts.map((p) => p.id);
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save compare state', e);
    }
  }, [comparedProducts]);

  const isInCompare = (productId: string) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  const addToCompare = (product: Product): { success: boolean; message: string } => {
    if (isInCompare(product.id)) {
      return { success: false, message: 'Item already in comparison' };
    }
    if (comparedProducts.length >= 4) {
      return { success: false, message: 'You can compare up to 4 products at once' };
    }
    setComparedProducts((prev) => [...prev, product]);
    return { success: true, message: `${product.name} added to comparison` };
  };

  const removeFromCompare = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        toggleCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
