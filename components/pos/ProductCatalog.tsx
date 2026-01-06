'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SizeSelector } from '@/components/common/SizeSelector';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { Plus } from 'lucide-react';
import { getProductPrice } from '@/lib/products';

interface ProductCatalogProps {
  onAddToCart: (product: Product, sizeId?: string, quantity?: number) => void;
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const { shopData } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({}); // productId -> sizeId

  if (!shopData) {
    return <div>Loading...</div>;
  }

  const activeProducts = shopData.products.filter(p => p.isActive);
  
  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(activeProducts.map(p => p.category))];

  const handleAddToCart = (product: Product) => {
    const selectedSizeId = selectedProducts[product.id];
    
    if (product.sizes.length > 0 && !selectedSizeId) {
      alert('Please select a size');
      return;
    }

    onAddToCart(product, selectedSizeId);
    // Clear selection after adding
    setSelectedProducts(prev => {
      const next = { ...prev };
      delete next[product.id];
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No products found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <Badge>{product.category}</Badge>
                </CardTitle>
                {product.description && (
                  <CardDescription>{product.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {product.sizes.length > 0 ? (
                  <>
                    <SizeSelector
                      sizes={product.sizes}
                      selectedSizeId={selectedProducts[product.id]}
                      onSelect={(sizeId) => setSelectedProducts(prev => ({ ...prev, [product.id]: sizeId }))}
                      showStock
                    />
                    {selectedProducts[product.id] && (
                      <div className="flex items-center justify-between">
                        <PriceDisplay
                          price={getProductPrice(product, selectedProducts[product.id])}
                          currency={shopData.settings.currency}
                          size="lg"
                        />
                        <Button onClick={() => handleAddToCart(product)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <PriceDisplay
                      price={product.basePrice || 0}
                      currency={shopData.settings.currency}
                      size="lg"
                    />
                    <Button onClick={() => handleAddToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

