'use client';

import { useParams } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InventoryTracker } from '@/components/dashboard/InventoryTracker';

export default function InventoryPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <DashboardLayout>
          <InventoryTracker />
        </DashboardLayout>
      </ShopProvider>
    </PasswordGate>
  );
}

