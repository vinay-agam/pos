// LocalStorage utilities for shop data management

import { ShopData, ShopListItem } from '@/types';

const SHOPS_LIST_KEY = 'pos_shops_list';
const SHOP_DATA_PREFIX = 'pos_shop_data_';

/**
 * Get list of all shops
 */
export function getShopsList(): ShopListItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(SHOPS_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading shops list:', error);
    return [];
  }
}

/**
 * Add a shop to the list
 */
export function addShopToList(shop: ShopListItem): void {
  if (typeof window === 'undefined') return;
  
  try {
    const shops = getShopsList();
    if (!shops.find(s => s.shopId === shop.shopId)) {
      shops.push(shop);
      localStorage.setItem(SHOPS_LIST_KEY, JSON.stringify(shops));
    }
  } catch (error) {
    console.error('Error adding shop to list:', error);
  }
}

/**
 * Remove a shop from the list
 */
export function removeShopFromList(shopId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const shops = getShopsList().filter(s => s.shopId !== shopId);
    localStorage.setItem(SHOPS_LIST_KEY, JSON.stringify(shops));
  } catch (error) {
    console.error('Error removing shop from list:', error);
  }
}

/**
 * Get shop data from localStorage
 */
export function getShopData(shopId: string): ShopData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(`${SHOP_DATA_PREFIX}${shopId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading shop data:', error);
    return null;
  }
}

/**
 * Save shop data to localStorage
 */
export function saveShopData(shopData: ShopData): void {
  if (typeof window === 'undefined') return;
  
  try {
    shopData.updatedAt = new Date().toISOString();
    localStorage.setItem(`${SHOP_DATA_PREFIX}${shopData.shopId}`, JSON.stringify(shopData));
    
    // Update shops list
    addShopToList({
      shopId: shopData.shopId,
      shopName: shopData.shopName,
      createdAt: shopData.createdAt,
    });
  } catch (error) {
    console.error('Error saving shop data:', error);
    throw error;
  }
}

/**
 * Delete shop data from localStorage
 */
export function deleteShopData(shopId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`${SHOP_DATA_PREFIX}${shopId}`);
    removeShopFromList(shopId);
  } catch (error) {
    console.error('Error deleting shop data:', error);
  }
}

/**
 * Export shop data as JSON string
 */
export function exportShopData(shopId: string): string | null {
  const shopData = getShopData(shopId);
  if (!shopData) return null;
  
  return JSON.stringify(shopData, null, 2);
}

/**
 * Import shop data from JSON string
 */
export function importShopData(jsonData: string): ShopData | null {
  try {
    const shopData: ShopData = JSON.parse(jsonData);
    
    // Validate required fields
    if (!shopData.shopId || !shopData.shopName) {
      throw new Error('Invalid shop data: missing required fields');
    }
    
    // Ensure all arrays exist
    shopData.products = shopData.products || [];
    shopData.sales = shopData.sales || [];
    shopData.customers = shopData.customers || [];
    shopData.inventory = shopData.inventory || [];
    shopData.employees = shopData.employees || [];
    
    // Ensure settings exist
    if (!shopData.settings) {
      shopData.settings = getDefaultSettings();
    }
    
    // Update timestamps
    shopData.updatedAt = new Date().toISOString();
    if (!shopData.createdAt) {
      shopData.createdAt = new Date().toISOString();
    }
    
    return shopData;
  } catch (error) {
    console.error('Error importing shop data:', error);
    return null;
  }
}

/**
 * Get default shop settings
 */
export function getDefaultSettings(): ShopData['settings'] {
  return {
    shopName: '',
    taxRate: 0,
    currency: 'INR',
  };
}

/**
 * Check if shop exists
 */
export function shopExists(shopId: string): boolean {
  return getShopData(shopId) !== null;
}

