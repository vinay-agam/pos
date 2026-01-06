// Product templates and utilities

import { Product, ProductSize } from '@/types';

/**
 * Default sizes for photo frames and prints
 */
export const DEFAULT_SIZES: Omit<ProductSize, 'id'>[] = [
  { name: '4x6', price: 0 },
  { name: '8x10', price: 0 },
  { name: '8x12', price: 0 },
  { name: '10x12', price: 0 },
  { name: '12x15', price: 0 },
  { name: '12x18', price: 0 },
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
    '4x6': 150,
    '8x10': 250,
    '8x12': 300,
    '10x12': 350,
    '12x15': 550,
    '12x18': 800,
    '16x20': 1200,
    '20x24': 1800,
    '24x36': 2200,
  };
}

/**
 * Get default prices for photo prints (example)
 */
export function getDefaultPrintPrices(): Record<string, number> {
  return {
    '4x3r': 60,
    '4x3': 80,
    '4x6': 100,
    '8x10': 120,
    '8x12': 150,
    '10x12': 200,
    '12x15': 250,
    '12x18': 350,
    '16x20': 550,
    '20x24': 690,
    '24x36': 990,
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
export function formatPrice(price: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(price);
}

