// Shopping cart hook

import { useState, useCallback } from 'react';
import { CartItem, Product } from '@/types';
import { getProductPrice } from '@/lib/products';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, sizeId?: string, quantity: number = 1) => {
    const unitPrice = getProductPrice(product, sizeId);
    const size = sizeId ? product.sizes.find(s => s.id === sizeId) : undefined;

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.sizeId === sizeId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * unitPrice;
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sizeId,
          sizeName: size?.name,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string, sizeId?: string) => {
    setItems(prev => prev.filter(
      item => !(item.productId === productId && item.sizeId === sizeId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, sizeId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, sizeId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.sizeId === sizeId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

