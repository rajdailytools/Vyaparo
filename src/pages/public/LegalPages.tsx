import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, Mail, Phone, MapPin, Send, HelpCircle, FileText } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';

interface NavProp {
  onNavigate: (path: string) => void;
}

// 1. ABOUT PAGE
export const AboutPage: React.FC<NavProp> = ({ onNavigate }) => {
  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full uppercase">
            Our Mission
          </span>
          <h1 className="text-4xl font-extrabold text-[#0B2E26]">Empowering the Retail Backbone of Bharat</h1>
          <p className="text-base text-[#61736A] max-w-2xl mx-auto">
            From local kiranas to wholesalers, millions of Indian small businesses power our daily lives using paper diaries and memory. Vyaparo was born to give them modern software without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] space-y-3">
            <h3 className="font-extrabold text-lg text-[#0B2E26]">Simplicity First</h3>
            <p className="text-xs text-[#61736A] leading-relaxed">
              If a shopkeeper can use WhatsApp, they can run Vyaparo. We design for zero learning curves and zero unnecessary accounting jargon.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] space-y-3">
            <h3 className="font-extrabold text-lg text-[#0B2E26]">Built for Real Bharat</h3>
            <p className="text-xs text-[#61736A] leading-relaxed">
              Udhaar (customer credit) is central to Indian retail. We built dedicated WhatsApp reminders, UPI QR integration, and bilingual Hindi support right into the core.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] space-y-3">
            <h3 className="font-extrabold text-lg text-[#0B2E26]">Cloud Trust & Security</h3>
            <p className="text-xs text-[#61736A] leading-relaxed">
              Every merchant's data is strictly isolated with Row-Level Security. You own your data, with 1-click CSV backups available at all times.
            </p>
          </div>
        </div>

        <div className="bg-[#0B2E26] text-white p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to see Vyaparo in action?</h2>
          <button
            onClick={() => onNavigate('/signup')}
            className="bg-[#A7F432] text-[#0B2E26] font-bold px-6 py-3 rounded-full text-xs hover:bg-[#93e01d] transition-colors"
          >
            Start Free Business Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. CONTACT PAGE
