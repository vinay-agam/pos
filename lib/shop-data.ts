// Shop data management utilities

import { ShopData, Product, Transaction, Customer, InventoryItem, Employee, ShopSettings } from '@/types';
import { getShopData, saveShopData, getDefaultSettings } from './storage';

/**
 * Initialize new shop data
 */
export function initializeShopData(shopId: string, shopName: string, password: string): ShopData {
  const now = new Date().toISOString();
  
  return {
    shopId,
    shopName,
    password,
    products: [],
    sales: [],
    customers: [],
    inventory: [],
    employees: [],
    settings: {
      ...getDefaultSettings(),
      shopName,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get shop data or create if doesn't exist
 */
export function getOrCreateShopData(shopId: string, shopName: string, password: string): ShopData {
  let shopData = getShopData(shopId);
  
  if (!shopData) {
    shopData = initializeShopData(shopId, shopName, password);
    saveShopData(shopData);
  }
  
  return shopData;
}

/**
 * Update shop settings
 */
export function updateShopSettings(shopId: string, settings: Partial<ShopSettings>): boolean {
  const shopData = getShopData(shopId);
  if (!shopData) return false;
  
  shopData.settings = { ...shopData.settings, ...settings };
  saveShopData(shopData);
  return true;
}

/**
 * Add product to shop
 */
export function addProduct(shopId: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const shopData = getShopData(shopId);
  if (!shopData) throw new Error('Shop not found');
  
  const newProduct: Product = {
    ...product,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  shopData.products.push(newProduct);
  saveShopData(shopData);
  
  return newProduct;
}

/**
 * Update product
 */
export function updateProduct(shopId: string, productId: string, updates: Partial<Product>): boolean {
  const shopData = getShopData(shopId);
  if (!shopData) return false;
  
  const index = shopData.products.findIndex(p => p.id === productId);
  if (index === -1) return false;
  
  shopData.products[index] = {
    ...shopData.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveShopData(shopData);
  return true;
}

/**
 * Delete product
 */
export function deleteProduct(shopId: string, productId: string): boolean {
  const shopData = getShopData(shopId);
  if (!shopData) return false;
  
  shopData.products = shopData.products.filter(p => p.id !== productId);
  saveShopData(shopData);
  return true;
}

/**
 * Add transaction
 */
export function addTransaction(shopId: string, transaction: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt'>): Transaction {
  const shopData = getShopData(shopId);
  if (!shopData) throw new Error('Shop not found');
  
  const transactionNumber = generateTransactionNumber(shopData.sales.length);
  
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    transactionNumber,
    createdAt: new Date().toISOString(),
  };
  
  shopData.sales.push(newTransaction);
  
  // Update customer stats
  if (transaction.customerId) {
    const customer = shopData.customers.find(c => c.id === transaction.customerId);
    if (customer) {
      customer.totalPurchases += 1;
      customer.totalSpent += transaction.total;
    }
  }
  
  // Update inventory
  transaction.items.forEach(item => {
    const inventoryItem = shopData.inventory.find(
      inv => inv.productId === item.productId && inv.sizeId === item.sizeId
    );
    
    if (inventoryItem) {
      inventoryItem.currentStock = Math.max(0, inventoryItem.currentStock - item.quantity);
      inventoryItem.lastUpdated = new Date().toISOString();
    }
  });
  
  saveShopData(shopData);
  return newTransaction;
}

/**
 * Add customer
 */
export function addCustomer(shopId: string, customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalSpent'>): Customer {
  const shopData = getShopData(shopId);
  if (!shopData) throw new Error('Shop not found');
  
  const newCustomer: Customer = {
    ...customer,
    id: generateId(),
    createdAt: new Date().toISOString(),
    totalPurchases: 0,
    totalSpent: 0,
  };
  
  shopData.customers.push(newCustomer);
  saveShopData(shopData);
  
  return newCustomer;
}

/**
 * Update customer
 */
export function updateCustomer(shopId: string, customerId: string, updates: Partial<Customer>): boolean {
  const shopData = getShopData(shopId);
  if (!shopData) return false;
  
  const index = shopData.customers.findIndex(c => c.id === customerId);
  if (index === -1) return false;
  
  shopData.customers[index] = {
    ...shopData.customers[index],
    ...updates,
  };
  
  saveShopData(shopData);
  return true;
}

/**
 * Add employee
 */
export function addEmployee(shopId: string, employee: Omit<Employee, 'id' | 'createdAt'>): Employee {
  const shopData = getShopData(shopId);
  if (!shopData) throw new Error('Shop not found');
  
  const newEmployee: Employee = {
    ...employee,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  shopData.employees.push(newEmployee);
  saveShopData(shopData);
  
  return newEmployee;
}

/**
 * Update inventory
 */
export function updateInventory(shopId: string, productId: string, sizeId: string | undefined, stock: number): boolean {
  const shopData = getShopData(shopId);
  if (!shopData) return false;
  
  let inventoryItem = shopData.inventory.find(
    inv => inv.productId === productId && inv.sizeId === sizeId
  );
  
  if (!inventoryItem) {
    const product = shopData.products.find(p => p.id === productId);
    if (!product) return false;
    
    inventoryItem = {
      productId,
      productName: product.name,
      sizeId,
      sizeName: sizeId ? product.sizes.find(s => s.id === sizeId)?.name : undefined,
      currentStock: stock,
      lastUpdated: new Date().toISOString(),
    };
    
    shopData.inventory.push(inventoryItem);
  } else {
    inventoryItem.currentStock = stock;
    inventoryItem.lastUpdated = new Date().toISOString();
  }
  
  saveShopData(shopData);
  return true;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate transaction number
 */
function generateTransactionNumber(sequence: number): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const seq = String(sequence + 1).padStart(4, '0');
  return `TXN-${dateStr}-${seq}`;
}

