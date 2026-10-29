import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Brand & Taglines
  brandTagline: {
    en: 'Your Business. One Smart Platform.',
    hi: 'Aapke Business Ka Smart Hisaab.',
  },
  heroHeadline: {
    en: 'Run Your Business Smarter. Grow With Confidence.',
    hi: 'Dukan ka pura hisaab, ab aur bhi aasaan.',
  },
  heroSub: {
    en: 'Manage billing, inventory, expenses, customer credit and business performance from one simple platform.',
    hi: 'Billing, stock, udhaar, kharcha, profit – sab kuch ab ek hi jagah. AI ke saath, aapke business ke liye.',
  },
  startFreeNow: {
    en: 'Start Free Now',
    hi: 'Muft Shuru Karein',
  },
  watchDemo: {
    en: 'Watch Demo',
    hi: 'Demo Dekhein',
  },
  noCardRequired: {
    en: 'No Credit Card Required',
    hi: 'Bina Credit Card Ke',
  },
  easyToUse: {
    en: 'Easy to Use',
    hi: 'Bilkul Aasaan',
  },
  madeForIndia: {
    en: 'Made for Indian Businesses',
    hi: 'Khaas Bharat ke Vyapariyo ke liye',
  },

  // Navigation
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  sales: { en: 'Sales', hi: 'बिक्री' },
  invoices: { en: 'Invoices', hi: 'बिल / इनवॉइस' },
  purchases: { en: 'Purchases', hi: 'खरीद (Purchase)' },
  expenses: { en: 'Expenses', hi: 'खर्चा (Expenses)' },
  customers: { en: 'Customers', hi: 'ग्राहक (Customers)' },
  suppliers: { en: 'Suppliers', hi: 'सप्लायर्स' },
  udhaar: { en: 'Udhaar', hi: 'उधार खाता' },
  inventory: { en: 'Inventory & Stock', hi: 'स्टॉक (Inventory)' },
  reports: { en: 'Reports', hi: 'रिपोर्ट्स' },
  aiAssistant: { en: 'AI Assistant', hi: 'AI सहायक' },
  reminders: { en: 'Reminders', hi: 'रिमाइंडर' },
  team: { en: 'Team & Staff', hi: 'स्टाफ और रोल्स' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  subscription: { en: 'Subscription', hi: 'सब्सक्रिप्शन' },
  activity: { en: 'Activity Log', hi: 'गतिविधि इतिहास' },
  importExport: { en: 'Import & Export', hi: 'इम्पोर्ट / एक्सपोर्ट' },

  // Dashboard Stats
  totalSales: { en: 'Total Sales', hi: 'कुल बिक्री' },
  totalExpenses: { en: 'Total Expenses', hi: 'कुल खर्चा' },
  outstandingCredit: { en: 'Outstanding Udhaar', hi: 'कुल उधार (लेना बाकी)' },
  estimatedProfit: { en: 'Estimated Gross Profit', hi: 'अनुमानित लाभ (मुनाफ़ा)' },
  todaySummary: { en: "Here is your business summary for today.", hi: 'यहाँ है आपके बिज़नेस का आज का सारांश।' },
  salesOverview: { en: 'Sales Overview', hi: 'बिक्री का चार्ट' },
  topProducts: { en: 'Top Products', hi: 'सबसे ज़्यादा बिकने वाले सामान' },
  lowStockAlert: { en: 'Low Stock Alert', hi: 'कम स्टॉक वाले सामान' },
  recentTransactions: { en: 'Recent Transactions', hi: 'ताज़ा लेन-देन' },

  // Actions
  createInvoice: { en: 'Create Bill / Invoice', hi: 'नया बिल बनाएं' },
  recordPayment: { en: 'Record Payment', hi: 'भुगतान दर्ज करें' },
  addCustomer: { en: 'Add Customer', hi: 'ग्राहक जोड़ें' },
  addProduct: { en: 'Add Product', hi: 'सामान जोड़ें' },
  addExpense: { en: 'Add Expense', hi: 'खर्चा दर्ज करें' },
  sendReminder: { en: 'Send Reminder', hi: 'रिमाइंडर भेजें' },
  shareBill: { en: 'Share Bill', hi: 'बिल शेयर करें' },
  print: { en: 'Print', hi: 'प्रिंट करें' },
  exportCSV: { en: 'Export CSV', hi: 'CSV एक्सपोर्ट' },
  save: { en: 'Save', hi: 'सुरक्षित करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },

  // Udhaar & Stock Terms
  inStock: { en: 'In Stock', hi: 'स्टॉक में उपलब्ध' },
  lowStock: { en: 'Low Stock', hi: 'कम स्टॉक' },
  outOfStock: { en: 'Out of Stock', hi: 'स्टॉक खत्म' },
  daysOverdue: { en: 'days overdue', hi: 'दिन से बाकी' },
  dueSoon: { en: 'Due Soon', hi: 'जल्द देय' },
  paid: { en: 'Paid', hi: 'चुकाया गया' },
  unpaid: { en: 'Unpaid', hi: 'बाकी' },
  partial: { en: 'Partial', hi: 'आंशिक' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('vyaparo_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vyaparo_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
