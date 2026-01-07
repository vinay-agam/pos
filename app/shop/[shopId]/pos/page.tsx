'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { ProductCatalog } from '@/components/pos/ProductCatalog';
import { ShoppingCart } from '@/components/pos/ShoppingCart';
import { Checkout } from '@/components/pos/Checkout';
import { Receipt } from '@/components/pos/Receipt';
import { useCart } from '@/hooks/useCart';
import { useShop } from '@/hooks/useShop';
import { Product, Transaction } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart as CartIcon, Receipt as ReceiptIcon } from 'lucide-react';

export default function POSPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <POSContent 
          shopId={shopId}
          completedTransaction={completedTransaction}
          setCompletedTransaction={setCompletedTransaction}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ShopProvider>
    </PasswordGate>
  );
}

function POSContent({ 
  shopId,
  completedTransaction,
  setCompletedTransaction,
  activeTab,
  setActiveTab
}: {
  shopId: string;
  completedTransaction: Transaction | null;
  setCompletedTransaction: (transaction: Transaction | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { shopData } = useShop();
  const cart = useCart();
  const router = useRouter();

  const handleAddToCart = (product: Product, sizeId?: string) => {
    cart.addItem(product, sizeId, 1);
    // setActiveTab('cart');
  };

  const handleCompleteTransaction = (
    transactionId: string,
    subtotal: number,
    tax: number,
    discount: number,
    discountType: 'percentage' | 'fixed',
    total: number,
    paymentMethods: Array<{ type: string; amount: number }>,
    customerName?: string,
    employeeName?: string
  ) => {
    setCompletedTransaction({
      id: transactionId,
      transactionNumber: `TXN-${Date.now()}`,
      items: cart.items,
      subtotal,
      tax,
      taxRate: shopData?.settings.taxRate || 0,
      discount,
      discountType,
      total,
      paymentMethods,
      customerName,
      employeeName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Transaction);
    setActiveTab('receipt');
  };

  const handleNewSale = () => {
    setCompletedTransaction(null);
    cart.clearCart();
    setActiveTab('catalog');
  };

  if (completedTransaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleNewSale}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← New Sale
            </button>
          </div>
          <Receipt transaction={completedTransaction} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <p className="text-gray-600">{shopData?.shopName || shopId}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalog">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="cart">
              <CartIcon className="h-4 w-4 mr-2" />
              Cart ({cart.itemCount})
            </TabsTrigger>
            <TabsTrigger value="checkout" disabled={cart.items.length === 0}>
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Checkout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            <ProductCatalog onAddToCart={handleAddToCart} />
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ShoppingCart
                  items={cart.items}
                  subtotal={cart.subtotal}
                  onUpdateQuantity={cart.updateQuantity}
                  onRemoveItem={cart.removeItem}
                />
              </div>
              <div>
                <Checkout
                  items={cart.items}
                  subtotal={cart.subtotal}
                  onComplete={handleCompleteTransaction}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checkout" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <Checkout
                items={cart.items}
                subtotal={cart.subtotal}
                onComplete={handleCompleteTransaction}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

