import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../../lib/i18n';
import { useApp } from '../../context/AppContext';
import { Menu, X, Globe, ArrowRight, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isDemoMode, toggleDemoMode } = useApp();

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8FFF9]/95 backdrop-blur-md border-b border-[#DCE9E1]">
      {/* Top micro banner */}
      <div className="bg-[#0B2E26] text-white py-1.5 px-4 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-[#A7F432] text-[#0B2E26] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            New 2026
          </span>
          <span>
            {language === 'hi'
              ? 'GST Invoicing aur WhatsApp Udhaar Reminders ke saath naya Vyaparo 2.0 launch ho gaya!'
              : 'Vyaparo 2.0 with Smart GST Invoicing & WhatsApp Reminders is now live!'}
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#A7F432]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A7F432]" />
            100% Safe & Cloud-Encrypted
          </span>
          <button
            onClick={() => toggleDemoMode()}
            className="text-white hover:text-[#A7F432] underline text-xs transition-colors"
          >
            {isDemoMode ? 'Demo Mode Active (Click for Clean State)' : 'Load Demo Store Data'}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => handleNav('/')}>
          <Logo variant="horizontal" size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#15251F]">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors hover:text-[#0F8F5F] ${currentPath === '/' ? 'text-[#0F8F5F] font-bold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/features')}
            className={`transition-colors hover:text-[#0F8F5F] ${currentPath === '/features' ? 'text-[#0F8F5F] font-bold' : ''}`}
          >
            Features
          </button>
          <button
            onClick={() => handleNav('/pricing')}
            className={`transition-colors hover:text-[#0F8F5F] ${currentPath === '/pricing' ? 'text-[#0F8F5F] font-bold' : ''}`}
          >
            Pricing
          </button>

          {/* For Businesses Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#0F8F5F] transition-colors"
            >
              For Business
              <ChevronDown className="w-4 h-4" />
            </button>
            {businessDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#DCE9E1] p-3 space-y-1 z-50"
                onMouseLeave={() => setBusinessDropdownOpen(false)}
              >
                <button
                  onClick={() => { setBusinessDropdownOpen(false); handleNav('/features'); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#E8F9F0] text-xs font-semibold text-[#0B2E26]"
                >
                  🏪 Kirana & FMCG Retailers
                </button>
                <button
                  onClick={() => { setBusinessDropdownOpen(false); handleNav('/features'); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#E8F9F0] text-xs font-semibold text-[#0B2E26]"
                >
                  📱 Mobile & Electronics Stores
                </button>
                <button
                  onClick={() => { setBusinessDropdownOpen(false); handleNav('/features'); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#E8F9F0] text-xs font-semibold text-[#0B2E26]"
                >
                  👕 Clothing & Garments
                </button>
                <button
                  onClick={() => { setBusinessDropdownOpen(false); handleNav('/features'); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#E8F9F0] text-xs font-semibold text-[#0B2E26]"
                >
                  📦 Wholesalers & Distributors
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('/about')}
            className={`transition-colors hover:text-[#0F8F5F] ${currentPath === '/about' ? 'text-[#0F8F5F] font-bold' : ''}`}
          >
            About
          </button>
          <button
            onClick={() => handleNav('/contact')}
            className={`transition-colors hover:text-[#0F8F5F] ${currentPath === '/contact' ? 'text-[#0F8F5F] font-bold' : ''}`}
          >
            Contact
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#E8F9F0] border border-[#DCE9E1] rounded-full p-1 text-xs font-bold text-[#0B2E26]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en' ? 'bg-[#0F8F5F] text-white shadow-sm' : 'text-[#61736A] hover:text-[#0B2E26]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'hi' ? 'bg-[#0F8F5F] text-white shadow-sm' : 'text-[#61736A] hover:text-[#0B2E26]'
              }`}
            >
              हिंदी
            </button>
          </div>

          {user ? (
            <button
              onClick={() => handleNav('/dashboard')}
              className="flex items-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all duration-200"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 font-bold text-sm text-[#0B2E26] hover:text-[#0F8F5F] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="flex items-center gap-2 bg-[#A7F432] hover:bg-[#8ee01d] text-[#0B2E26] font-extrabold px-5 py-2.5 rounded-full text-sm shadow-sm transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4 text-[#0B2E26]" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center bg-[#E8F9F0] rounded-full p-0.5 text-[11px] font-bold text-[#0B2E26]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full ${language === 'en' ? 'bg-[#0F8F5F] text-white' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded-full ${language === 'hi' ? 'bg-[#0F8F5F] text-white' : ''}`}
            >
              हिं
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0B2E26] hover:bg-[#E8F9F0] rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DCE9E1] px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNav('/')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/features')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            Features
          </button>
          <button
            onClick={() => handleNav('/pricing')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNav('/about')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            About Us
          </button>
          <button
            onClick={() => handleNav('/contact')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            Contact Support
          </button>
          <button
            onClick={() => handleNav('/help')}
            className="block w-full text-left py-2 font-semibold text-[#15251F]"
          >
            Help Center
          </button>

          <div className="pt-4 border-t border-[#DCE9E1] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => handleNav('/dashboard')}
                className="w-full bg-[#0F8F5F] text-white py-3 rounded-xl font-bold text-center"
              >
                Open Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/signup')}
                  className="w-full bg-[#A7F432] text-[#0B2E26] py-3 rounded-xl font-bold text-center"
                >
                  Start Free Now
                </button>
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full border border-[#DCE9E1] py-3 rounded-xl font-bold text-center text-[#15251F]"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
