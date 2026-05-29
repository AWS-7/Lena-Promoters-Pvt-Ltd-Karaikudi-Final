"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Printer, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

type LineItem = { description: string; qty: number; rate: number };

type Invoice = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;
  project_name: string | null;
  plot_number: string | null;
  plot_area: string | null;
  invoice_date: string;
  due_date: string | null;
  items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  amount_paid: number;
  balance: number;
  payment_mode: string | null;
  notes: string | null;
  status: string;
};

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

function numberToWordsIndian(num: number): string {
  if (!num || num <= 0) return "Zero Rupees Only";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
  };
  return inWords(Math.round(num)) + " Rupees Only";
}

export default function InvoiceViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("invoices").select("*").eq("id", id).single();
      if (data) setInvoice(data as Invoice);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!invoice) return <div className="p-12 text-center text-gray-500">Invoice not found.</div>;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Dancing+Script:wght@600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-paper { box-shadow: none !important; margin: 0 !important; }
        }
        .invoice-paper {
          background:
            radial-gradient(circle at 20% 10%, rgba(14,111,163,0.04), transparent 40%),
            radial-gradient(circle at 80% 90%, rgba(245,158,11,0.04), transparent 40%),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.012) 0, rgba(0,0,0,0.012) 1px, transparent 1px, transparent 4px),
            #fdfcf8;
        }
        .signature-font { font-family: 'Caveat', cursive; }
        .seal-font { font-family: 'Playfair Display', serif; }
        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0.05;
          font-size: 140px;
          font-weight: 900;
          color: #0E6FA3;
          transform: rotate(-25deg);
          letter-spacing: 8px;
          font-family: 'Playfair Display', serif;
        }
        .seal {
          width: 130px;
          height: 130px;
          border: 3px double #0E6FA3;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #0E6FA3;
          transform: rotate(-8deg);
          opacity: 0.85;
          position: relative;
        }
        .seal::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid #0E6FA3;
          border-radius: 50%;
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        {/* Action bar */}
        <div className="no-print max-w-4xl mx-auto mb-4 flex items-center justify-between">
          <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to Invoices
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg"
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              <Download size={14} /> Save as PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper */}
        <div className="invoice-paper relative max-w-4xl mx-auto shadow-2xl rounded-md overflow-hidden">
          <div className="watermark">LENA</div>

          {/* Top Letterhead Band */}
          <div className="relative bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
                {/* Building icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black tracking-wide seal-font">LENA PROMOTERS</div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/80">Private Limited · Karaikudi</div>
              </div>
            </div>
            <div className="text-right text-xs leading-relaxed">
              <div>📍 Karaikudi, Tamil Nadu</div>
              <div>📞 +91 98765 43210</div>
              <div>✉ info@lenapromoterspvtltd.com</div>
              <div>🌐 lenapromoterspvtltd.com</div>
            </div>
          </div>

          {/* Bilingual Heading */}
          <div className="relative px-10 pt-8 pb-2 flex items-end justify-between border-b-2 border-dashed border-gray-300">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-gray-400">விலைப்பட்டியல் / Invoice</div>
              <div className="seal-font text-4xl font-black text-gray-800 mt-1">INVOICE</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Invoice No.</div>
              <div className="font-mono text-lg font-bold text-[#0E6FA3]">{invoice.invoice_number}</div>
              <div className="text-xs text-gray-500 mt-2">Date: {new Date(invoice.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
              {invoice.due_date && (
                <div className="text-xs text-gray-500">Due: {new Date(invoice.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
              )}
            </div>
          </div>

          {/* Bill To + Plot Details */}
          <div className="relative px-10 py-6 grid grid-cols-2 gap-8 border-b border-gray-200">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Billed To / பெறுநர்</div>
              <div className="font-bold text-gray-900 text-lg">{invoice.customer_name}</div>
              {invoice.customer_phone && <div className="text-sm text-gray-600">📱 {invoice.customer_phone}</div>}
              {invoice.customer_email && <div className="text-sm text-gray-600">✉ {invoice.customer_email}</div>}
              {invoice.customer_address && <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">{invoice.customer_address}</div>}
            </div>
            {(invoice.project_name || invoice.plot_number) && (
              <div>
                <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Property Details / மனை விவரம்</div>
                {invoice.project_name && (
                  <div className="text-sm text-gray-700"><span className="text-gray-400">Project:</span> <span className="font-semibold">{invoice.project_name}</span></div>
                )}
                {invoice.plot_number && (
                  <div className="text-sm text-gray-700"><span className="text-gray-400">Plot No:</span> <span className="font-semibold">{invoice.plot_number}</span></div>
                )}
                {invoice.plot_area && (
                  <div className="text-sm text-gray-700"><span className="text-gray-400">Area:</span> <span className="font-semibold">{invoice.plot_area} sq.ft</span></div>
                )}
                {invoice.payment_mode && (
                  <div className="text-sm text-gray-700"><span className="text-gray-400">Payment:</span> <span className="font-semibold">{invoice.payment_mode}</span></div>
                )}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="relative px-10 py-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0E6FA3]/5 text-[#0E6FA3]">
                  <th className="text-left py-3 px-3 text-[11px] font-bold uppercase tracking-wider w-10">#</th>
                  <th className="text-left py-3 px-3 text-[11px] font-bold uppercase tracking-wider">Description / விவரம்</th>
                  <th className="text-right py-3 px-3 text-[11px] font-bold uppercase tracking-wider">Qty</th>
                  <th className="text-right py-3 px-3 text-[11px] font-bold uppercase tracking-wider">Rate</th>
                  <th className="text-right py-3 px-3 text-[11px] font-bold uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it, i) => (
                  <tr key={i} className="border-b border-dotted border-gray-300">
                    <td className="py-3 px-3 text-gray-500">{i + 1}.</td>
                    <td className="py-3 px-3 text-gray-800">{it.description}</td>
                    <td className="py-3 px-3 text-right text-gray-700">{it.qty}</td>
                    <td className="py-3 px-3 text-right text-gray-700">{formatINR(it.rate)}</td>
                    <td className="py-3 px-3 text-right font-semibold text-gray-900">{formatINR(it.qty * it.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals + Amount in words */}
          <div className="relative px-10 pb-6 grid grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Amount in Words / தொகை எழுத்தில்</div>
              <div className="signature-font text-xl text-gray-800 leading-tight">{numberToWordsIndian(invoice.total)}</div>

              {invoice.notes && (
                <div className="mt-5">
                  <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Notes</div>
                  <div className="text-sm text-gray-600 italic whitespace-pre-line">{invoice.notes}</div>
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatINR(invoice.subtotal)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>GST ({invoice.tax_rate}%)</span>
                  <span>{formatINR(invoice.tax_amount)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>- {formatINR(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-bold text-lg border-t-2 border-gray-800 pt-2 mt-2">
                <span>Total</span>
                <span>{formatINR(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Amount Paid</span>
                <span>{formatINR(invoice.amount_paid)}</span>
              </div>
              <div
                className={`flex justify-between font-bold text-base px-3 py-2 rounded ${
                  invoice.balance <= 0 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                <span>Balance Due</span>
                <span>{formatINR(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {/* Signature row */}
          <div className="relative px-10 pt-6 pb-10 grid grid-cols-3 gap-6 items-end border-t border-dashed border-gray-300">
            <div>
              <div className="signature-font text-2xl text-gray-700 leading-none">Thank you!</div>
              <div className="text-xs text-gray-500 mt-1">For your trust in Lena Promoters.</div>
              <div className="text-[10px] text-gray-400 mt-3 italic">
                * Subject to Karaikudi jurisdiction. E&OE.
              </div>
            </div>

            <div className="flex justify-center">
              <div className="seal seal-font">
                <div className="text-[10px] tracking-widest font-bold">LENA PROMOTERS</div>
                <div className="text-[8px] my-1">★ ★ ★</div>
                <div className="text-[9px] font-bold">PVT LTD</div>
                <div className="text-[7px] mt-1">KARAIKUDI</div>
                <div className="text-[10px] mt-1 font-bold">PAID</div>
              </div>
            </div>

            <div className="text-right">
              <div className="signature-font text-3xl text-[#0E6FA3] leading-none mb-1" style={{ transform: "rotate(-3deg)", transformOrigin: "right" }}>
                R. Lena
              </div>
              <div className="border-t border-gray-400 pt-1 text-xs text-gray-600 font-semibold">Authorized Signatory</div>
              <div className="text-[10px] text-gray-400">Lena Promoters Pvt Ltd</div>
            </div>
          </div>

          {/* Footer band */}
          <div className="relative bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white text-center text-[10px] py-2 tracking-widest uppercase">
            This is a computer-generated invoice · Verified & Signed
          </div>
        </div>
      </div>
    </>
  );
}
