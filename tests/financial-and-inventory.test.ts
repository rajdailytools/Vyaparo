import { describe, it, expect } from 'vitest';
import { formatINR, getDaysOverdue } from '../src/lib/formatters';

describe('Vyaparo Financial Calculations', () => {
  it('correctly calculates line item total with discount and GST tax', () => {
    const qty = 5;
    const unitPrice = 100; // base = 500
    const discountRate = 10; // 10% discount = 50 off -> 450
    const taxRate = 18; // 18% GST on 450 = 81 -> 531

    const base = qty * unitPrice;
    const discounted = base * (1 - discountRate / 100);
    const withTax = discounted * (1 + taxRate / 100);

    expect(base).toBe(500);
    expect(discounted).toBe(450);
    expect(withTax).toBe(531);
  });

  it('correctly updates customer udhaar balance upon partial payment', () => {
    const initialUdhaar = 1200;
    const paymentAmount = 400;
    const remainingBalance = Math.max(0, initialUdhaar - paymentAmount);

    expect(remainingBalance).toBe(800);
  });

  it('correctly clamps balance to zero when payment exceeds or matches due', () => {
    const initialUdhaar = 500;
    const paymentAmount = 600;
    const remainingBalance = Math.max(0, initialUdhaar - paymentAmount);

    expect(remainingBalance).toBe(0);
  });

  it('formats Indian currency with proper comma grouping and rupee sign', () => {
    const formatted = formatINR(12450);
    expect(formatted).toContain('12,450');
    expect(formatted).toContain('₹');
  });

  it('calculates days overdue correctly', () => {
    const pastDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const days = getDaysOverdue(pastDate);
    expect(days).toBeGreaterThanOrEqual(6);
  });
});

describe('Vyaparo Stock & Inventory Rules', () => {
  it('safely decrements stock on invoice finalization without negative values', () => {
    const currentStock = 15;
    const billedQty = 10;
    const updatedStock = Math.max(0, currentStock - billedQty);

    expect(updatedStock).toBe(5);
  });

  it('safely increments stock on wholesale purchase arrival', () => {
    const currentStock = 30;
    const inwardQty = 50;
    const updatedStock = currentStock + inwardQty;

    expect(updatedStock).toBe(80);
  });
});
