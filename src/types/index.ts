export type Role = 'owner' | 'admin' | 'manager' | 'staff';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overdue' | 'cancelled';
export type InvoiceStatus = 'draft' | 'finalized' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer' | 'cheque';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'hi';
}

export interface Business {
  id: string;
  name: string;
  category: string;
  tagline?: string;
  gstin?: string;
  pan?: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  currency: string;
  isGstRegistered: boolean;
  defaultTaxRate: number; // e.g. 18
  upiId?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  invoicePrefix?: string;
  createdAt: string;
}

export interface BusinessMember {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  creditLimit: number;
  currentBalance: number; // Positive = customer owes money (Udhaar)
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  gstin?: string;
  address?: string;
  balancePayable: number; // Business owes supplier
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  sku?: string;
  barcode?: string;
  unit: string; // 'pcs', 'kg', 'ltr', 'box', 'packet', 'meter'
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockAlert: number;
  taxRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  type: 'purchase' | 'sale' | 'adjustment_add' | 'adjustment_sub' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number; // percent
  taxRate: number; // percent
  totalAmount: number;
}

export interface Invoice {
  id: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitCost: number;
  taxRate: number;
  totalAmount: number;
}

export interface Purchase {
  id: string;
  businessId: string;
  supplierId?: string;
  supplierName: string;
  billNumber?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  businessId: string;
  category: string;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  description: string;
  supplierId?: string;
  supplierName?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  businessId: string;
  partyType: 'customer' | 'supplier';
  partyId: string;
  partyName: string;
  invoiceId?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerLedgerEntry {
  id: string;
  businessId: string;
  customerId: string;
  type: 'credit_sale' | 'payment_received' | 'adjustment' | 'refund';
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  businessId: string;
  title: string;
  type: 'udhaar_followup' | 'tax_due' | 'stock_reorder' | 'general';
  dueDate: string;
  customerId?: string;
  customerName?: string;
  amount?: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  businessId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceInr: number;
  interval: 'monthly' | 'yearly';
  invoiceLimit: number;
  productLimit: number;
  teamLimit: number;
  aiQueriesLimit: number;
  features: string[];
}
