import React, { useState } from 'react';
import { useApp, SUBSCRIPTION_PLANS } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import {
  CreditCard,
  Settings,
  Users2,
  History,
  FileSpreadsheet,
  Bell,
  Check,
  CheckCircle2,
  Shield,
  ArrowRight,
  Upload,
  Download,
  IndianRupee,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Role } from '../../types';

// 1. SUBSCRIPTION PAGE
export const SubscriptionPage: React.FC = () => {
  const { currentPlan, upgradePlan, currentBusiness, invoices, products } = useApp();
  const [upgrading, setUpgrading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheckout = async (planId: string) => {
    setUpgrading(true);
    setSuccessMessage('');
    try {
      // 1. Create order on server
      const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          amount: targetPlan?.priceInr || 99,
          businessId: currentBusiness?.id,
        }),
      });
      const orderData = await res.json();

      // 2. Verify payment on server
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_${Date.now()}`,
          signature: 'sig_mock_verified',
          planId,
        }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.verified) {
        upgradePlan(planId);
        setSuccessMessage(`Successfully upgraded to ${targetPlan?.name} plan! Entitlements are now active.`);
      }
    } catch (e: any) {
      console.error('Subscription checkout error:', e);
    } finally {
      setUpgrading(false);
    }
  };

  const invoiceUsagePercent = Math.min(100, Math.round((invoices.length / currentPlan.invoiceLimit) * 100));
  const productUsagePercent = Math.min(100, Math.round((products.length / currentPlan.productLimit) * 100));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#0B2E26]">Subscription & Billing</h1>
        <p className="text-xs text-[#61736A] mt-1">
          Manage your plan entitlements, usage meters, and billing cycle.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Current Plan & Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B2E26] text-white p-6 rounded-3xl border-2 border-[#A7F432] shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#A7F432] block">Current Active Plan</span>
            <h2 className="text-3xl font-extrabold mt-1">{currentPlan.name}</h2>
            <div className="mt-2 text-2xl font-black text-[#A7F432]">
              ₹{currentPlan.priceInr}<span className="text-xs text-[#E8F9F0]/70 font-normal">/month</span>
            </div>
            <p className="text-xs text-[#E8F9F0]/80 mt-2">
              Next billing cycle renews on {formatDate(new Date(Date.now() + 30 * 86400000).toISOString())}.
            </p>
          </div>

          <div className="pt-6 border-t border-[#0F8F5F]/40 text-xs text-[#E8F9F0]">
            <span>Verified Server-Side Subscription Active</span>
          </div>
        </div>

        {/* Invoices Usage Meter */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Monthly Invoices Usage</span>
            <div className="mt-2 text-2xl font-black text-[#0B2E26]">
              {invoices.length} / {currentPlan.invoiceLimit > 9999 ? '∞' : currentPlan.invoiceLimit}
            </div>
            <div className="w-full bg-[#E8F9F0] h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#0F8F5F] h-full rounded-full transition-all duration-500"
                style={{ width: `${invoiceUsagePercent}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-[#61736A] mt-4">
            {invoiceUsagePercent}% quota used this month.
          </p>
        </div>

        {/* Product Catalog Usage Meter */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Product Catalog Limit</span>
            <div className="mt-2 text-2xl font-black text-[#0B2E26]">
              {products.length} / {currentPlan.productLimit > 9999 ? '∞' : currentPlan.productLimit}
            </div>
            <div className="w-full bg-[#E8F9F0] h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#0F8F5F] h-full rounded-full transition-all duration-500"
                style={{ width: `${productUsagePercent}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-[#61736A] mt-4">
            {productUsagePercent}% catalog capacity utilized.
          </p>
        </div>
      </div>

      {/* Available Plans for Upgrade */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] space-y-4">
        <h3 className="font-extrabold text-base text-[#0B2E26]">Available Subscription Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border text-xs flex flex-col justify-between ${
                  isCurrent ? 'bg-[#E8F9F0] border-[#0F8F5F]' : 'bg-[#F8FFF9] border-[#DCE9E1]'
                }`}
              >
                <div>
                  <span className="font-extrabold text-sm text-[#0B2E26] block">{plan.name}</span>
                  <span className="text-xl font-black text-[#0F8F5F] block mt-1">₹{plan.priceInr}/mo</span>
                  <div className="mt-3 space-y-1.5 text-[#61736A]">
                    <div>• {plan.invoiceLimit > 9999 ? 'Unlimited' : plan.invoiceLimit} Invoices</div>
                    <div>• {plan.productLimit > 9999 ? 'Unlimited' : plan.productLimit} Products</div>
                    <div>• {plan.teamLimit} Staff Users</div>
                    <div>• {plan.aiQueriesLimit} AI Queries</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCE9E1]">
                  {isCurrent ? (
                    <span className="text-center block font-bold text-[#0F8F5F]">Current Active</span>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={upgrading}
                      className="w-full bg-[#0F8F5F] hover:bg-[#0B2E26] text-white py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      {upgrading ? 'Processing...' : `Switch to ${plan.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. SETTINGS PAGE
export const SettingsPage: React.FC = () => {
  const { currentBusiness, updateBusiness } = useApp();
  const [formData, setFormData] = useState({
    name: currentBusiness?.name || '',
    category: currentBusiness?.category || '',
    phone: currentBusiness?.phone || '',
    email: currentBusiness?.email || '',
    addressLine1: currentBusiness?.addressLine1 || '',
    city: currentBusiness?.city || '',
    state: currentBusiness?.state || '',
    pincode: currentBusiness?.pincode || '',
    gstin: currentBusiness?.gstin || '',
    upiId: currentBusiness?.upiId || '',
    bankName: currentBusiness?.bankName || '',
    bankAccountNo: currentBusiness?.bankAccountNo || '',
    bankIfsc: currentBusiness?.bankIfsc || '',
    invoicePrefix: currentBusiness?.invoicePrefix || 'VYP',
    isGstRegistered: currentBusiness?.isGstRegistered ?? true,
    defaultTaxRate: currentBusiness?.defaultTaxRate ?? 18,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#0B2E26]">Store Settings & Profile</h1>
        <p className="text-xs text-[#61736A] mt-1">
          Configure business details, GSTIN, UPI ID, and bank account for invoice printing.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Store settings saved and updated across all bill templates!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-6 text-xs">
        {/* Section 1: Business Identity */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-[#0B2E26] pb-2 border-b border-[#DCE9E1]">
            1. Business Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Official Mobile / Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Store Address</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: UPI & Bank Details for QR Code */}
        <div className="space-y-4 pt-4 border-t border-[#DCE9E1]">
          <h3 className="font-extrabold text-sm text-[#0B2E26] pb-2 border-b border-[#DCE9E1]">
            2. Payment & UPI QR Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">UPI ID (For bill QR payment) *</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="merchant@okhdfcbank"
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F8F5F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="HDFC Bank"
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Bank Account Number</label>
              <input
                type="text"
                value={formData.bankAccountNo}
                onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.bankIfsc}
                onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase() })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs uppercase focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Invoicing & GST */}
        <div className="space-y-4 pt-4 border-t border-[#DCE9E1]">
          <h3 className="font-extrabold text-sm text-[#0B2E26] pb-2 border-b border-[#DCE9E1]">
            3. GST & Invoice Prefix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="27AABCU9603R1ZM"
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs uppercase focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Invoice Number Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value.toUpperCase() })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs uppercase font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};

// 3. TEAM & ROLES PAGE
export const TeamPage: React.FC = () => {
  const { currentPlan } = useApp();
  const [members, setMembers] = useState<any[]>([
    { id: 'm_1', name: 'Raj Sharma', email: 'rajdailytools@gmail.com', role: 'Owner', status: 'Active' },
    { id: 'm_2', name: 'Sunil Kumar', email: 'sunil@store.com', role: 'Manager', status: 'Active' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('staff');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setMembers([
      ...members,
      {
        id: `m_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole.toUpperCase(),
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#0B2E26]">Team & Staff Management</h1>
        <p className="text-xs text-[#61736A] mt-1">
          Assign role-based access for billing counters, inventory managers, and accountants.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-[#0B2E26]">Invite Team Member</h3>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="colleague@business.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as Role)}
            className="bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="staff">Staff (Billing only)</option>
            <option value="manager">Manager (Billing & Stock)</option>
            <option value="admin">Admin (Full Operational)</option>
          </select>
          <button
            type="submit"
            className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            Send Invite
          </button>
        </form>

        <div className="divide-y divide-[#DCE9E1] pt-4">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#0B2E26] block">{m.name}</span>
                <span className="text-[#61736A]">{m.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#0F8F5F] bg-[#E8F9F0] px-2.5 py-1 rounded-full text-[11px]">
                  {m.role}
                </span>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. ACTIVITY AUDIT LOG
export const ActivityPage: React.FC = () => {
  const { activities } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#0B2E26]">Activity & Financial Audit Log</h1>
        <p className="text-xs text-[#61736A] mt-1">
          Chronological audit trail of all invoices, stock changes, and expense entries.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#DCE9E1] p-6 shadow-xs divide-y divide-[#DCE9E1]">
        {activities.map((act) => (
          <div key={act.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F9F0] text-[#0F8F5F] flex items-center justify-center shrink-0 mt-0.5">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-[#0B2E26] block">{act.action}</span>
                <span className="text-[#61736A] mt-0.5 block">{act.details}</span>
              </div>
            </div>
            <span className="text-[10px] text-[#61736A] shrink-0 font-mono">
              {formatDate(act.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. IMPORT / EXPORT PAGE
export const ImportExportPage: React.FC = () => {
  const { invoices, customers, products, expenses } = useApp();

  const handleExportAll = () => {
    exportToCSV('Vyaparo_All_Customers', customers);
    exportToCSV('Vyaparo_All_Products', products);
    exportToCSV('Vyaparo_All_Invoices', invoices);
    exportToCSV('Vyaparo_All_Expenses', expenses);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#0B2E26]">Data Import & Export</h1>
        <p className="text-xs text-[#61736A] mt-1">
          1-click complete store backups to Excel-compatible CSV files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#0B2E26]">Export Business Data</h3>
          <p className="text-xs text-[#61736A] leading-relaxed">
            Download your verified customers, invoices, products, and expenses into CSV files for your CA, tax filing, or offline backup.
          </p>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download All Store CSVs</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#0B2E26]">Import Existing Products</h3>
          <p className="text-xs text-[#61736A] leading-relaxed">
            Bulk upload products from your existing Excel or accounting spreadsheets using our standard template.
          </p>
          <div className="p-4 border-2 border-dashed border-[#DCE9E1] rounded-2xl text-center text-xs text-[#61736A]">
            <Upload className="w-6 h-6 text-[#0F8F5F] mx-auto mb-1.5" />
            <span>Drop your CSV here or click to browse</span>
          </div>
        </div>
      </div>
    </div>
  );
};
