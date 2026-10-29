# Vyaparo (व्यापारो) - Smart Business Management Platform

> **"Your Business. One Smart Platform."**  
> *"Aapke Business Ka Smart Hisaab."*

Vyaparo is a modern, responsive business management SaaS platform designed for Indian small and medium businesses (Kirana stores, FMCG retail shops, mobile & electronics counters, wholesalers, and service providers).

---

## 🌟 Key Features

1. **Smart Billing & Invoicing (`/dashboard/invoices`)**
   - Instant POS receipt and GST invoice creation with automated CGST/SGST/IGST tax splits.
   - Line-item discounts, custom invoice numbering prefix (`VYP-2026-001`).
   - Thermal & A4 print-ready layout with direct UPI QR code generation (`Scan & Pay`).
   - 1-Click WhatsApp bill delivery link.

2. **Udhaar & Customer Credit Ledger (`/dashboard/udhaar`)**
   - Complete digital Khata book eliminating paper ledger loss.
   - Real-time customer balances with overdue aging tags (*"7 din se baki"*, *"3 din se baki"*, *"Due soon"*).
   - 1-Click copyable and WhatsApp click-to-chat reminder messages with pre-filled balance and UPI ID.
   - Partial and full payment settlement with customer ledger audit trail.

3. **Inventory & Stock Management (`/dashboard/inventory`)**
   - Automatic stock deductions on finalized invoice generation.
   - Real-time stock status badges: **● In Stock**, **● Low Stock**, and **● Out of Stock**.
   - Low-stock threshold triggers and quick stock adjustment modal.
   - Total inventory valuation based on purchase cost.

4. **Expense Tracker (`/dashboard/expenses`)**
   - Category-wise expense tracking (Shop Rent, Electricity, Transport, Staff Salaries, Packaging, Repairs).
   - Monthly burn summaries and CSV export.

5. **AI Business Assistant (`/dashboard/ai-assistant`)**
   - Grounded in your store's verified database records (sales, expenses, udhaar, low stock items).
   - Natural language queries in **English, Hindi, and Hinglish**.
   - Server-side proxy (`/api/ai/chat`) preventing API key leaks.

6. **Suppliers & Inward Purchases (`/dashboard/suppliers`, `/dashboard/purchases`)**
   - Track wholesale vendors, supplier bills, payables, and automatic inventory inward restocking.

7. **Reports & P&L Statements (`/dashboard/reports`)**
   - Financial breakdown distinguishing actual cash/UPI collected, outstanding credit, and operating expenses.
   - Estimated Gross Profit statement.
   - 1-Click CSV exports for CA filing.

8. **Subscriptions & Multi-User Roles (`/dashboard/subscription`, `/dashboard/team`)**
   - Configurable tiers: **Free Forever (₹0)**, **Starter (₹99/mo)**, **Growth (₹249/mo)**, and **Pro (₹499/mo)**.
   - Server-side order creation (`/api/payments/create-order`) and signature verification (`/api/payments/verify`).
   - Role-Based Access Control: Owner, Admin, Manager, and Staff.

---

## 🎨 Brand Design System

- **Primary Dark Forest Green:** `#0B2E26` (Sidebar, footer, hero contrast)
- **Primary Emerald Green:** `#0F8F5F` (Primary buttons, active indicators)
- **Accent Lime Green:** `#A7F432` (Call-to-action badges, growth accents)
- **Light Mint Background:** `#E8F9F0` (Cards, badges, highlighted rows)
- **Main Clean Background:** `#F8FFF9`
- **Text:** `#15251F` (Primary), `#61736A` (Secondary)
- **Borders:** `#DCE9E1`
- **Typography:** *Plus Jakarta Sans* & *JetBrains Mono*

---

## 🏗️ Technical Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend & Server:** Express, Node.js (`server.ts`), `@google/genai`
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) migrations
- **Local Persistence & Demo Mode:** High-performance fallback data layer with pre-populated Kirana store sample data
- **Testing:** Vitest

---

## 🚀 Local Installation & Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/vyaparo.git
   cd vyaparo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY`, and optionally `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Automated Tests:**
   ```bash
   npm run test
   ```

---

## 🗄️ Database Migrations (Supabase)

To link with a live Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Paste and run `/supabase/migrations/20261029000000_vyaparo_schema.sql`.
4. Paste and run `/supabase/seed.sql` to populate default subscription plans.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` or Vercel environment variables.

---

## ☁️ Vercel Deployment

1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL` (optional)
   - `VITE_SUPABASE_ANON_KEY` (optional)
   - `PAYMENT_GATEWAY_KEY_ID` (optional)
5. Deploy! Vercel will run `npm run build` and output to `dist/`.
