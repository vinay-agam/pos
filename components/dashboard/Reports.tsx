'use client';

import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/products';
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react';

export function Reports() {
  const { shopData } = useShop();

  if (!shopData) {
    return <div>Loading...</div>;
  }

  // Calculate statistics
  const totalSales = shopData.sales.length;
  const totalRevenue = shopData.sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = shopData.products.length;
  const totalCustomers = shopData.customers.length;

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todaySales = shopData.sales.filter(sale => sale.createdAt.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  // This month's stats
  const thisMonth = new Date().toISOString().substring(0, 7);
  const monthSales = shopData.sales.filter(sale => sale.createdAt.startsWith(thisMonth));
  const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);

  // Top products
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  shopData.sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Average transaction value
  const avgTransactionValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue, shopData.settings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(todayRevenue, shopData.settings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">{todaySales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(monthRevenue, shopData.settings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">{monthSales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(avgTransactionValue, shopData.settings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#{index + 1} {product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(product.revenue, shopData.settings.currency)}
                    </p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Transactions:</span>
              <span className="font-bold">{totalSales}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="font-bold">{totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Customers:</span>
              <span className="font-bold">{totalCustomers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Average Transaction:</span>
              <span className="font-bold">
                {formatPrice(avgTransactionValue, shopData.settings.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Today's Transactions:</span>
              <span className="font-bold">{todaySales.length}</span>
            </div>
            <div className="flex justify-between">
              <span>This Month's Transactions:</span>
              <span className="font-bold">{monthSales.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

