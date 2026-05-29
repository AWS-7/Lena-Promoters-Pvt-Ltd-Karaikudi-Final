"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FileText, Plus, Search, Trash2, ExternalLink, X, IndianRupee } from "lucide-react";

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
  created_at: string;
};

const emptyForm = {
  invoice_number: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  customer_address: "",
  project_name: "",
  plot_number: "",
  plot_area: "",
  invoice_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  items: [{ description: "", qty: 1, rate: 0 }] as LineItem[],
  tax_rate: 0,
  discount: 0,
  amount_paid: 0,
  payment_mode: "Cash",
  notes: "",
  status: "draft",
};

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

function generateInvoiceNumber() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LP/${yy}${mm}/${rand}`;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setInvoices((data as Invoice[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const subtotal = useMemo(
    () => form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0),
    [form.items]
  );
  const taxAmount = useMemo(() => (subtotal * (Number(form.tax_rate) || 0)) / 100, [subtotal, form.tax_rate]);
  const total = useMemo(() => subtotal + taxAmount - (Number(form.discount) || 0), [subtotal, taxAmount, form.discount]);
  const balance = useMemo(() => total - (Number(form.amount_paid) || 0), [total, form.amount_paid]);

  function openCreate() {
    setForm({ ...emptyForm, invoice_number: generateInvoiceNumber() });
    setError("");
    setShowModal(true);
  }

  function updateItem(i: number, key: keyof LineItem, value: string | number) {
    const items = [...form.items];
    items[i] = { ...items[i], [key]: key === "description" ? value : Number(value) };
    setForm({ ...form, items });
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, { description: "", qty: 1, rate: 0 }] });
  }

  function removeItem(i: number) {
    if (form.items.length === 1) return;
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      invoice_number: form.invoice_number,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      customer_email: form.customer_email || null,
      customer_address: form.customer_address || null,
      project_name: form.project_name || null,
      plot_number: form.plot_number || null,
      plot_area: form.plot_area || null,
      invoice_date: form.invoice_date,
      due_date: form.due_date || null,
      items: form.items,
      subtotal,
      tax_rate: Number(form.tax_rate) || 0,
      tax_amount: taxAmount,
      discount: Number(form.discount) || 0,
      total,
      amount_paid: Number(form.amount_paid) || 0,
      balance,
      payment_mode: form.payment_mode || null,
      notes: form.notes || null,
      status: form.status,
    };
    const { error } = await supabase.from("invoices").insert([payload]);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setShowModal(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this invoice?")) return;
    await supabase.from("invoices").delete().eq("id", id);
    load();
  }

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      !q ||
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.customer_name.toLowerCase().includes(q) ||
      (inv.project_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Generate professional invoices for plot sales & bookings.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border shadow-sm p-3 mb-4 flex items-center gap-2">
        <Search size={16} className="text-gray-400 ml-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number, customer, project..."
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No invoices yet. Click <strong>New Invoice</strong> to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Invoice #</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Customer</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Project / Plot</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Date</th>
                  <th className="text-right font-medium text-gray-500 px-5 py-3">Total</th>
                  <th className="text-right font-medium text-gray-500 px-5 py-3">Balance</th>
                  <th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-[#0E6FA3]">{inv.invoice_number}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{inv.customer_name}</div>
                      <div className="text-xs text-gray-400">{inv.customer_phone}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {inv.project_name || "-"}
                      {inv.plot_number && <span className="text-gray-400 text-xs"> · Plot {inv.plot_number}</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{new Date(inv.invoice_date).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatINR(inv.total)}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          inv.balance <= 0 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {formatINR(inv.balance)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#0E6FA3] hover:underline"
                        >
                          <ExternalLink size={12} /> Open
                        </Link>
                        <button
                          onClick={() => remove(inv.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Delete invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">{error}</div>}

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Invoice Number *">
                  <input className={input} value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} />
                </Field>
                <Field label="Invoice Date *">
                  <input type="date" className={input} value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} />
                </Field>
                <Field label="Customer Name *">
                  <input className={input} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                </Field>
                <Field label="Customer Phone">
                  <input className={input} value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
                </Field>
                <Field label="Customer Email">
                  <input className={input} value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
                </Field>
                <Field label="Due Date">
                  <input type="date" className={input} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </Field>
                <Field label="Customer Address" full>
                  <textarea className={input} rows={2} value={form.customer_address} onChange={(e) => setForm({ ...form, customer_address: e.target.value })} />
                </Field>
                <Field label="Project Name">
                  <input className={input} value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
                </Field>
                <Field label="Plot Number">
                  <input className={input} value={form.plot_number} onChange={(e) => setForm({ ...form, plot_number: e.target.value })} />
                </Field>
                <Field label="Plot Area (sq.ft)">
                  <input className={input} value={form.plot_area} onChange={(e) => setForm({ ...form, plot_area: e.target.value })} />
                </Field>
                <Field label="Payment Mode">
                  <select className={input} value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Card</option>
                  </select>
                </Field>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Line Items</label>
                  <button type="button" onClick={addItem} className="text-xs font-semibold text-[#0E6FA3] hover:underline inline-flex items-center gap-1">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {form.items.map((it, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="Description"
                        className={`${input} col-span-6`}
                        value={it.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        className={`${input} col-span-2`}
                        value={it.qty}
                        onChange={(e) => updateItem(i, "qty", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        className={`${input} col-span-3`}
                        value={it.rate}
                        onChange={(e) => updateItem(i, "rate", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="col-span-1 text-red-400 hover:text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Tax / GST %">
                  <input type="number" className={input} value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })} />
                </Field>
                <Field label="Discount (₹)">
                  <input type="number" className={input} value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
                </Field>
                <Field label="Amount Paid (₹)">
                  <input type="number" className={input} value={form.amount_paid} onChange={(e) => setForm({ ...form, amount_paid: Number(e.target.value) })} />
                </Field>
                <Field label="Status">
                  <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </Field>
                <Field label="Notes" full>
                  <textarea className={input} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </Field>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label={`Tax (${form.tax_rate}%)`} value={formatINR(taxAmount)} />
                <Row label="Discount" value={`- ${formatINR(form.discount || 0)}`} />
                <div className="border-t border-gray-200 my-2" />
                <Row label="Total" value={formatINR(total)} bold />
                <Row label="Amount Paid" value={formatINR(form.amount_paid || 0)} />
                <Row label="Balance Due" value={formatINR(balance)} bold className={balance <= 0 ? "text-green-600" : "text-amber-600"} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.invoice_number || !form.customer_name}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50"
              >
                <IndianRupee size={14} /> {saving ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const input = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]/30 focus:border-[#0E6FA3] bg-white";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, bold, className = "" }: { label: string; value: string; bold?: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-bold text-gray-900" : "text-gray-600"} ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
