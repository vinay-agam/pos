'use client';

import { useState } from 'react';
import { Customer } from '@/types';
import { useShop } from '@/hooks/useShop';
import { addCustomer, updateCustomer } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';
import { formatPrice } from '@/lib/products';

export function CustomerManager() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const filteredCustomers = shopData.customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalSpent'>) => {
    try {
      if (editingCustomer) {
        updateCustomer(shopId, editingCustomer.id, customerData);
      } else {
        addCustomer(shopId, customerData);
      }
      refreshShopData();
      setIsDialogOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      alert('Failed to save customer');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCustomer(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Update customer information' : 'Add a new customer to your database'}
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              customer={editingCustomer || undefined}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCustomer(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>{filteredCustomers.length} customer(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No customers found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Purchases</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge>{customer.totalPurchases}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(customer.totalSpent, shopData.settings.currency)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCustomer(customer);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerForm({
  customer,
  onSave,
  onCancel,
}: {
  customer?: Customer;
  onSave: (data: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalSpent'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    onSave({ name, email: email || undefined, phone: phone || undefined, address: address || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

