'use client';

import { useParams } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EmployeeManager } from '@/components/dashboard/EmployeeManager';

export default function EmployeesPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <DashboardLayout>
          <EmployeeManager />
        </DashboardLayout>
      </ShopProvider>
    </PasswordGate>
  );
}

