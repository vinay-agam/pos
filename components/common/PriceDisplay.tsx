'use client';

import { formatPrice } from '@/lib/products';

interface PriceDisplayProps {
  price: number;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ price, currency = 'USD', className = '', size = 'md' }: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formatPrice(price, currency)}
    </span>
  );
}

