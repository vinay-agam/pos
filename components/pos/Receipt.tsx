'use client';

import { useEffect } from 'react';
import { Transaction } from '@/types';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { Printer } from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
}

export function Receipt({ transaction }: ReceiptProps) {
  const { shopData } = useShop();

  if (!shopData) {
    return null;
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const colon = String.fromCharCode(58); // avoid literal ":" in source
    const selectorSingleEscape = '.print\\' + colon + 'hidden';
    const selectorDoubleEscape = '.print\\\\' + colon + 'hidden';
    const singleMatches = !!document.querySelector(selectorSingleEscape);
    const doubleMatches = !!document.querySelector(selectorDoubleEscape);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'baseline',
        hypothesisId: 'H1',
        location: 'components/pos/Receipt.tsx:effect',
        message: 'print:hidden selector match status',
        data: {
          selectorSingleEscape,
          selectorDoubleEscape,
          singleMatches,
          doubleMatches,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [transaction]);

  const handlePrint = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'baseline',
        hypothesisId: 'H2',
        location: 'components/pos/Receipt.tsx:handlePrint',
        message: 'handlePrint invoked',
        data: {
          // avoid literal print:hidden token to prevent Tailwind extraction
          buttonContainerClasses: 'mt-4 flex justify-center gap-2 print-hidden',
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    window.print();
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="print:shadow-none print:border-0">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center border-b pb-4">
            {shopData.settings.receiptHeader && (
              <p className="text-sm whitespace-pre-line mb-2">{shopData.settings.receiptHeader}</p>
            )}
            <h2 className="text-xl font-bold">{shopData.settings.shopName || shopData.shopName}</h2>
            {shopData.settings.address && (
              <p className="text-sm text-gray-600">{shopData.settings.address}</p>
            )}
            {(shopData.settings.phone || shopData.settings.email) && (
              <p className="text-sm text-gray-600">
                {shopData.settings.phone && `Tel: ${shopData.settings.phone}`}
                {shopData.settings.phone && shopData.settings.email && ' | '}
                {shopData.settings.email && `Email: ${shopData.settings.email}`}
              </p>
            )}
          </div>

          {/* Transaction Info */}
          <div className="space-y-2 border-b pb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction #:</span>
              <span className="text-sm font-medium">{transaction.transactionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</span>
            </div>
            {transaction.customerName && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="text-sm">{transaction.customerName}</span>
              </div>
            )}
            {transaction.employeeName && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employee:</span>
                <span className="text-sm">{transaction.employeeName}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="font-semibold">Items:</h3>
            {transaction.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  {item.sizeName && (
                    <p className="text-xs text-gray-500">Size: {item.sizeName}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.quantity} x <PriceDisplay price={item.unitPrice} currency={shopData.settings.currency} />
                  </p>
                </div>
                <div className="text-right">
                  <PriceDisplay price={item.totalPrice} currency={shopData.settings.currency} />
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 border-b pb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <PriceDisplay price={transaction.subtotal} currency={shopData.settings.currency} />
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({transaction.discountType === 'percentage' ? `${(transaction.discount / transaction.subtotal * 100).toFixed(1)}%` : 'Fixed'}):</span>
                <span>-<PriceDisplay price={transaction.discount} currency={shopData.settings.currency} /></span>
              </div>
            )}
            {transaction.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax ({transaction.taxRate}%):</span>
                <PriceDisplay price={transaction.tax} currency={shopData.settings.currency} />
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <PriceDisplay price={transaction.total} currency={shopData.settings.currency} size="lg" />
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="font-semibold">Payment:</h3>
            {transaction.paymentMethods.map((payment, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="capitalize">{payment.type}</span>
                <PriceDisplay price={payment.amount} currency={shopData.settings.currency} />
              </div>
            ))}
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="text-sm text-gray-600">{transaction.notes}</p>
            </div>
          )}

          {/* Footer */}
          {shopData.settings.receiptFooter && (
            <div className="text-center text-sm text-gray-500 whitespace-pre-line">
              {shopData.settings.receiptFooter}
            </div>
          )}

          <div className="text-center text-xs text-gray-400 mt-4">
            Thank you for your business!
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center gap-2 no-print">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
}

