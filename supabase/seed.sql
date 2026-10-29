-- ============================================================================
-- VYAPARO Seed Data
-- ============================================================================

INSERT INTO subscription_plans (id, name, price_inr, interval, invoice_limit, product_limit, team_limit, ai_queries_per_month, features)
VALUES
('free', 'Free Forever', 0, 'monthly', 30, 50, 1, 10, '["Basic Billing", "Udhaar Ledger", "Mobile Access", "Standard Reports"]'::jsonb),
('starter', 'Starter', 99, 'monthly', 200, 250, 2, 50, '["GST Invoicing", "WhatsApp Reminders", "Stock Alerts", "CSV Export", "Standard Support"]'::jsonb),
('growth', 'Growth', 249, 'monthly', 1000, 1500, 5, 200, '["Multi-Counter Billing", "AI Business Assistant", "Staff Roles", "Automated Ledgers", "Priority Support"]'::jsonb),
('pro', 'Pro Business', 499, 'monthly', 999999, 999999, 20, 1000, '["Unlimited Invoices", "Full AI Analytics", "Multiple Branches", "Custom Branding", "Dedicated Account Manager"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
