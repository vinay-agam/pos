'use client';

import { useState } from 'react';
import { CartItem, Transaction, Customer } from '@/types';
import { useShop } from '@/hooks/useShop';
import { addTransaction, addCustomer } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

interface CheckoutProps {
  items: CartItem[];
  subtotal: number;
  onComplete: (
    transactionId: string,
    subtotal: number,
    tax: number,
    discount: number,
    discountType: 'percentage' | 'fixed',
    total: number,
    paymentMethods: Array<{ type: string; amount: number }>,
    customerName?: string,
    employeeName?: string
  ) => void;
}

export function Checkout({ items, subtotal, onComplete }: CheckoutProps) {
  const { shopData, shopId, refreshShopData } = useShop();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital' | 'other'>('cash');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!shopData || !shopId) {
    return null;
  }

  const taxRate = shopData.settings.taxRate || 0;
  const discount = discountValue ? 
    (discountType === 'percentage' ? subtotal * (parseFloat(discountValue) / 100) : parseFloat(discountValue)) 
    : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * (taxRate / 100);
  const total = afterDiscount + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      let customerId: string | undefined;
      
      // Create customer if name provided
      if (customerName.trim()) {
        const customer = addCustomer(shopId, {
          name: customerName,
          email: customerEmail || undefined,
          phone: customerPhone || undefined,
        });
        customerId = customer.id;
      }

      // Create transaction
      const transaction = addTransaction(shopId, {
        customerId,
        customerName: customerName || undefined,
        items,
        subtotal,
        discount,
        discountType,
        tax,
        taxRate,
        total,
        paymentMethods: [{
          type: paymentMethod,
          amount: total,
        }],
        notes: notes || undefined,
      });

      refreshShopData();
      clearCart();
      onComplete(
        transaction.id,
        subtotal,
        tax,
        discount,
        discountType,
        total,
        [{
          type: paymentMethod,
          amount: total,
        }],
        customerName.trim() ? customerName : undefined
      );
    } catch (error) {
      alert('Failed to process transaction');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete the transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-4">
            <h3 className="font-semibold">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  {discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="digital">Digital Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <PriceDisplay price={subtotal} currency={shopData.settings.currency} />
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-<PriceDisplay price={discount} currency={shopData.settings.currency} /></span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between">
                <span>Tax ({taxRate}%):</span>
                <PriceDisplay price={tax} currency={shopData.settings.currency} />
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <PriceDisplay price={total} currency={shopData.settings.currency} size="lg" />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

