// Core Types for POS System

export interface ProductSize {
  id: string;
  name: string; // e.g., "4x6", "5x7", "8x10"
  price: number;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'photo-frame' | 'photo-print' | 'customized-gift' | 'custom';
  description?: string;
  image?: string;
  sizes: ProductSize[];
  basePrice?: number; // For products without sizes
  stock?: number; // For products without sizes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sizeId?: string;
  sizeName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalPurchases: number;
  totalSpent: number;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital' | 'other';
  amount: number;
  reference?: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  customerId?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  taxRate: number;
  total: number;
  paymentMethods: PaymentMethod[];
  employeeId?: string;
  employeeName?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  sizeId?: string;
  sizeName?: string;
  currentStock: number;
  minStock?: number;
  lastUpdated: string;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  role: 'admin' | 'manager' | 'cashier';
  isActive: boolean;
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  address?: string;
  phone?: string;
  email?: string;
  taxRate: number;
  currency: string;
  receiptHeader?: string;
  receiptFooter?: string;
}

export interface ShopData {
  shopId: string;
  shopName: string;
  password: string; // Also stored in JS file
  products: Product[];
  sales: Transaction[];
  customers: Customer[];
  inventory: InventoryItem[];
  employees: Employee[];
  settings: ShopSettings;
  createdAt: string;
  updatedAt: string;
  lastBackup?: string;
}

export interface ShopListItem {
  shopId: string;
  shopName: string;
  createdAt: string;
}

