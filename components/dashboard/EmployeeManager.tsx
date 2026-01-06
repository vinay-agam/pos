'use client';

import { useState } from 'react';
import { Employee } from '@/types';
import { useShop } from '@/hooks/useShop';
import { addEmployee } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export function EmployeeManager() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      addEmployee(shopId, employeeData);
      refreshShopData();
      setIsDialogOpen(false);
    } catch (error) {
      alert('Failed to add employee');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>Add a new employee to your shop</DialogDescription>
            </DialogHeader>
            <EmployeeForm
              onSave={handleAddEmployee}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>{shopData.employees.length} employee(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {shopData.employees.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No employees added yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopData.employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email || '-'}</TableCell>
                    <TableCell>
                      <Badge className="capitalize">{employee.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.isActive ? 'default' : 'secondary'}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
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

function EmployeeForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<Employee, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'cashier'>('cashier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    onSave({ name, email: email || undefined, role, isActive: true });
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
        <Label htmlFor="role">Role *</Label>
        <Select value={role} onValueChange={(value: any) => setRole(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Employee</Button>
      </div>
    </form>
  );
}

