"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/lib/types";
import { Pencil, Trash2, Download, Search, Filter, Calendar, MessageSquare, CheckCircle, Clock, Phone, X } from "lucide-react";

const statusOptions = [
  { value: "new", label: "New Lead", color: "bg-blue-50 text-blue-600" },
  { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-600" },
  { value: "interested", label: "Interested", color: "bg-purple-50 text-purple-600" },
  { value: "site_visit_scheduled", label: "Site Visit Scheduled", color: "bg-indigo-50 text-indigo-600" },
  { value: "site_visited", label: "Site Visited", color: "bg-cyan-50 text-cyan-600" },
  { value: "negotiation", label: "Negotiation", color: "bg-orange-50 text-orange-600" },
  { value: "closed", label: "Closed", color: "bg-green-50 text-green-600" },
  { value: "rejected", label: "Rejected", color: "bg-red-50 text-red-600" },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  async function load() {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    load();
  }

  async function saveNotes() {
    if (!editing) return;
    await supabase.from("leads").update({ message: notes }).eq("id", editing.id);
    setShowNotes(false);
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Message", "Status", "Date"];
    const rows = leads.map((l) => [l.name, l.email, l.phone, l.message, l.status, new Date(l.created_at!).toLocaleString()]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads.filter((l) => {
    const matchText =
      l.name.toLowerCase().includes(filter.toLowerCase()) ||
      l.email.toLowerCase().includes(filter.toLowerCase()) ||
      l.phone.includes(filter);
    const matchStatus = statusFilter ? l.status === statusFilter : true;
    return matchText && matchStatus;
  });

  const todayLeads = leads.filter((l) => new Date(l.created_at!).toDateString() === new Date().toDateString()).length;
  const pendingFollowups = leads.filter((l) => l.status === "new" || l.status === "contacted").length;
  const convertedLeads = leads.filter((l) => l.status === "closed").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lead CRM</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Today&apos;s Leads</span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{todayLeads}</div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Pending Follow-ups</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingFollowups}</div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Converted Leads</span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={16} className="text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{convertedLeads}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Search leads..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Name</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Contact</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Date</th>
              <th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">{lead.message}</div>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  <div>{lead.phone}</div>
                  <div className="text-xs">{lead.email}</div>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={lead.status || "new"}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`rounded border px-2 py-1 text-xs font-medium ${
                      statusOptions.find((s) => s.value === lead.status)?.color || "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(lead.created_at!).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => { setEditing(lead); setNotes(lead.message || ""); setShowNotes(true); }}
                    className="text-gray-500 hover:text-[#0E6FA3] mr-3"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button onClick={() => remove(lead.id)} className="text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No leads found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showNotes && editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Lead Notes - {editing.name}</h3>
              <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full rounded-lg border px-3 py-2 text-sm mb-4"
              placeholder="Add follow-up notes, remarks, or timeline updates..."
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNotes(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={saveNotes} className="rounded-lg bg-[#0E6FA3] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]">Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
