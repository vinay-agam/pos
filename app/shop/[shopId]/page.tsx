'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { getShopData } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingCart, Store } from 'lucide-react';

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params?.shopId as string;

  useEffect(() => {
    // Check if shop exists
    if (shopId && typeof window !== 'undefined') {
      const shopData = getShopData(shopId);
      if (!shopData) {
        // Shop doesn't exist, redirect to home
        router.push('/');
      }
    }
  }, [shopId, router]);

  if (!shopId) {
    return null;
  }

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <ShopHomePage shopId={shopId} />
      </ShopProvider>
    </PasswordGate>
  );
}

function ShopHomePage({ shopId }: { shopId: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop: {shopId}</h1>
          <p className="text-gray-600">Select an option to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/shop/${shopId}/pos`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Point of Sale
              </CardTitle>
              <CardDescription>Process sales and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Open POS</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/shop/${shopId}/dashboard`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </CardTitle>
              <CardDescription>Manage products, sales, customers, and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Open Dashboard</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button variant="outline" onClick={() => router.push('/')}>
            <Store className="h-4 w-4 mr-2" />
            Back to Shop Selector
          </Button>
        </div>
      </div>
    </div>
  );
}

