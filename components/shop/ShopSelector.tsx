'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getShopsList, shopExists } from '@/lib/storage';
import { getOrCreateShopData } from '@/lib/shop-data';
import { setShopPassword } from '@/lib/password';
import { Store, Plus } from 'lucide-react';

export function ShopSelector() {
  const router = useRouter();
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const shops = getShopsList();

  const handleSelectShop = (selectedShopId: string) => {
    router.push(`/shop/${selectedShopId}`);
  };

  const handleCreateShop = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopId.trim()) {
      setError('Shop ID is required');
      return;
    }

    if (!shopName.trim()) {
      setError('Shop name is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Validate shop ID format (alphanumeric and hyphens)
    if (!/^[a-zA-Z0-9-]+$/.test(shopId)) {
      setError('Shop ID can only contain letters, numbers, and hyphens');
      return;
    }

    if (shopExists(shopId)) {
      setError('Shop ID already exists');
      return;
    }

    setIsCreating(true);

    try {
      // Create shop data
      const shopData = getOrCreateShopData(shopId, shopName, password);
      
      // Set password in password file (user needs to manually add to lib/password.ts)
      // Also store in localStorage for immediate use
      setShopPassword(shopId, password);
      
      // Store password in localStorage for immediate access
      // Note: User should manually add to lib/password.ts for permanent storage
      if (typeof window !== 'undefined') {
        const passwordKey = `pos_password_${shopId}`;
        localStorage.setItem(passwordKey, password);
      }

      // Navigate to shop
      router.push(`/shop/${shopId}`);
    } catch (err) {
      setError('Failed to create shop. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">POS Studio System</h1>
          <p className="text-gray-600">Manage your photo studio, prints, frames, and customized gifts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Existing Shops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Existing Shops
              </CardTitle>
              <CardDescription>Select a shop to access</CardDescription>
            </CardHeader>
            <CardContent>
              {shops.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No shops created yet
                </p>
              ) : (
                <div className="space-y-2">
                  {shops.map((shop) => (
                    <Button
                      key={shop.shopId}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleSelectShop(shop.shopId)}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{shop.shopName}</div>
                        <div className="text-xs text-gray-500">{shop.shopId}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Shop
              </CardTitle>
              <CardDescription>Set up a new shop with password protection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateShop} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopId">Shop ID</Label>
                  <Input
                    id="shopId"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    placeholder="e.g., studio1, shop-nyc"
                    required
                    pattern="[a-zA-Z0-9-]+"
                  />
                  <p className="text-xs text-gray-500">
                    Letters, numbers, and hyphens only. Used in URL: /shop/[shopId]
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g., Downtown Studio"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set shop password"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password will be stored in JavaScript code (visible in dev tools)
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Shop'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

