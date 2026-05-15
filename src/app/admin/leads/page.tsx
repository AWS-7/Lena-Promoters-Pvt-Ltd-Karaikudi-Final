"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/lib/types";
import { Trash2, Download } from "lucide-react";

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");

  async function load() {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  }

  async function updateStatus(id: string, status: string) {
    try {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) {
        console.error("Error updating lead status:", error);
        alert("Error updating status. Please try again.");
      } else {
        load();
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      alert("Error updating status. Please try again.");
    }
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Message", "Status", "Date"];
    const rows = items.map((l) => [l.name, l.email, l.phone, l.message, l.status, new Date(l.created_at!).toLocaleString()]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = items.filter((l) =>
    l.name.toLowerCase().includes(filter.toLowerCase()) ||
    l.email.toLowerCase().includes(filter.toLowerCase()) ||
    l.phone.includes(filter)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search leads..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Name</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Email</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Phone</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Date</th>
              <th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-5 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-5 py-3 text-gray-600">{item.email}</td>
                <td className="px-5 py-3 text-gray-600">{item.phone}</td>
                <td className="px-5 py-3">
                  <select
                    value={item.status || "new"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="followup">Follow-up</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">{new Date(item.created_at!).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No leads found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
