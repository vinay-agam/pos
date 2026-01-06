'use client';

import { useState } from 'react';
import { InventoryItem, Product } from '@/types';
import { useShop } from '@/hooks/useShop';
import { updateInventory } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export function InventoryTracker() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const selectedProductData = shopData?.products.find(p => p.id === selectedProduct);

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const handleUpdateStock = (productId: string, sizeId: string | undefined, stock: number) => {
    updateInventory(shopId, productId, sizeId, stock);
    refreshShopData();
  };

  const handleAddStock = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    const product = shopData.products.find(p => p.id === selectedProduct);
    if (!product) return;

    const sizeId = product.sizes.length > 0 ? selectedSize : undefined;
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const stock = parseInt(prompt('Enter stock quantity:') || '0');
    if (isNaN(stock)) return;

    handleUpdateStock(selectedProduct, sizeId, stock);
    setSelectedProduct('');
    setSelectedSize('');
  };

  // Build inventory list from products
  const inventoryItems: InventoryItem[] = [];
  
  shopData.products.forEach(product => {
    if (product.sizes.length > 0) {
      product.sizes.forEach(size => {
        const existing = shopData.inventory.find(
          inv => inv.productId === product.id && inv.sizeId === size.id
        );
        inventoryItems.push(existing || {
          productId: product.id,
          productName: product.name,
          sizeId: size.id,
          sizeName: size.name,
          currentStock: size.stock || 0,
          lastUpdated: new Date().toISOString(),
        });
      });
    } else {
      const existing = shopData.inventory.find(
        inv => inv.productId === product.id && !inv.sizeId
      );
      inventoryItems.push(existing || {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock || 0,
        lastUpdated: new Date().toISOString(),
      });
    }
  });

  const lowStockItems = inventoryItems.filter(
    item => item.minStock !== undefined && item.currentStock <= item.minStock
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Update Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock</DialogTitle>
              <DialogDescription>Select a product and size to update inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Product</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopData.products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProduct && (selectedProductData?.sizes?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <label>Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedProductData?.sizes ?? []).map(size => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleAddStock} className="w-full">
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-700">Low Stock Alert</CardTitle>
            <CardDescription>{lowStockItems.length} item(s) need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.sizeName && <p className="text-sm text-gray-600">Size: {item.sizeName}</p>}
                  </div>
                  <Badge variant="destructive">{item.currentStock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>{inventoryItems.length} item(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item, index) => {
                const isLowStock = item.minStock !== undefined && item.currentStock <= item.minStock;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.sizeName || '-'}</TableCell>
                    <TableCell>
                      <span className={isLowStock ? 'text-red-600 font-bold' : ''}>
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{item.minStock || '-'}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newStock = parseInt(prompt(`Enter new stock for ${item.productName}${item.sizeName ? ` (${item.sizeName})` : ''}:`) || '0');
                          if (!isNaN(newStock)) {
                            handleUpdateStock(item.productId, item.sizeId, newStock);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

