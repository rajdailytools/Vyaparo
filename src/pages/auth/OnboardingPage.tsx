import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../lib/i18n';
import { Check, ArrowRight, ArrowLeft, Store, Sparkles, Building, CheckCircle2 } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (path: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user, createBusiness, addProduct, addCustomer } = useApp();
  const { language, setLanguage } = useLanguage();
  const [step, setStep] = useState(1);

  // Form State
  const [personalName, setPersonalName] = useState(user?.fullName || 'Raj Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  
  const [businessName, setBusinessName] = useState('My General Store');
  const [category, setCategory] = useState('Kirana & Retail');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400001');

  const [isGst, setIsGst] = useState(true);
  const [gstin, setGstin] = useState('');
  const [defaultTaxRate, setDefaultTaxRate] = useState(18);
  const [invoicePrefix, setInvoicePrefix] = useState('VYP');

  const [firstProductName, setFirstProductName] = useState('Basmati Rice 1kg');
  const [firstProductPrice, setFirstProductPrice] = useState('80');
  const [firstProductStock, setFirstProductStock] = useState('50');

  const handleFinish = () => {
    // 1. Create the business workspace
    const newBiz = createBusiness({
      name: businessName,
      category,
      phone,
      email: user?.email || '',
      addressLine1: `${city}, ${state}`,
      city,
      state,
      pincode,
      currency: 'INR',
      isGstRegistered: isGst,
      gstin: isGst ? gstin : undefined,
      defaultTaxRate,
      invoicePrefix,
    });

    // 2. Add first product if provided
    if (firstProductName) {
      addProduct({
        name: firstProductName,
        category: 'General',
        unit: 'pcs',
        purchasePrice: Math.round(Number(firstProductPrice) * 0.75),
        sellingPrice: Number(firstProductPrice) || 50,
        currentStock: Number(firstProductStock) || 10,
        minStockAlert: 10,
        taxRate: defaultTaxRate,
        isActive: true,
      });
    }

    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FFF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Logo variant="full" size="md" />
          <h1 className="text-2xl font-extrabold text-[#0B2E26] mt-4">Welcome to Vyaparo Setup</h1>
          <p className="text-xs text-[#61736A]">
            Let's configure your store parameters. Step {step} of 5.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#DCE9E1] -translate-y-1/2 z-0" />
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all ${
                step > s
                  ? 'bg-[#0F8F5F] text-white shadow-xs'
                  : step === s
                  ? 'bg-[#A7F432] text-[#0B2E26] ring-4 ring-[#E8F9F0] font-black'
                  : 'bg-white border-2 border-[#DCE9E1] text-[#61736A]'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>

        {/* Card Canvas */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE9E1] shadow-xl space-y-6">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-[#DCE9E1] pb-3">
                <h3 className="font-bold text-base text-[#0B2E26]">Step 1: Your Profile</h3>
                <p className="text-xs text-[#61736A]">Your name and preferred display language.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Preferred Language</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      language === 'en'
                        ? 'border-[#0F8F5F] bg-[#E8F9F0] text-[#0F8F5F]'
                        : 'border-[#DCE9E1] text-[#61736A]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      language === 'hi'
                        ? 'border-[#0F8F5F] bg-[#E8F9F0] text-[#0F8F5F]'
                        : 'border-[#DCE9E1] text-[#61736A]'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-[#DCE9E1] pb-3">
                <h3 className="font-bold text-base text-[#0B2E26]">Step 2: Business Details</h3>
                <p className="text-xs text-[#61736A]">How your shop will appear on invoices and reports.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Business / Dukan Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="e.g. Mahavir Kirana Stores"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                >
                  <option value="Kirana & Retail">Kirana & Retail Store</option>
                  <option value="Mobile & Electronics">Mobile & Electronics</option>
                  <option value="Clothing & Garments">Clothing & Garments</option>
                  <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                  <option value="Service & Freelancing">Service & Freelancing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Business Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#DCE9E1] pb-3">
                <h3 className="font-bold text-base text-[#0B2E26]">Step 3: Tax & Invoicing Rules</h3>
                <p className="text-xs text-[#61736A]">GST registration and invoice numbering format.</p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#F8FFF9] border border-[#DCE9E1] rounded-2xl">
                <div>
                  <span className="font-bold text-xs text-[#0B2E26] block">Is your business GST registered?</span>
                  <span className="text-[11px] text-[#61736A]">Enables automatic CGST/SGST tax breakdown on bills.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isGst}
                  onChange={(e) => setIsGst(e.target.checked)}
                  className="w-5 h-5 accent-[#0F8F5F] rounded cursor-pointer"
                />
              </div>

              {isGst && (
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs uppercase text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">Invoice Prefix</label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs uppercase font-bold text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                    placeholder="VYP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">Default Tax Rate (%)</label>
                  <select
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18% (Standard)</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: First Product */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-[#DCE9E1] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0B2E26]">Step 4: Add Your First Item</h3>
                  <p className="text-xs text-[#61736A]">Start populating your inventory right now.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs font-bold text-[#0F8F5F] hover:underline"
                >
                  Skip for now →
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Product Name</label>
                <input
                  type="text"
                  value={firstProductName}
                  onChange={(e) => setFirstProductName(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="e.g. Fortune Sunflower Oil 1L"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={firstProductPrice}
                    onChange={(e) => setFirstProductPrice(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">Current Stock Qty</label>
                  <input
                    type="number"
                    value={firstProductStock}
                    onChange={(e) => setFirstProductStock(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Finish */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F9F0] text-[#0F8F5F] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B2E26]">Workspace Setup Complete!</h2>
              <p className="text-xs text-[#61736A] max-w-sm mx-auto">
                <strong>{businessName}</strong> is ready. You can now generate GST bills, record customer udhaar, track stock, and ask AI questions.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#DCE9E1]">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#61736A] hover:text-[#0B2E26]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 bg-[#A7F432] hover:bg-[#92df1d] text-[#0B2E26] py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-colors"
              >
                <span>Launch Business Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
