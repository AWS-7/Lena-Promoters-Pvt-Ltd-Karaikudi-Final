"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Enquiry } from "@/lib/types";
import { Phone, MapPin, User, Trash2, Search, Clock, MessageSquare, CheckCircle, Clock as ClockIcon } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  verified: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
};

export default function EnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        const msg = (error as any)?.message || String(error);
        console.error("Error fetching enquiries:", msg, error);
        setError(`Error fetching enquiries: ${msg}. If "row-level security", add an RLS policy for anon read access.`);
      } else {
        setItems(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching enquiries:", err?.message || err);
      setError(`Error fetching enquiries: ${err?.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function askRemove(id: string) {
    setSelectedId(id);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedId) return;
    await supabase.from("enquiries").delete().eq("id", selectedId);
    setDialogOpen(false);
    setSelectedId(null);
    load();
  }

  async function updateStatus(id: string, newStatus: "pending" | "verified") {
    try {
      const { error } = await supabase.from("enquiries").update({ status: newStatus }).eq("id", id);
      if (error) {
        console.error("Error updating status:", error);
        alert("Error updating status. Please check if the status column exists in the database.");
      } else {
        load();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status. Please try again.");
    }
  }

  const filtered = items.filter(
    (e) =>
      e.name.toLowerCase().includes(filter.toLowerCase()) ||
      e.phone.includes(filter) ||
      e.location.toLowerCase().includes(filter.toLowerCase()) ||
      e.source.toLowerCase().includes(filter.toLowerCase())
  );

  function formatSource(source: string) {
    if (source.startsWith("campaign:")) {
      return source.replace("campaign:", "");
    }
    return source.replace(/_/g, " ");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enquiries from website popup and festival campaign landing pages.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
          <MessageSquare size={16} />
          {items.length} Total
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-96 pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading enquiries...
        </div>
      )}

      {/* Table */}
      {!loading && (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Name</th>
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Phone</th>
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Location</th>
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Source</th>
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Status</th>
                <th className="text-left font-semibold text-gray-700 px-4 py-3">Date</th>
                <th className="text-right font-semibold text-gray-700 px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-12">
                    <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                    No enquiries found.
                  </td>
                </tr>
              )}
              {filtered.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#1195db]/10 rounded-full flex items-center justify-center">
                        <User size={14} className="text-[#1195db]" />
                      </div>
                      <span className="font-medium text-gray-900">{enquiry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Phone size={14} className="text-green-500" />
                      {enquiry.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={14} className="text-amber-500" />
                      {enquiry.location || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        enquiry.source.startsWith("campaign:")
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formatSource(enquiry.source)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={enquiry.status || "pending"}
                      onChange={(e) => updateStatus(enquiry.id, e.target.value as "pending" | "verified")}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                        statusColors[enquiry.status || "pending"]
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={14} />
                      {new Date(enquiry.created_at || Date.now()).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => askRemove(enquiry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
      <ConfirmDialog
        open={dialogOpen}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDialogOpen(false); setSelectedId(null); }}
      />
    </div>
  );
}
