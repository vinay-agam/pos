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
    
    if (!shopId) {
      setShopData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const data = getShopData(shopId);
    
    setShopData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    
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
  
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

