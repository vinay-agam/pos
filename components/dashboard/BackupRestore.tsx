'use client';

import { useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { exportShopData, importShopData, saveShopData } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, CheckCircle } from 'lucide-react';

export function BackupRestore() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const handleExport = () => {
    const jsonData = exportShopData(shopId);
    if (!jsonData) {
      alert('Failed to export data');
      return;
    }

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shop-backup-${shopId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importFile) {
      setImportMessage('Please select a file');
      setImportStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const importedData = importShopData(jsonData);

        if (!importedData) {
          setImportMessage('Invalid backup file format');
          setImportStatus('error');
          return;
        }

        // Verify shop ID matches
        if (importedData.shopId !== shopId) {
          setImportMessage(`Shop ID mismatch. Expected: ${shopId}, Found: ${importedData.shopId}`);
          setImportStatus('error');
          return;
        }

        // Save imported data
        saveShopData(importedData);
        refreshShopData();

        setImportMessage('Data imported successfully!');
        setImportStatus('success');
        setImportFile(null);

        // Reset status after 3 seconds
        setTimeout(() => {
          setImportStatus('idle');
          setImportMessage('');
        }, 3000);
      } catch (error) {
        setImportMessage('Failed to import data. Please check the file format.');
        setImportStatus('error');
        console.error(error);
      }
    };

    reader.onerror = () => {
      setImportMessage('Failed to read file');
      setImportStatus('error');
    };

    reader.readAsText(importFile);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Backup & Restore</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download a backup of all shop data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Export all your shop data including products, sales, customers, inventory, employees, and settings to a JSON file.
              This file can be used to restore your data on another device.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Backup
            </Button>
            {shopData.lastBackup && (
              <p className="text-xs text-gray-500">
                Last backup: {new Date(shopData.lastBackup).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>Restore shop data from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Import a previously exported backup file to restore your shop data.
              This will replace all current data for this shop.
            </p>
            <div className="space-y-2">
              <Label htmlFor="importFile">Select Backup File</Label>
              <Input
                id="importFile"
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImportFile(file || null);
                  setImportStatus('idle');
                  setImportMessage('');
                }}
              />
            </div>
            {importStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{importMessage}</AlertDescription>
              </Alert>
            )}
            {importStatus === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>{importMessage}</AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={handleImport} 
              className="w-full" 
              disabled={!importFile || importStatus === 'success'}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Backup
            </Button>
            <p className="text-xs text-red-600">
              Warning: Importing will replace all current data for this shop!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Information</CardTitle>
          <CardDescription>Current shop data statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold">{shopData.products.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-2xl font-bold">{shopData.sales.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold">{shopData.customers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employees</p>
              <p className="text-2xl font-bold">{shopData.employees.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

