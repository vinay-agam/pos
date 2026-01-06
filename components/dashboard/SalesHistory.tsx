'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { Eye, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/products';

export function SalesHistory() {
  const { shopData, shopId } = useShop();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  let filteredSales = [...shopData.sales].reverse();

  if (searchTerm) {
    filteredSales = filteredSales.filter(sale =>
      sale.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterDate) {
    filteredSales = filteredSales.filter(sale =>
      sale.createdAt.startsWith(filterDate)
    );
  }

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales History</h2>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by transaction # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterDate(''); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue, shopData.settings.currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>{filteredSales.length} transaction(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sales found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.transactionNumber}</TableCell>
                      <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{sale.customerName || 'Walk-in'}</TableCell>
                      <TableCell>{sale.items.length} item(s)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sale.paymentMethods[0]?.type || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PriceDisplay price={sale.total} currency={shopData.settings.currency} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/shop/${shopId}/receipt/${sale.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

