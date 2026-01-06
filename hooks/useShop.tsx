// Shop context hook

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopData } from '@/types';
import { getShopData } from '@/lib/storage';

interface ShopContextType {
  shopData: ShopData | null;
  shopId: string | null;
  isLoading: boolean;
  refreshShopData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ 
  children, 
  shopId 
}: { 
  children: ReactNode; 
  shopId: string | null;
}) {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshShopData = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'H1',
        location: 'hooks/useShop.tsx:refreshShopData',
        message: 'refreshShopData invoked',
        data: { shopId },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!shopId) {
      setShopData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const data = getShopData(shopId);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'H2',
        location: 'hooks/useShop.tsx:refreshShopData',
        message: 'shop data fetched',
        data: { shopId, hasData: !!data },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    setShopData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'H3',
        location: 'hooks/useShop.tsx:useEffect',
        message: 'useEffect triggered',
        data: { shopId },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    refreshShopData();
  }, [shopId]);

  return (
    <ShopContext.Provider value={{ shopData, shopId, isLoading, refreshShopData }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/f7a3bf35-aece-4d59-8352-367359be42cf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'H4',
      location: 'hooks/useShop.tsx:useShop',
      message: 'useShop called',
      data: { hasContext: context !== undefined },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

