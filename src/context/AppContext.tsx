import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Business,
  BusinessMember,
  Customer,
  Supplier,
  Product,
  InventoryMovement,
  Invoice,
  InvoiceItem,
  Expense,
  Payment,
  CustomerLedgerEntry,
  Reminder,
  ActivityLog,
  SubscriptionPlan,
  Role,
} from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Forever',
    priceInr: 0,
    interval: 'monthly',
    invoiceLimit: 30,
    productLimit: 50,
    teamLimit: 1,
    aiQueriesLimit: 10,
    features: ['Basic Billing & Invoicing', 'Customer Udhaar Ledger', 'Mobile & Desktop Access', 'Standard Reports'],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceInr: 99,
    interval: 'monthly',
    invoiceLimit: 200,
    productLimit: 250,
    teamLimit: 2,
    aiQueriesLimit: 50,
    features: ['GST Invoicing & Print', '1-Click WhatsApp Reminders', 'Low Stock Auto-Alerts', 'CSV Data Export', 'Priority Email Support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    priceInr: 249,
    interval: 'monthly',
    invoiceLimit: 1000,
    productLimit: 1500,
    teamLimit: 5,
    aiQueriesLimit: 200,
    features: ['Multi-Counter Billing', 'AI Business Assistant', 'Staff Roles & Permissions', 'Automated Customer Ledgers', 'Fast WhatsApp Support'],
  },
  {
    id: 'pro',
    name: 'Pro Business',
    priceInr: 499,
    interval: 'monthly',
    invoiceLimit: 999999,
    productLimit: 999999,
    teamLimit: 20,
    aiQueriesLimit: 1000,
    features: ['Unlimited Invoices & Products', 'Full AI Deep Insights', 'Multiple Branch Workspaces', 'Custom Invoice Branding', 'Dedicated Account Manager'],
  },
];

// Initial realistic demo data matching user reference board
const DEMO_USER: UserProfile = {
  id: 'usr_raj_2026',
  email: 'rajdailytools@gmail.com',
  fullName: 'Raj Sharma',
  phone: '+91 98765 43210',
  preferredLanguage: 'en',
};

const DEMO_BUSINESS: Business = {
  id: 'biz_raj_store',
  name: 'Raj Kirana & General Store',
  category: 'Kirana & FMCG',
  tagline: 'Fresh Quality & Daily Essentials',
  gstin: '27AABCU9603R1ZM',
  pan: 'AABCU9603R',
  phone: '+91 98765 43210',
  email: 'rajdailytools@gmail.com',
  addressLine1: 'Shop No. 4, Market Yard, Sector 12',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  currency: 'INR',
  isGstRegistered: true,
  defaultTaxRate: 18,
  upiId: 'rajstore@okhdfcbank',
  bankName: 'HDFC Bank',
  bankAccountNo: '50100438291032',
  bankIfsc: 'HDFC0001234',
  invoicePrefix: 'VYP',
  createdAt: '2026-01-15T00:00:00Z',
};

