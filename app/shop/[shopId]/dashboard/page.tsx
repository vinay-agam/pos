'use client';

import { useParams } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/products';

export default function DashboardPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <DashboardLayout>
          <DashboardContent />
        </DashboardLayout>
      </ShopProvider>
    </PasswordGate>
  );
}

function DashboardContent() {
  const { shopData, isLoading } = useShop();

  if (isLoading || !shopData) {
    return <div>Loading...</div>;
  }

  const totalProducts = shopData.products.length;
  const activeProducts = shopData.products.filter(p => p.isActive).length;
  const totalSales = shopData.sales.length;
  const totalRevenue = shopData.sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCustomers = shopData.customers.length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue, shopData.settings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {shopData.sales.length === 0 ? (
              <p className="text-sm text-gray-500">No sales yet</p>
            ) : (
              <div className="space-y-3">
                {shopData.sales.slice(-5).reverse().map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{sale.transactionNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice(sale.total, shopData.settings.currency)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Products needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            {shopData.inventory.filter(inv => inv.minStock && inv.currentStock <= inv.minStock).length === 0 ? (
              <p className="text-sm text-gray-500">All products in stock</p>
            ) : (
              <div className="space-y-2">
                {shopData.inventory
                  .filter(inv => inv.minStock && inv.currentStock <= inv.minStock)
                  .slice(0, 5)
                  .map((inv) => (
                    <div key={`${inv.productId}-${inv.sizeId || 'none'}`} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{inv.productName}</p>
                        {inv.sizeName && <p className="text-sm text-gray-500">Size: {inv.sizeName}</p>}
                      </div>
                      <p className="text-red-600 font-medium">{inv.currentStock} left</p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

