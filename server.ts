import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Vyaparo',
    version: '1.0.0',
    mode: isProd ? 'production' : 'development',
    time: new Date().toISOString()
  });
});

// AI Business Assistant Proxy
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, businessContext, history, language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message query is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build context summary from verified business snapshot
    const contextSummary = businessContext ? `
CURRENT BUSINESS CONTEXT (Verified Database Records for "${businessContext.businessName || 'My Business'}"):
- Total Revenue / Sales: ₹${Number(businessContext.totalSales || 0).toLocaleString('en-IN')} (${businessContext.invoiceCount || 0} invoices)
- Total Expenses: ₹${Number(businessContext.totalExpenses || 0).toLocaleString('en-IN')}
- Outstanding Customer Udhaar (Credit to Collect): ₹${Number(businessContext.outstandingCredit || 0).toLocaleString('en-IN')}
- Estimated Gross Profit: ₹${Number(businessContext.estimatedProfit || 0).toLocaleString('en-IN')}
- Cash Collected: ₹${Number(businessContext.cashCollected || 0).toLocaleString('en-IN')}
- Low Stock Alerts: ${JSON.stringify(businessContext.lowStockProducts || [])}
- Top Performing Products: ${JSON.stringify(businessContext.topProducts || [])}
- Overdue Customer Udhaar Accounts: ${JSON.stringify(businessContext.overdueCustomers || [])}
- Recent Activity: ${JSON.stringify(businessContext.recentActivity || [])}
- Preferred Currency: INR (₹)
- Timezone: Asia/Kolkata
` : 'No business data available yet.';

    const systemInstruction = `
You are the official Vyaparo AI Business Assistant for Indian small businesses (Kirana, Retail, Wholesalers, Distributors, Services).
Your mission is to provide accurate, concise, practical, and trustworthy financial and operational insights based strictly on the provided verified business records.

CRITICAL RULES:
1. ONLY quote figures from the verified records provided in the context. Never invent transactions, customers, stock counts, or profits.
2. If the user asks about something missing or not in the context, clearly state that there are no recorded entries for that yet and advise them where to record it (e.g. Sales, Expenses, Udhaar).
3. Distinguish between actual revenue, cash received, accounts receivable (udhaar), operating expenses, and estimated gross profit.
4. Explain estimates and actionable recommendations with clear labels: "[Insight]", "[Action Item]", or "[Caution]".
5. Respect user language: if the user asks in Hindi or Hinglish, reply in polite, natural, business-friendly Hindi/Hinglish (e.g. "Aapke business ka kul udhaar ₹8,750 hai..."). If English, reply in crisp professional English.
6. Format all currency in Indian Rupee format (e.g. ₹12,450.00).
7. Keep answers structured with bullet points and bold key numbers for quick reading on mobile screens.
`;

    if (!apiKey) {
      // Deterministic intelligent heuristic fallback when GEMINI_API_KEY is not configured
      const q = message.toLowerCase();
      let reply = '';
      const langIsHi = language === 'hi' || q.includes('kya') || q.includes('kitna') || q.includes('hai') || q.includes('kaise');

      if (q.includes('sale') || q.includes('bikri') || q.includes('revenue') || q.includes('kamai')) {
        const sales = businessContext?.totalSales || 0;
        const count = businessContext?.invoiceCount || 0;
        reply = langIsHi
          ? `📊 **Bikri Ka Hisaab (Sales Report):**\n- Kul Bikri (Total Sales): **₹${Number(sales).toLocaleString('en-IN')}**\n- Kul Invoices / Bills: **${count}**\n\n💡 *Tip: Vyaparo Sales section se direct GST ya non-GST bill generate karein.*`
          : `📊 **Sales Summary:**\n- Total Recorded Sales: **₹${Number(sales).toLocaleString('en-IN')}**\n- Invoices Issued: **${count}**\n\n💡 *Tip: Head to Sales or Invoices to generate a new GST invoice or receipt.*`;
      } else if (q.includes('stock') || q.includes('inventory') || q.includes('maal') || q.includes('khatam') || q.includes('low')) {
        const low = businessContext?.lowStockProducts || [];
        if (low.length > 0) {
          const list = low.map((p: any) => `• **${p.name}**: Keval ${p.stock} baki (Threshold: ${p.minStock})`).join('\n');
          reply = langIsHi
            ? `⚠️ **Kam Stock Wale Products (Low Stock Alert):**\n${list}\n\n📦 *Inhe jaldi reorder karne ke liye Purchases section mein supplier order record karein.*`
            : `⚠️ **Low Stock Alert:**\n${list}\n\n📦 *Recommendation: Reorder these items from your Suppliers tab before stockouts.*`;
        } else {
          reply = langIsHi
            ? `✅ **Stock Status:** Sabhi products safe stock level par hain! Koi bhi item low-stock alert mein nahi hai.`
            : `✅ **Stock Status:** All products are currently above their low-stock thresholds. No critical shortages.`;
        }
      } else if (q.includes('udhaar') || q.includes('credit') || q.includes('baki') || q.includes('lena') || q.includes('customer')) {
        const credit = businessContext?.outstandingCredit || 0;
        const overdue = businessContext?.overdueCustomers || [];
        const overdueText = overdue.length > 0
          ? overdue.map((c: any) => `• **${c.name}**: ₹${Number(c.balance).toLocaleString('en-IN')} (${c.daysOverdue || 'Overdue'} baki)`).join('\n')
          : (langIsHi ? 'Koi overdue customer nahi hai.' : 'No overdue accounts pending.');
        reply = langIsHi
          ? `📋 **Udhaar (Customer Credit) Hisaab:**\n- Kul Lena Baki (Total Outstanding): **₹${Number(credit).toLocaleString('en-IN')}**\n\n**Pending Customers:**\n${overdueText}\n\n📲 *Vyaparo Udhaar section se ek click mein WhatsApp payment reminder share karein!*`
          : `📋 **Customer Udhaar (Receivables) Summary:**\n- Total Outstanding Credit: **₹${Number(credit).toLocaleString('en-IN')}**\n\n**Pending Overdue Customers:**\n${overdueText}\n\n📲 *Tip: Use the Udhaar tab to send instant WhatsApp reminder links.*`;
      } else if (q.includes('expense') || q.includes('kharcha') || q.includes('cost')) {
        const exp = businessContext?.totalExpenses || 0;
        reply = langIsHi
          ? `💸 **Kharcha (Expenses) Hisaab:**\n- Kul Kharcha: **₹${Number(exp).toLocaleString('en-IN')}**\n\n💡 *Rent, electricity, packaging aur salaries jaise category-wise kharche Expenses tab mein track karein.*`
          : `💸 **Expense Breakdown:**\n- Total Recorded Expenses: **₹${Number(exp).toLocaleString('en-IN')}**\n\n💡 *Tip: Category-wise tracking helps keep your operational burn healthy.*`;
      } else if (q.includes('profit') || q.includes('munafa') || q.includes('margin')) {
        const profit = businessContext?.estimatedProfit || 0;
        reply = langIsHi
          ? `📈 **Anumanit Labh (Estimated Gross Profit):**\n- Anumanit Profit: **₹${Number(profit).toLocaleString('en-IN')}**\n\n⚠️ *Yeh anuman bikri aur darj kharchon par aadharit hai. Net profit calculate karte samay tax aur depreciation dhyan mein rakhein.*`
          : `📈 **Estimated Gross Profit:**\n- Estimated Margin: **₹${Number(profit).toLocaleString('en-IN')}**\n\n⚠️ *Calculation Note: This represents estimated gross earnings based on recorded sales and operating costs.*`;
      } else {
        reply = langIsHi
          ? `Namaste! Main Vyaparo ka AI Vyapar Sahayak hoon. Main aapke business ka hisaab jaise:
• Aaj ki bikri aur invoices
• Kaunsa stock khatam hone wala hai
• Kis grahak (customer) se udhaar lena baki hai
• Maahine ka kul kharcha aur profit
Bata sakta hoon. Aap mujhse upar diye gaye sawaal pooch sakte hain!`
          : `Hello! I am your Vyaparo AI Business Assistant. I can help analyze your verified business records:
• Sales trends and invoice status
• Critical low-stock inventory warnings
• Customer udhaar (credit) and overdue collections
• Expense breakdown and estimated gross profit
Feel free to ask any specific question about your business!`;
      }

      return res.json({
        reply,
        model: 'vyaparo-heuristics-engine',
        note: 'Running on Vyaparo Local Analytics Engine (Set GEMINI_API_KEY in server environment for full generative Gemini insights)'
      });
    }

    // Call real Google Gemini API via @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${systemInstruction}\n\n${contextSummary}\n\nUser Question: ${message}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      reply: response.text || 'Unable to generate response at this time.',
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return res.status(500).json({
      error: 'AI assistant service temporarily unavailable',
      message: error?.message || 'Server error'
    });
  }
});

// Mock / Sandbox Payment Gateway Endpoints (Razorpay compatible architecture)
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { planId, amount, currency = 'INR', businessId } = req.body;
  if (!planId || !amount) {
    return res.status(400).json({ error: 'Missing planId or amount' });
  }

  // Generate order id
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  res.json({
    orderId,
    amount,
    currency,
    planId,
    businessId,
    keyId: process.env.PAYMENT_GATEWAY_KEY_ID || 'rzp_test_VyaparoSandbox2026',
    status: 'created',
    notes: 'Vyaparo Subscription Order'
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { orderId, paymentId, signature, planId } = req.body;
  
  if (!orderId || !paymentId) {
    return res.status(400).json({ verified: false, error: 'Incomplete payment payload' });
  }

  // In production with real secret: crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  const verified = true;
  res.json({
    verified,
    orderId,
    paymentId,
    planId,
    timestamp: new Date().toISOString(),
    message: 'Payment verified successfully by server'
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vyaparo server running on port ${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Vyaparo server:', err);
  process.exit(1);
});
