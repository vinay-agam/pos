'use client';

import { useParams } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Reports } from '@/components/dashboard/Reports';

export default function ReportsPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <DashboardLayout>
          <Reports />
        </DashboardLayout>
      </ShopProvider>
    </PasswordGate>
  );
}

