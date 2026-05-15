"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteVisitBooking } from "@/lib/types";
import { Calendar, Clock, CheckCircle, XCircle, MapPin, Phone, Filter } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-600" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<SiteVisitBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  async function load() {
    const { data } = await supabase
      .from("site_visit_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBookings(data);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("site_visit_bookings").update({ status }).eq("id", id);
    load();
  }

  const filtered = statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings;

  const counts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Visit Bookings</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(counts).map(([key, value]) => {
          const cfg = statusConfig[key];
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
              className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-colors ${
                statusFilter === key ? "border-[#0E6FA3] ring-1 ring-[#0E6FA3]" : "hover:border-gray-300"
              }`}
            >
              <div className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cfg.color}`}>{cfg.label}</div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Customer</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Project</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Date & Time</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
              <th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-900">{booking.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone size={12} /> {booking.phone}
                  </div>
                  {booking.email && <div className="text-xs text-gray-400">{booking.email}</div>}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> {booking.project_id || "Any Project"}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> {booking.preferred_date}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-0.5">
                    <Clock size={12} /> {booking.preferred_time}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className={`rounded border px-2 py-1 text-xs font-medium ${
                      statusConfig[booking.status]?.color || "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {Object.entries(statusConfig).map(([value, cfg]) => (
                      <option key={value} value={value}>{cfg.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, "approved")}
                        className="text-green-600 hover:text-green-700 mr-2"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        className="text-red-500 hover:text-red-600"
                        title="Cancel"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
