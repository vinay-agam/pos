'use client';

import { ProductSize } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selectedSizeId?: string;
  onSelect: (sizeId: string) => void;
  showStock?: boolean;
  className?: string;
}

export function SizeSelector({ 
  sizes, 
  selectedSizeId, 
  onSelect, 
  showStock = false,
  className 
}: SizeSelectorProps) {
  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {sizes.map((size) => {
        const isSelected = selectedSizeId === size.id;
        const isOutOfStock = showStock && size.stock !== undefined && size.stock <= 0;

        return (
          <Button
            key={size.id}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => !isOutOfStock && onSelect(size.id)}
            disabled={isOutOfStock}
            className={cn(
              isSelected && 'ring-2 ring-primary ring-offset-2',
              isOutOfStock && 'opacity-50 cursor-not-allowed'
            )}
          >
            {size.name}
            {showStock && size.stock !== undefined && (
              <span className="ml-1 text-xs">({size.stock})</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

