import React from 'react';
import { Logo } from './Logo';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B2E26] text-white pt-16 pb-12 border-t border-[#0F8F5F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#0F8F5F]/30">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" theme="dark" size="md" />
            <p className="text-[#E8F9F0]/80 text-sm leading-relaxed max-w-sm mt-3">
              Vyaparo is a modern business management SaaS built specifically for Indian small businesses. Manage billing, stock, customer credit (udhaar), expenses, and profit in one secure platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A7F432] font-semibold pt-2">
              <Shield className="w-4 h-4 text-[#A7F432]" />
              <span>Bank-Grade 256-bit SSL & Supabase RLS Isolation</span>
            </div>
            <div className="text-xs text-[#E8F9F0]/60">
              Made with pride for Indian Kiranas, Retailers & Wholesalers.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#A7F432]">Product</h4>
            <ul className="space-y-2 text-sm text-[#E8F9F0]/80">
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                  Smart GST Billing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                  Customer Udhaar Ledger
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                  Real-time Inventory Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                  AI Business Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-white transition-colors">
                  Pricing Plans (From ₹99)
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#A7F432]">Company</h4>
            <ul className="space-y-2 text-sm text-[#E8F9F0]/80">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About Vyaparo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/security')} className="hover:text-white transition-colors">
                  Security & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#A7F432]">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm text-[#E8F9F0]/80">
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/refund-policy')} className="hover:text-white transition-colors">
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <span className="text-xs text-[#E8F9F0]/50 block mt-2">
                  *Vyaparo provides management software and does not act as a licensed tax advisory or government entity.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8F9F0]/60 gap-4">
          <div>
            © {new Date().getFullYear()} Vyaparo Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/security')} className="hover:text-white">Security</button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-white">Terms</button>
            <button onClick={() => onNavigate('/refund-policy')} className="hover:text-white">Refunds</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
