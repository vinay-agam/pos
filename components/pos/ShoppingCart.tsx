'use client';

import { CartItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Minus, Plus } from 'lucide-react';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { useShop } from '@/hooks/useShop';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, sizeId: string | undefined, quantity: number) => void;
  onRemoveItem: (productId: string, sizeId: string | undefined) => void;
  subtotal: number;
}

export function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  subtotal 
}: ShoppingCartProps) {
  const { shopData } = useShop();

  if (!shopData) {
    return null;
  }

  const currency = shopData.settings.currency;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
        <CardDescription>{items.length} item(s)</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Cart is empty</p>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={`${item.productId}-${item.sizeId || 'none'}-${index}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          {item.sizeName && (
                            <p className="text-sm text-gray-500">Size: {item.sizeName}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <PriceDisplay price={item.unitPrice} currency={currency} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.productId, item.sizeId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 0;
                              onUpdateQuantity(item.productId, item.sizeId, qty);
                            }}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.productId, item.sizeId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <PriceDisplay price={item.totalPrice} currency={currency} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.productId, item.sizeId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Subtotal:</span>
                <PriceDisplay price={subtotal} currency={currency} size="lg" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

