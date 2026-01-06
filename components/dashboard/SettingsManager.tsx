'use client';

import { useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { updateShopSettings } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BackupRestore } from './BackupRestore';
import { Separator } from '@/components/ui/separator';

export function SettingsManager() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [shopName, setShopName] = useState(shopData?.settings.shopName || '');
  const [address, setAddress] = useState(shopData?.settings.address || '');
  const [phone, setPhone] = useState(shopData?.settings.phone || '');
  const [email, setEmail] = useState(shopData?.settings.email || '');
  const [taxRate, setTaxRate] = useState((shopData?.settings.taxRate || 0).toString());
  const [currency, setCurrency] = useState(shopData?.settings.currency || 'INR');
  const [receiptHeader, setReceiptHeader] = useState(shopData?.settings.receiptHeader || '');
  const [receiptFooter, setReceiptFooter] = useState(shopData?.settings.receiptFooter || '');

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    try {
      updateShopSettings(shopId, {
        shopName,
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined,
        taxRate: parseFloat(taxRate) || 0,
        currency,
        receiptHeader: receiptHeader || undefined,
        receiptFooter: receiptFooter || undefined,
      });
      refreshShopData();
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Shop Information */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>Basic shop details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name *</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
          </div>
        </CardContent>
      </Card>

      {/* Tax & Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Tax & Currency</CardTitle>
          <CardDescription>Configure tax rates and currency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="INR"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Settings</CardTitle>
          <CardDescription>Customize receipt header and footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiptHeader">Receipt Header</Label>
            <Textarea
              id="receiptHeader"
              value={receiptHeader}
              onChange={(e) => setReceiptHeader(e.target.value)}
              placeholder="Enter receipt header text (appears at top of receipt)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptFooter">Receipt Footer</Label>
            <Textarea
              id="receiptFooter"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              placeholder="Enter receipt footer text (appears at bottom of receipt)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full md:w-auto">
        Save Settings
      </Button>

      <Separator />

      {/* Backup & Restore */}
      <BackupRestore />
    </div>
  );
}

