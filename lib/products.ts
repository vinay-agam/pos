// Product templates and utilities

import { Product, ProductSize } from '@/types';

/**
 * Default sizes for photo frames and prints
 */
export const DEFAULT_SIZES: Omit<ProductSize, 'id'>[] = [
  { name: '4x6', price: 0 },
  { name: '5x7', price: 0 },
  { name: '8x10', price: 0 },
  { name: '11x14', price: 0 },
  { name: '16x20', price: 0 },
  { name: '20x24', price: 0 },
  { name: '24x36', price: 0 },
];

/**
 * Create product size with ID
 */
export function createProductSize(size: Omit<ProductSize, 'id'>): ProductSize {
  return {
    ...size,
    id: `size-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  };
}

/**
 * Create photo frame product template
 */
export function createPhotoFrameTemplate(name: string, basePrices: Record<string, number> = {}): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  const sizes: ProductSize[] = DEFAULT_SIZES.map(size => ({
    ...createProductSize(size),
    price: basePrices[size.name] || size.price,
  }));

  return {
    name,
    category: 'photo-frame',
    description: 'Photo frame',
    sizes,
    isActive: true,
  };
}

/**
 * Create photo print product template
 */
export function createPhotoPrintTemplate(name: string, basePrices: Record<string, number> = {}): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  const sizes: ProductSize[] = DEFAULT_SIZES.map(size => ({
    ...createProductSize(size),
    price: basePrices[size.name] || size.price,
  }));

  return {
    name,
    category: 'photo-print',
    description: 'Photo print',
    sizes,
    isActive: true,
  };
}

/**
 * Create customized gift product template
 */
export function createCustomizedGiftTemplate(name: string, basePrice: number = 0): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name,
    category: 'customized-gift',
    description: 'Customized gift',
    sizes: [],
    basePrice,
    isActive: true,
  };
}

/**
 * Get default prices for photo frames (example)
 */
export function getDefaultFramePrices(): Record<string, number> {
  return {
    '4x6': 5.99,
    '5x7': 7.99,
    '8x10': 9.99,
    '11x14': 14.99,
    '16x20': 19.99,
    '20x24': 24.99,
    '24x36': 34.99,
  };
}

/**
 * Get default prices for photo prints (example)
 */
export function getDefaultPrintPrices(): Record<string, number> {
  return {
    '4x6': 0.29,
    '5x7': 0.49,
    '8x10': 0.99,
    '11x14': 2.99,
    '16x20': 4.99,
    '20x24': 7.99,
    '24x36': 12.99,
  };
}

/**
 * Get product price (handles both sized and non-sized products)
 */
export function getProductPrice(product: Product, sizeId?: string): number {
  if (product.sizes.length > 0) {
    const size = product.sizes.find(s => s.id === sizeId);
    return size?.price || 0;
  }
  return product.basePrice || 0;
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

