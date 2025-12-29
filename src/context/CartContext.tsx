'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast({
            variant: "destructive",
            title: "Stock limit reached",
            description: `Cannot add more of ${product.name}.`,
          });
          return prevItems;
        }
      }
      if (product.stock > 0) {
        return [...prevItems, { product, quantity: 1 }];
      } else {
        toast({
            variant: "destructive",
            title: "Out of stock",
            description: `${product.name} is out of stock.`,
        });
        return prevItems;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find(item => item.product.id === productId);
        if (!itemToUpdate) return prevItems;

        if (quantity > 0 && quantity <= itemToUpdate.product.stock) {
            return prevItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            );
        } else if (quantity > itemToUpdate.product.stock) {
             toast({
                variant: "destructive",
                title: "Stock limit reached",
                description: `Only ${itemToUpdate.product.stock} units of ${itemToUpdate.product.name} available.`,
             });
             return prevItems;
        }
        // quantity is 0 or less, so remove it
        return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
