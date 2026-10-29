import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './lib/i18n';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopNav } from './components/dashboard/TopNav';
import { InvoiceModal } from './components/dashboard/InvoiceModal';
import { PaymentModal, CustomerModal, ProductModal, ExpenseModal } from './components/dashboard/Modals';
import { PrintableInvoice } from './components/dashboard/PrintableInvoice';
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import {
  AboutPage,
  ContactPage,
  HelpPage,
  SecurityPage,
  PrivacyPage,
  TermsPage,
  RefundPolicyPage,
} from './pages/public/LegalPages';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/auth/AuthPages';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { MainDashboard } from './pages/dashboard/MainDashboard';
import { InvoicesPage } from './pages/dashboard/InvoicesPage';
import { UdhaarPage } from './pages/dashboard/UdhaarPage';
import { InventoryPage } from './pages/dashboard/InventoryPage';
import { ExpensesPage } from './pages/dashboard/ExpensesPage';
import { CustomersPage } from './pages/dashboard/CustomersPage';
import { SuppliersPage, PurchasesPage } from './pages/dashboard/SuppliersPurchasesPages';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { AiAssistantPage } from './pages/dashboard/AiAssistantPage';
import { SalesPage, RemindersPage } from './pages/dashboard/SalesRemindersPages';
import {
  SubscriptionPage,
  SettingsPage,
  TeamPage,
  ActivityPage,
  ImportExportPage,
} from './pages/dashboard/OperationalPages';
import { Invoice } from './types';

function AppRouter() {
  const { user } = useApp();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');

  // Modal states
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentCustomerId, setPaymentCustomerId] = useState<string | undefined>(undefined);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  const handleOpenPayment = (customerId?: string) => {
    setPaymentCustomerId(customerId);
    setPaymentModalOpen(true);
  };

  const isDashboardRoute = currentPath.startsWith('/dashboard');

  // Redirect unauthenticated users away from dashboard
  const effectivePath = isDashboardRoute && !user ? '/login' : currentPath;

  return (
    <div className="min-h-screen bg-[#F8FFF9] text-[#15251F] font-sans antialiased flex flex-col">
      {isDashboardRoute && user ? (
        // DASHBOARD LAYOUT
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentPath={effectivePath}
            onNavigate={navigate}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <TopNav
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
              onNavigate={navigate}
              selectedDateFilter={dateFilter}
              setSelectedDateFilter={setDateFilter}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {effectivePath === '/dashboard' && (
                <MainDashboard
                  onNavigate={navigate}
                  onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
                  onOpenPaymentModal={handleOpenPayment}
                  onOpenProductModal={() => setProductModalOpen(true)}
                  onOpenExpenseModal={() => setExpenseModalOpen(true)}
                  onViewInvoice={(inv) => setViewingInvoice(inv)}
                  dateFilter={dateFilter}
                />
              )}
              {effectivePath === '/dashboard/invoices' && (
                <InvoicesPage
                  onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
                  onViewInvoice={(inv) => setViewingInvoice(inv)}
                  onRecordPayment={handleOpenPayment}
                />
              )}
              {effectivePath === '/dashboard/sales' && (
                <SalesPage
                  onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
                  onViewInvoice={(inv) => setViewingInvoice(inv)}
                />
              )}
              {effectivePath === '/dashboard/udhaar' && (
                <UdhaarPage
                  onRecordPayment={handleOpenPayment}
                  onOpenCustomerModal={() => setCustomerModalOpen(true)}
                />
              )}
              {effectivePath === '/dashboard/inventory' && (
                <InventoryPage
                  onOpenProductModal={() => setProductModalOpen(true)}
                />
              )}
              {effectivePath === '/dashboard/expenses' && (
                <ExpensesPage
                  onOpenExpenseModal={() => setExpenseModalOpen(true)}
                />
              )}
              {effectivePath === '/dashboard/customers' && (
                <CustomersPage
                  onOpenCustomerModal={() => setCustomerModalOpen(true)}
                  onRecordPayment={handleOpenPayment}
                />
              )}
              {effectivePath === '/dashboard/suppliers' && <SuppliersPage />}
              {effectivePath === '/dashboard/purchases' && <PurchasesPage />}
              {effectivePath === '/dashboard/reports' && <ReportsPage />}
              {effectivePath === '/dashboard/ai-assistant' && <AiAssistantPage />}
              {effectivePath === '/dashboard/reminders' && <RemindersPage />}
              {effectivePath === '/dashboard/team' && <TeamPage />}
              {effectivePath === '/dashboard/subscription' && <SubscriptionPage />}
              {effectivePath === '/dashboard/activity' && <ActivityPage />}
              {effectivePath === '/dashboard/import-export' && <ImportExportPage />}
              {effectivePath === '/dashboard/settings' && <SettingsPage />}
            </main>
          </div>
        </div>
      ) : (
        // PUBLIC / AUTH LAYOUT
        <div className="flex-1 flex flex-col justify-between">
          <Header currentPath={effectivePath} onNavigate={navigate} />

          <main className="flex-1">
            {effectivePath === '/' && <LandingPage onNavigate={navigate} />}
            {effectivePath === '/features' && <FeaturesPage onNavigate={navigate} />}
            {effectivePath === '/pricing' && <PricingPage onNavigate={navigate} />}
            {effectivePath === '/about' && <AboutPage onNavigate={navigate} />}
            {effectivePath === '/contact' && <ContactPage onNavigate={navigate} />}
            {effectivePath === '/help' && <HelpPage onNavigate={navigate} />}
            {effectivePath === '/security' && <SecurityPage onNavigate={navigate} />}
            {effectivePath === '/privacy' && <PrivacyPage onNavigate={navigate} />}
            {effectivePath === '/terms' && <TermsPage onNavigate={navigate} />}
            {effectivePath === '/refund-policy' && <RefundPolicyPage onNavigate={navigate} />}
            {effectivePath === '/login' && <LoginPage onNavigate={navigate} />}
            {effectivePath === '/signup' && <SignupPage onNavigate={navigate} />}
            {effectivePath === '/forgot-password' && <ForgotPasswordPage onNavigate={navigate} />}
            {effectivePath === '/onboarding' && <OnboardingPage onNavigate={navigate} />}
          </main>

          <Footer onNavigate={navigate} />
        </div>
      )}

      {/* Global Modals */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onSuccessInvoice={(inv) => setViewingInvoice(inv)}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCustomerId={paymentCustomerId}
      />

      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      />

      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
      />

      <PrintableInvoice
        invoice={viewingInvoice}
        onClose={() => setViewingInvoice(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </LanguageProvider>
  );
}
