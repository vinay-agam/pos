'use client';

import { useParams, useRouter } from 'next/navigation';
import { PasswordGate } from '@/components/shop/PasswordGate';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { Receipt } from '@/components/pos/Receipt';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ReceiptPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const transactionId = params?.transactionId as string;

  return (
    <PasswordGate shopId={shopId}>
      <ShopProvider shopId={shopId}>
        <ReceiptContent shopId={shopId} transactionId={transactionId} />
      </ShopProvider>
    </PasswordGate>
  );
}

function ReceiptContent({ shopId, transactionId }: { shopId: string; transactionId: string }) {
  const { shopData } = useShop();
  const router = useRouter();

  if (!shopData) {
    return <div>Loading...</div>;
  }

  const transaction = shopData.sales.find(s => s.id === transactionId);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
          <Button onClick={() => router.push(`/shop/${shopId}/dashboard/sales`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push(`/shop/${shopId}/dashboard/sales`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
        </div>
        <Receipt transaction={transaction} />
      </div>
    </div>
  );
}