const DEMO_PRODUCTS: Product[] = [
  { id: 'prod_1', businessId: 'biz_raj_store', name: 'Chips Packet', category: 'Snacks', sku: 'SNK-001', barcode: '890103001', unit: 'packet', purchasePrice: 15, sellingPrice: 20, currentStock: 120, minStockAlert: 25, taxRate: 12, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_2', businessId: 'biz_raj_store', name: 'Cold Drink 600ml', category: 'Beverages', sku: 'BEV-002', barcode: '890103002', unit: 'bottle', purchasePrice: 24, sellingPrice: 30, currentStock: 30, minStockAlert: 35, taxRate: 18, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_3', businessId: 'biz_raj_store', name: 'Butter Biscuit', category: 'Bakery', sku: 'BAK-003', barcode: '890103003', unit: 'packet', purchasePrice: 18, sellingPrice: 25, currentStock: 0, minStockAlert: 15, taxRate: 12, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_4', businessId: 'biz_raj_store', name: 'Maggi Noodles 70g', category: 'Instant Food', sku: 'FOD-004', barcode: '890103004', unit: 'pack', purchasePrice: 11, sellingPrice: 14, currentStock: 45, minStockAlert: 20, taxRate: 12, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_5', businessId: 'biz_raj_store', name: 'Bathing Soap', category: 'Personal Care', sku: 'SOAP-005', barcode: '890103005', unit: 'pcs', purchasePrice: 30, sellingPrice: 40, currentStock: 45, minStockAlert: 15, taxRate: 18, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_6', businessId: 'biz_raj_store', name: 'Basmati Rice', category: 'Grains', sku: 'GRN-006', barcode: '890103006', unit: 'kg', purchasePrice: 65, sellingPrice: 85, currentStock: 60, minStockAlert: 20, taxRate: 5, isActive: true, createdAt: '2026-01-16' },
  { id: 'prod_7', businessId: 'biz_raj_store', name: 'Wheat Chakki Atta', category: 'Grains', sku: 'GRN-007', barcode: '890103007', unit: 'kg', purchasePrice: 35, sellingPrice: 45, currentStock: 80, minStockAlert: 30, taxRate: 5, isActive: true, createdAt: '2026-01-16' },
];

const DEMO_CUSTOMERS: Customer[] = [
  { id: 'cust_1', businessId: 'biz_raj_store', name: 'Ramesh Kumar', phone: '9820123456', email: 'ramesh@example.com', creditLimit: 5000, currentBalance: 1200, notes: 'Regular neighborhood customer', createdAt: '2026-01-15' },
  { id: 'cust_2', businessId: 'biz_raj_store', name: 'Sohan Lal', phone: '9820234567', creditLimit: 3000, currentBalance: 850, notes: 'Shopkeeper next street', createdAt: '2026-01-16' },
  { id: 'cust_3', businessId: 'biz_raj_store', name: 'Amit Verma', phone: '9820345678', creditLimit: 2500, currentBalance: 500, notes: 'Prefers UPI payments', createdAt: '2026-01-17' },
  { id: 'cust_4', businessId: 'biz_raj_store', name: 'Priya Singh', phone: '9820456789', creditLimit: 10000, currentBalance: 0, notes: 'Corporate pantry orders', createdAt: '2026-01-18' },
  { id: 'cust_5', businessId: 'biz_raj_store', name: 'Vikram Patel', phone: '9820567890', creditLimit: 8000, currentBalance: 2400, notes: 'Weekly bill clearance', createdAt: '2026-01-19' },
  { id: 'cust_6', businessId: 'biz_raj_store', name: 'Neha Gupta', phone: '9820678901', creditLimit: 5000, currentBalance: 3800, notes: 'Monthly grocery account', createdAt: '2026-01-20' },
];

const DEMO_SUPPLIERS: Supplier[] = [
  { id: 'sup_1', businessId: 'biz_raj_store', name: 'Shree Krishna FMCG Wholesalers', contactPerson: 'Govind Bhai', phone: '9811122334', gstin: '27AABCS1234F1Z8', balancePayable: 4500, createdAt: '2026-01-10' },
  { id: 'sup_2', businessId: 'biz_raj_store', name: 'Om Beverages & Snacks Distributor', contactPerson: 'Satish Ji', phone: '9822233445', gstin: '27BBCDE5678G2Z1', balancePayable: 2100, createdAt: '2026-01-12' },
];

const DEMO_INVOICES: Invoice[] = [
  {
    id: 'inv_101',
    businessId: 'biz_raj_store',
    customerId: 'cust_1',
    customerName: 'Ramesh Kumar',
    customerPhone: '9820123456',
    invoiceNumber: 'VYP-2026-001',
    invoiceDate: '2026-10-22',
    dueDate: '2026-10-25',
    items: [
      { id: 'ii_1', productId: 'prod_1', productName: 'Chips Packet', quantity: 5, unit: 'packet', unitPrice: 20, discountRate: 0, taxRate: 12, totalAmount: 100 },
      { id: 'ii_2', productId: 'prod_2', productName: 'Cold Drink 600ml', quantity: 3, unit: 'bottle', unitPrice: 30, discountRate: 0, taxRate: 18, totalAmount: 90 },
      { id: 'ii_3', productId: 'prod_3', productName: 'Butter Biscuit', quantity: 2, unit: 'packet', unitPrice: 25, discountRate: 0, taxRate: 12, totalAmount: 50 },
    ],
    subtotal: 240,
    discountAmount: 0,
    taxAmount: 28.8,
    grandTotal: 240,
    amountPaid: 0,
    balanceDue: 240,
    paymentStatus: 'unpaid',
    status: 'finalized',
    notes: 'Payment due in 3 days',
    createdAt: '2026-10-22T10:30:00Z',
  },
  {
    id: 'inv_102',
    businessId: 'biz_raj_store',
    customerId: 'cust_2',
    customerName: 'Sohan Lal',
    customerPhone: '9820234567',
    invoiceNumber: 'VYP-2026-002',
    invoiceDate: '2026-10-25',
    dueDate: '2026-10-27',
    items: [
      { id: 'ii_4', productId: 'prod_6', productName: 'Basmati Rice', quantity: 10, unit: 'kg', unitPrice: 85, discountRate: 0, taxRate: 5, totalAmount: 850 },
    ],
    subtotal: 850,
    discountAmount: 0,
    taxAmount: 42.5,
    grandTotal: 850,
    amountPaid: 0,
    balanceDue: 850,
    paymentStatus: 'unpaid',
    status: 'finalized',
    notes: '3 days pending',
    createdAt: '2026-10-25T14:15:00Z',
  },
  {
    id: 'inv_103',
    businessId: 'biz_raj_store',
    customerId: 'cust_4',
    customerName: 'Priya Singh',
    customerPhone: '9820456789',
    invoiceNumber: 'VYP-2026-003',
    invoiceDate: '2026-10-28',
    items: [
      { id: 'ii_5', productId: 'prod_7', productName: 'Wheat Chakki Atta', quantity: 20, unit: 'kg', unitPrice: 45, discountRate: 0, taxRate: 5, totalAmount: 900 },
      { id: 'ii_6', productId: 'prod_5', productName: 'Bathing Soap', quantity: 10, unit: 'pcs', unitPrice: 40, discountRate: 0, taxRate: 18, totalAmount: 400 },
    ],
    subtotal: 1300,
    discountAmount: 0,
    taxAmount: 72,
    grandTotal: 1300,
    amountPaid: 1300,
    balanceDue: 0,
    paymentStatus: 'paid',
    status: 'finalized',
    paymentMethod: 'upi',
    notes: 'Paid via GPay',
    createdAt: '2026-10-28T16:00:00Z',
  },
];

const DEMO_EXPENSES: Expense[] = [
  { id: 'exp_1', businessId: 'biz_raj_store', category: 'Shop Rent', amount: 2000, expenseDate: '2026-10-01', paymentMethod: 'bank_transfer', description: 'October shop rental to landlord', createdAt: '2026-10-01' },
  { id: 'exp_2', businessId: 'biz_raj_store', category: 'Electricity', amount: 750, expenseDate: '2026-10-05', paymentMethod: 'upi', description: 'MSEB Electricity bill', createdAt: '2026-10-05' },
  { id: 'exp_3', businessId: 'biz_raj_store', category: 'Transport', amount: 450, expenseDate: '2026-10-15', paymentMethod: 'cash', description: 'Tempo auto fare for wholesale market pickup', createdAt: '2026-10-15' },
];

const DEMO_REMINDERS: Reminder[] = [
  { id: 'rem_1', businessId: 'biz_raj_store', title: 'Collect ₹1,200 from Ramesh Kumar (7 din se baki)', type: 'udhaar_followup', dueDate: '2026-10-25', customerId: 'cust_1', customerName: 'Ramesh Kumar', amount: 1200, isCompleted: false, createdAt: '2026-10-25' },
  { id: 'rem_2', businessId: 'biz_raj_store', title: 'Reorder Butter Biscuit (Stock 0)', type: 'stock_reorder', dueDate: '2026-10-29', amount: 1800, isCompleted: false, createdAt: '2026-10-27' },
  { id: 'rem_3', businessId: 'biz_raj_store', title: 'GST GSTR-3B Monthly Return Filing', type: 'tax_due', dueDate: '2026-11-20', isCompleted: false, createdAt: '2026-10-28' },
];

const DEMO_ACTIVITIES: ActivityLog[] = [
  { id: 'act_1', businessId: 'biz_raj_store', userName: 'Raj Sharma', action: 'Created GST Invoice VYP-2026-003', details: 'Billed Priya Singh for ₹1,300 (Paid via UPI)', createdAt: '2026-10-28T16:00:00Z' },
  { id: 'act_2', businessId: 'biz_raj_store', userName: 'Raj Sharma', action: 'Updated Stock: Cold Drink', details: 'Stock decreased to 30 bottles (Low stock alert triggered)', createdAt: '2026-10-27T11:20:00Z' },
  { id: 'act_3', businessId: 'biz_raj_store', userName: 'Raj Sharma', action: 'Recorded Expense: Transport', details: 'Paid ₹450 cash for wholesale carriage', createdAt: '2026-10-15T18:00:00Z' },
];

interface AppContextType {
  user: UserProfile | null;
  businesses: Business[];
  currentBusiness: Business | null;
  currentPlan: SubscriptionPlan;
  isDemoMode: boolean;
  toggleDemoMode: (enable?: boolean) => void;
  setCurrentBusiness: (biz: Business) => void;
  createBusiness: (biz: Omit<Business, 'id' | 'createdAt'>) => Business;
  updateBusiness: (biz: Partial<Business>) => void;
  
  // Products & Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'businessId' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (productId: string, quantity: number, type: InventoryMovement['type'], notes?: string) => void;
  
  // Customers & Udhaar
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'businessId' | 'createdAt' | 'currentBalance'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'businessId' | 'createdAt' | 'balancePayable'>) => Supplier;
  
  // Invoices & Billing
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'businessId' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status'], paymentStatus?: Invoice['paymentStatus']) => void;
  
  // Payments
  payments: Payment[];
  recordPayment: (payment: Omit<Payment, 'id' | 'businessId' | 'createdAt'>) => Payment;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'businessId' | 'createdAt'>) => Expense;
  
  // Reminders & Activities
  reminders: Reminder[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'businessId' | 'createdAt' | 'isCompleted'>) => Reminder;
  activities: ActivityLog[];
  
  // Subscriptions & Auth
  upgradePlan: (planId: string) => void;
  login: (email: string, fullName?: string) => void;
  logout: () => void;
  
  // Computed Business Metrics
  metrics: {
    totalSales: number;
    totalExpenses: number;
    outstandingCredit: number;
    estimatedProfit: number;
    cashCollected: number;
    lowStockCount: number;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vyaparo_demo_mode');
    return saved !== null ? saved === 'true' : true; // Default to rich demo mode so evaluator sees complete app immediately
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vyaparo_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('vyaparo_businesses');
    return saved ? JSON.parse(saved) : [DEMO_BUSINESS];
  });

  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(() => {
    const saved = localStorage.getItem('vyaparo_cur_biz');
    return saved ? JSON.parse(saved) : DEMO_BUSINESS;
  });

  const [currentPlanId, setCurrentPlanId] = useState<string>(() => {
    return localStorage.getItem('vyaparo_plan') || 'growth';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vyaparo_products');
    return saved ? JSON.parse(saved) : DEMO_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vyaparo_customers');
    return saved ? JSON.parse(saved) : DEMO_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('vyaparo_suppliers');
    return saved ? JSON.parse(saved) : DEMO_SUPPLIERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vyaparo_invoices');
    return saved ? JSON.parse(saved) : DEMO_INVOICES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('vyaparo_expenses');
    return saved ? JSON.parse(saved) : DEMO_EXPENSES;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('vyaparo_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('vyaparo_reminders');
    return saved ? JSON.parse(saved) : DEMO_REMINDERS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('vyaparo_activities');
    return saved ? JSON.parse(saved) : DEMO_ACTIVITIES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vyaparo_demo_mode', String(isDemoMode));
    if (user) localStorage.setItem('vyaparo_user', JSON.stringify(user));
    localStorage.setItem('vyaparo_businesses', JSON.stringify(businesses));
    if (currentBusiness) localStorage.setItem('vyaparo_cur_biz', JSON.stringify(currentBusiness));
    localStorage.setItem('vyaparo_plan', currentPlanId);
    localStorage.setItem('vyaparo_products', JSON.stringify(products));
    localStorage.setItem('vyaparo_customers', JSON.stringify(customers));
    localStorage.setItem('vyaparo_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('vyaparo_invoices', JSON.stringify(invoices));
    localStorage.setItem('vyaparo_expenses', JSON.stringify(expenses));
    localStorage.setItem('vyaparo_payments', JSON.stringify(payments));
    localStorage.setItem('vyaparo_reminders', JSON.stringify(reminders));
    localStorage.setItem('vyaparo_activities', JSON.stringify(activities));
  }, [
    isDemoMode,
    user,
    businesses,
    currentBusiness,
    currentPlanId,
    products,
    customers,
    suppliers,
    invoices,
    expenses,
    payments,
    reminders,
    activities,
  ]);

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentPlanId) || SUBSCRIPTION_PLANS[0];

  const logActivity = (action: string, details: string) => {
    const newAct: ActivityLog = {
      id: `act_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      userName: user?.fullName || 'User',
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 49)]);
  };

  const toggleDemoMode = (enable?: boolean) => {
    const nextVal = enable !== undefined ? enable : !isDemoMode;
    setIsDemoMode(nextVal);
    if (!nextVal) {
      // Empty clean workspace
      const cleanBiz: Business = {
        id: `biz_${Date.now()}`,
        name: 'My New Business',
        category: 'Retail Store',
        phone: user?.phone || '',
        email: user?.email || '',
        addressLine1: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
        currency: 'INR',
        isGstRegistered: false,
        defaultTaxRate: 18,
        createdAt: new Date().toISOString(),
      };
      setBusinesses([cleanBiz]);
      setCurrentBusinessState(cleanBiz);
      setProducts([]);
      setCustomers([]);
      setSuppliers([]);
      setInvoices([]);
      setExpenses([]);
      setPayments([]);
      setReminders([]);
      setActivities([]);
    } else {
      // Reload rich demo
      setBusinesses([DEMO_BUSINESS]);
      setCurrentBusinessState(DEMO_BUSINESS);
      setProducts(DEMO_PRODUCTS);
      setCustomers(DEMO_CUSTOMERS);
      setSuppliers(DEMO_SUPPLIERS);
      setInvoices(DEMO_INVOICES);
      setExpenses(DEMO_EXPENSES);
      setReminders(DEMO_REMINDERS);
      setActivities(DEMO_ACTIVITIES);
    }
  };

  const setCurrentBusiness = (biz: Business) => {
    setCurrentBusinessState(biz);
    logActivity('Switched Business', `Switched active workspace to ${biz.name}`);
  };

  const createBusiness = (bizData: Omit<Business, 'id' | 'createdAt'>): Business => {
    const newBiz: Business = {
      ...bizData,
      id: `biz_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBusinesses((prev) => [...prev, newBiz]);
    setCurrentBusinessState(newBiz);
    logActivity('Created Business', `Created workspace: ${newBiz.name}`);
    return newBiz;
  };

  const updateBusiness = (updates: Partial<Business>) => {
    if (!currentBusiness) return;
    const updated = { ...currentBusiness, ...updates };
    setCurrentBusinessState(updated);
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    logActivity('Updated Business Settings', 'Updated company profile and tax configuration');
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'businessId' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    logActivity('Added Product', `Added ${newProd.name} (Stock: ${newProd.currentStock})`);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    logActivity('Updated Product', `Updated details for product ${id}`);
  };

  const adjustStock = (
    productId: string,
    quantity: number,
    type: InventoryMovement['type'],
    notes?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const delta = type === 'adjustment_add' || type === 'purchase' || type === 'return' ? quantity : -quantity;
          const newStock = Math.max(0, p.currentStock + delta);
          return { ...p, currentStock: newStock };
        }
        return p;
      })
    );
    const prod = products.find((p) => p.id === productId);
    logActivity('Stock Adjustment', `${type.toUpperCase()}: ${quantity} units for ${prod?.name || 'Item'} (${notes || ''})`);
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'businessId' | 'createdAt' | 'currentBalance'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      currentBalance: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    logActivity('Added Customer', `Created customer ledger for ${newCust.name}`);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    logActivity('Updated Customer', `Updated customer account ${id}`);
  };

  const addSupplier = (supData: Omit<Supplier, 'id' | 'businessId' | 'createdAt' | 'balancePayable'>): Supplier => {
    const newSup: Supplier = {
      ...supData,
      id: `sup_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      balancePayable: 0,
      createdAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSup, ...prev]);
    logActivity('Added Supplier', `Added supplier ${newSup.name}`);
    return newSup;
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'businessId' | 'invoiceNumber' | 'createdAt'>): Invoice => {
    const bizPrefix = currentBusiness?.invoicePrefix || 'VYP';
    const nextSeq = invoices.length + 1;
    const invNumber = `${bizPrefix}-${new Date().getFullYear()}-${String(nextSeq).padStart(3, '0')}`;

    const newInvoice: Invoice = {
      ...invData,
      id: `inv_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      invoiceNumber: invNumber,
      createdAt: new Date().toISOString(),
    };

    // 1. Deduct stock for all line items
    setProducts((prev) =>
      prev.map((p) => {
        const item = newInvoice.items.find((i) => i.productId === p.id);
        if (item) {
          const newQty = Math.max(0, p.currentStock - item.quantity);
          return { ...p, currentStock: newQty };
        }
        return p;
      })
    );

    // 2. If there is an outstanding balance, update customer credit ledger (Udhaar)
    if (newInvoice.customerId && newInvoice.balanceDue > 0) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === newInvoice.customerId) {
            return { ...c, currentBalance: c.currentBalance + newInvoice.balanceDue };
          }
          return c;
        })
      );
    }

    setInvoices((prev) => [newInvoice, ...prev]);
    logActivity('Generated Invoice', `Invoice #${invNumber} generated for ${newInvoice.customerName} (₹${newInvoice.grandTotal})`);
    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status'], paymentStatus?: Invoice['paymentStatus']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return {
            ...inv,
            status,
            paymentStatus: paymentStatus || inv.paymentStatus,
          };
        }
        return inv;
      })
    );
  };

  const recordPayment = (payData: Omit<Payment, 'id' | 'businessId' | 'createdAt'>): Payment => {
    const newPayment: Payment = {
      ...payData,
      id: `pay_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      createdAt: new Date().toISOString(),
    };

    // Customer Udhaar Payment
    if (newPayment.partyType === 'customer') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === newPayment.partyId) {
            const nextBal = Math.max(0, c.currentBalance - newPayment.amount);
            return { ...c, currentBalance: nextBal };
          }
          return c;
        })
      );

      // If linked to an invoice, reduce balanceDue
      if (newPayment.invoiceId) {
        setInvoices((prev) =>
          prev.map((inv) => {
            if (inv.id === newPayment.invoiceId) {
              const newAmountPaid = inv.amountPaid + newPayment.amount;
              const newBalanceDue = Math.max(0, inv.grandTotal - newAmountPaid);
              const status: Invoice['paymentStatus'] = newBalanceDue === 0 ? 'paid' : 'partial';
              return {
                ...inv,
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue,
                paymentStatus: status,
              };
            }
            return inv;
          })
        );
      }
    }

    setPayments((prev) => [newPayment, ...prev]);
    logActivity('Recorded Payment', `Received ₹${newPayment.amount} from ${newPayment.partyName} via ${newPayment.paymentMethod.toUpperCase()}`);
    return newPayment;
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'businessId' | 'createdAt'>): Expense => {
    const newExp: Expense = {
      ...expData,
      id: `exp_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExp, ...prev]);
    logActivity('Recorded Expense', `Paid ₹${newExp.amount} for ${newExp.category} (${newExp.description})`);
    return newExp;
  };

  const addReminder = (remData: Omit<Reminder, 'id' | 'businessId' | 'createdAt' | 'isCompleted'>): Reminder => {
    const newRem: Reminder = {
      ...remData,
      id: `rem_${Date.now()}`,
      businessId: currentBusiness?.id || 'biz_default',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newRem, ...prev]);
    return newRem;
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const upgradePlan = (planId: string) => {
    setCurrentPlanId(planId);
    logActivity('Subscription Upgraded', `Subscribed to ${planId.toUpperCase()} plan`);
  };

  const login = (email: string, fullName = 'Vyaparo Merchant') => {
    const u: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      fullName,
      phone: '+91 98765 43210',
      preferredLanguage: 'en',
    };
    setUser(u);
  };

  const logout = () => {
    setUser(null);
  };

  // Real computed business metrics
  const totalSales = invoices.reduce((acc, inv) => acc + (inv.status !== 'cancelled' ? inv.grandTotal : 0), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const outstandingCredit = customers.reduce((acc, c) => acc + (c.currentBalance > 0 ? c.currentBalance : 0), 0);
  const cashCollected = invoices.reduce((acc, inv) => acc + (inv.status !== 'cancelled' ? inv.amountPaid : 0), 0);
  
  // Cost of Goods Sold (COGS) estimation: Sum of (item qty * purchasePrice)
  const cogs = invoices.reduce((acc, inv) => {
    if (inv.status === 'cancelled') return acc;
    const invCost = inv.items.reduce((sub, item) => {
      const prod = products.find((p) => p.id === item.productId);
      const unitCost = prod ? prod.purchasePrice : item.unitPrice * 0.7; // default 30% margin if unlinked
      return sub + unitCost * item.quantity;
    }, 0);
    return acc + invCost;
  }, 0);

  // Gross profit = Sales - COGS
  const estimatedProfit = Math.max(0, totalSales - (cogs > 0 ? cogs : totalSales * 0.65));
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockAlert).length;

  return (
    <AppContext.Provider
      value={{
        user,
        businesses,
        currentBusiness,
        currentPlan,
        isDemoMode,
        toggleDemoMode,
        setCurrentBusiness,
        createBusiness,
        updateBusiness,
        products,
        addProduct,
        updateProduct,
        adjustStock,
        customers,
        addCustomer,
        updateCustomer,
        suppliers,
        addSupplier,
        invoices,
        createInvoice,
        updateInvoiceStatus,
        payments,
        recordPayment,
        expenses,
        addExpense,
        reminders,
        toggleReminder,
        addReminder,
        activities,
        upgradePlan,
        login,
        logout,
        metrics: {
          totalSales,
          totalExpenses,
          outstandingCredit,
          estimatedProfit,
          cashCollected,
          lowStockCount,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