export const ContactPage: React.FC<NavProp> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full uppercase">
            Support & Inquiries
          </span>
          <h1 className="text-4xl font-extrabold text-[#0B2E26]">We are here to support your business</h1>
          <p className="text-sm text-[#61736A]">
            Have questions about GST invoicing, custom wholesale setups, or subscription support?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-white p-8 rounded-3xl border border-[#DCE9E1] space-y-6">
            <h3 className="font-bold text-lg text-[#0B2E26]">Contact Information</h3>
            <div className="space-y-4 text-xs text-[#61736A]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#0F8F5F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2E26] block">Email Support</span>
                  <span>support@vyaparo.com</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0F8F5F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2E26] block">Merchant Helpdesk</span>
                  <span>+91 98765 43210 (Mon - Sat, 9 AM - 8 PM IST)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0F8F5F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2E26] block">Headquarters</span>
                  <span>Vyaparo Technologies, BKC Commercial Hub, Bandra East, Mumbai, Maharashtra 400051</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#E8F9F0] text-xs text-[#0F8F5F] font-medium">
              💡 Average merchant response time: Under 15 minutes during business hours.
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-[#DCE9E1]">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-[#E8F9F0] text-[#0F8F5F] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0B2E26]">Dhanyawaad! Message Received</h3>
                <p className="text-xs text-[#61736A] max-w-sm mx-auto">
                  Our merchant support team has received your message and will reach out via WhatsApp/email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#0F8F5F] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-lg text-[#0B2E26]">Send Us a Message</h3>
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#61736A] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                      placeholder="+91 98200 12345"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#61736A] mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                      placeholder="merchant@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#61736A] mb-1">How can we help? *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                    placeholder="Tell us about your shop or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white py-3 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. HELP CENTER PAGE
export const HelpPage: React.FC<NavProp> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');

  const guides = [
    { title: 'How to create your first GST invoice in 30 seconds', category: 'Billing', readTime: '2 min read' },
    { title: 'Sending 1-click WhatsApp payment reminders with UPI QR', category: 'Udhaar', readTime: '3 min read' },
    { title: 'Setting low-stock alerts and tracking automatic deductions', category: 'Inventory', readTime: '2 min read' },
    { title: 'Calculating estimated Gross Profit & Cost of Goods Sold', category: 'Reports', readTime: '4 min read' },
    { title: 'Adding staff members and restricting access to owner settings', category: 'Team Roles', readTime: '3 min read' },
    { title: 'Exporting your complete store ledger to CSV for CA filing', category: 'Export', readTime: '1 min read' },
  ];

  const filtered = guides.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full uppercase">
            Merchant Knowledgebase
          </span>
          <h1 className="text-4xl font-extrabold text-[#0B2E26]">Vyaparo Help & Learning Center</h1>
          <p className="text-sm text-[#61736A]">
            Guides, video walkthroughs, and step-by-step instructions to get the most out of your store management.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics (e.g. GST, WhatsApp, Udhaar, Stock)..."
              className="w-full bg-white border border-[#DCE9E1] rounded-2xl px-4 py-3 text-xs shadow-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((g, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#DCE9E1] hover:border-[#0F8F5F] transition-all cursor-pointer space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#0F8F5F] bg-[#E8F9F0] px-2 py-0.5 rounded">{g.category}</span>
                <span className="text-[#61736A]">{g.readTime}</span>
              </div>
              <h3 className="font-bold text-sm text-[#0B2E26]">{g.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. SECURITY & ARCHITECTURE PAGE
export const SecurityPage: React.FC<NavProp> = () => {
  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#E8F9F0] text-[#0F8F5F] rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E26]">Security & Data Isolation Architecture</h1>
          <p className="text-sm text-[#61736A] max-w-xl mx-auto">
            How Vyaparo protects your business records, invoices, and customer credit ledger with zero compromise.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#DCE9E1] space-y-6 text-sm text-[#61736A] leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-[#0B2E26] text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0F8F5F]" />
              Row Level Security (RLS) Database Isolation
            </h3>
            <p>
              Every database query enforces PostgreSQL Row Level Security (RLS). Tenants are partitioned by strict <code>business_id</code> foreign keys validated against active session memberships. A merchant cannot query or tamper with another merchant's records.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#0B2E26] text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F8F5F]" />
              Zero Secrets in Frontend Code
            </h3>
            <p>
              Supabase service role keys, Google Gemini AI API credentials, and payment gateway secret keys are strictly held on the Node.js server. The client only ever communicates via authenticated sessions and protected server proxies.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#0B2E26] text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F8F5F]" />
              Tamper-Proof Financial Audit Trail
            </h3>
            <p>
              Customer ledger entries, payment collections, and inventory deductions generate permanent transaction records. Overdue balances are derived directly from verified invoice and payment events rather than arbitrary single-field overrides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. PRIVACY POLICY
export const PrivacyPage: React.FC<NavProp> = () => (
  <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#DCE9E1]">
      <h1 className="text-3xl font-extrabold text-[#0B2E26]">Privacy Policy</h1>
      <p className="text-xs text-[#61736A]">Last updated: October 2026</p>
      <div className="space-y-4 text-xs sm:text-sm text-[#61736A] leading-relaxed">
        <p>
          Vyaparo Technologies Pvt. Ltd. ("Vyaparo", "we", "us") values your privacy. This policy outlines how your business data, contact details, and transaction history are collected and handled.
        </p>
        <h3 className="font-bold text-[#0B2E26]">1. Data Ownership</h3>
        <p>
          You retain complete and sole ownership of all customer lists, invoices, expense records, and inventory data entered into Vyaparo. We do not sell your customer data to advertisers or third parties.
        </p>
        <h3 className="font-bold text-[#0B2E26]">2. Information We Collect</h3>
        <p>
          We collect your account email, business name, phone number, and transaction records required for software operation. When you use the AI assistant, only the relevant numerical summaries of your own store are processed to provide insights.
        </p>
        <h3 className="font-bold text-[#0B2E26]">3. Data Export & Deletion</h3>
        <p>
          You can export your complete records to CSV format at any time from the Import/Export tab. If you wish to permanently delete your business account, you can submit a deletion request under Settings.
        </p>
      </div>
    </div>
  </div>
);

// 6. TERMS OF SERVICE
export const TermsPage: React.FC<NavProp> = () => (
  <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#DCE9E1]">
      <h1 className="text-3xl font-extrabold text-[#0B2E26]">Terms of Service</h1>
      <p className="text-xs text-[#61736A]">Last updated: October 2026</p>
      <div className="space-y-4 text-xs sm:text-sm text-[#61736A] leading-relaxed">
        <p>
          By accessing or using the Vyaparo platform, you agree to comply with these terms.
        </p>
        <h3 className="font-bold text-[#0B2E26]">1. Business Management Software</h3>
        <p>
          Vyaparo provides tools for billing, inventory management, customer credit ledgers, and financial reporting. Vyaparo is not a chartered accountancy firm and does not provide legal or tax filing advice. Users are responsible for their own tax registrations and compliance.
        </p>
        <h3 className="font-bold text-[#0B2E26]">2. Account Security</h3>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your business account.
        </p>
        <h3 className="font-bold text-[#0B2E26]">3. Subscription & Billing</h3>
        <p>
          Paid subscriptions renew on a monthly or annual basis as selected. You may upgrade, downgrade, or cancel your subscription at any time prior to the renewal date.
        </p>
      </div>
    </div>
  </div>
);

// 7. REFUND & CANCELLATION POLICY
export const RefundPolicyPage: React.FC<NavProp> = () => (
  <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#DCE9E1]">
      <h1 className="text-3xl font-extrabold text-[#0B2E26]">Refund and Cancellation Policy</h1>
      <p className="text-xs text-[#61736A]">Last updated: October 2026</p>
      <div className="space-y-4 text-xs sm:text-sm text-[#61736A] leading-relaxed">
        <h3 className="font-bold text-[#0B2E26]">1. 14-Day Money Back Guarantee</h3>
        <p>
          We offer a full 100% refund within 14 days of your initial paid subscription purchase if you are not satisfied with Vyaparo for any reason.
        </p>
        <h3 className="font-bold text-[#0B2E26]">2. Cancellation Process</h3>
        <p>
          You can cancel your subscription renewal directly from the Dashboard &gt; Subscription page with one click. Upon cancellation, you retain access until the end of your billing cycle.
        </p>
        <h3 className="font-bold text-[#0B2E26]">3. Processing Refunds</h3>
        <p>
          Refund requests can be submitted via email to refunds@vyaparo.com. Approved refunds are credited back to the original payment source (UPI, Card, or Net Banking) within 5 to 7 business days.
        </p>
      </div>
    </div>
  </div>
);
