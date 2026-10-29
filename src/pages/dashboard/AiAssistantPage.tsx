import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../lib/i18n';
import { formatINR } from '../../lib/formatters';
import {
  Brain,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: string;
}

export const AiAssistantPage: React.FC = () => {
  const { currentBusiness, metrics, products, customers, expenses, invoices } = useApp();
  const { language } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `Namaste! Main **Vyaparo AI Vyapar Sahayak** hoon. Main aapke business records ke aadhar par sales, pending udhaar, stock status aur profit ka vishleshan (analysis) kar sakta hoon.\n\nAap mujhse neeche diye gaye sawaal pooch sakte hain ya apna sawaal type karein!`
          : `Hello! I am your **Vyaparo AI Business Assistant**. I have real-time access to your store's verified records: Total Sales (${formatINR(metrics.totalSales)}), Pending Udhaar (${formatINR(metrics.outstandingCredit)}), and Current Inventory.\n\nAsk me anything about your revenue, stock shortages, or customer balances!`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickChips = [
    language === 'hi' ? 'Aaj ki bikri aur invoices kitne hue?' : 'How much did I sell this week?',
    language === 'hi' ? 'Kaunsa stock khatam hone wala hai?' : 'Which products are low in stock?',
    language === 'hi' ? 'Kis customer se udhaar lena baki hai?' : 'Which customers have overdue udhaar?',
    language === 'hi' ? 'Sabse bada kharcha kis cheez mein hua?' : 'What were my largest expense categories?',
    language === 'hi' ? 'Munafa (Gross profit) ka hisaab bataiye' : 'What is my estimated gross profit?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    // Prepare business snapshot context
    const lowStock = products
      .filter((p) => p.currentStock <= p.minStockAlert)
      .map((p) => ({ name: p.name, stock: p.currentStock, minStock: p.minStockAlert }));

    const overdueCusts = customers
      .filter((c) => c.currentBalance > 0)
      .map((c) => ({ name: c.name, balance: c.currentBalance, daysOverdue: c.currentBalance > 1000 ? '7+ days' : 'recent' }));

    const topProds = [...products]
      .sort((a, b) => b.currentStock - a.currentStock)
      .slice(0, 5)
      .map((p) => ({ name: p.name, stock: p.currentStock, price: p.sellingPrice }));

    const payload = {
      message: textToSend.trim(),
      language,
      businessContext: {
        businessName: currentBusiness?.name || 'My Store',
        totalSales: metrics.totalSales,
        totalExpenses: metrics.totalExpenses,
        outstandingCredit: metrics.outstandingCredit,
        estimatedProfit: metrics.estimatedProfit,
        cashCollected: metrics.cashCollected,
        invoiceCount: invoices.length,
        lowStockProducts: lowStock,
        overdueCustomers: overdueCusts,
        topProducts: topProds,
        recentActivity: [
          `Invoices generated: ${invoices.length}`,
          `Active customers: ${customers.length}`,
          `Total catalog items: ${products.length}`,
        ],
      },
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Data processed successfully.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'Gemini 2.5 Flash',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'assistant',
        text: `Unable to connect to AI assistant service. Please check server connectivity.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0B2E26]">AI Business Assistant</h1>
            <span className="bg-[#A7F432] text-[#0B2E26] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#0B2E26]" />
              GEMINI POWERED
            </span>
          </div>
          <p className="text-xs text-[#61736A] mt-1">
            Grounded in your store's verified database. Ask questions in English, Hindi, or Hinglish.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F8F5F] bg-[#E8F9F0] px-3.5 py-1.5 rounded-full border border-[#0F8F5F]/30">
          <ShieldCheck className="w-4 h-4 text-[#0F8F5F]" />
          <span>Grounded in Verified Records</span>
        </div>
      </div>

      {/* Verified Context Snapshot Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-[#DCE9E1] text-xs">
          <span className="text-[#61736A] block text-[11px]">Verified Sales</span>
          <span className="font-extrabold text-[#0B2E26]">{formatINR(metrics.totalSales)}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#DCE9E1] text-xs">
          <span className="text-[#61736A] block text-[11px]">Udhaar Balance</span>
          <span className="font-extrabold text-[#DC2626]">{formatINR(metrics.outstandingCredit)}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#DCE9E1] text-xs">
          <span className="text-[#61736A] block text-[11px]">Recorded Expenses</span>
          <span className="font-extrabold text-[#0B2E26]">{formatINR(metrics.totalExpenses)}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#DCE9E1] text-xs">
          <span className="text-[#61736A] block text-[11px]">Low Stock Shortages</span>
          <span className="font-extrabold text-[#D97706]">{metrics.lowStockCount} items</span>
        </div>
      </div>

      {/* Main Chat Canvas */}
      <div className="bg-white rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-[#0F8F5F] text-white'
                      : 'bg-[#0B2E26] text-[#A7F432]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                    isUser
                      ? 'bg-[#0F8F5F] text-white font-medium rounded-tr-none'
                      : 'bg-[#F8FFF9] text-[#15251F] border border-[#DCE9E1] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">
                    {m.text}
                  </div>
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1 ${
                      isUser ? 'text-white/70' : 'text-[#61736A]'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.model && <span className="font-mono text-[9px] text-[#0F8F5F]">{m.model}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0B2E26] text-[#A7F432] flex items-center justify-center shrink-0 animate-pulse">
                <Brain className="w-4 h-4" />
              </div>
              <div className="bg-[#F8FFF9] border border-[#DCE9E1] p-3.5 rounded-2xl text-xs text-[#61736A] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0F8F5F] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#0F8F5F] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#0F8F5F] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-bold text-[#0B2E26]">Analyzing verified business database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-[#F8FFF9] border-t border-[#DCE9E1] overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#61736A] uppercase shrink-0">Try asking:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="shrink-0 bg-white hover:bg-[#E8F9F0] border border-[#DCE9E1] text-[#0B2E26] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-white border-t border-[#DCE9E1]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'Apne vyapar ke baare mein sawaal poochhein (e.g. Kaunsa stock reorder karna hai?)...'
                  : 'Ask about sales, stock shortages, overdue customers, or profit...'
              }
              className="flex-1 bg-[#F8FFF9] border border-[#DCE9E1] rounded-2xl px-4 py-3 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="bg-[#0F8F5F] hover:bg-[#0B2E26] disabled:opacity-50 text-white p-3 rounded-2xl transition-colors shadow-sm"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
