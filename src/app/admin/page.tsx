"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, MessageSquare, Image, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

const statCards = [
  { label: "Total Projects", icon: Briefcase, color: "bg-blue-50 text-blue-600", key: "projects" },
  { label: "Total Leads", icon: Users, color: "bg-green-50 text-green-600", key: "leads" },
  { label: "Testimonials", icon: MessageSquare, color: "bg-amber-50 text-amber-600", key: "testimonials" },
  { label: "Gallery Images", icon: Image, color: "bg-purple-50 text-purple-600", key: "gallery" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const tables = ["projects", "leads", "testimonials", "gallery", "services", "faq", "partners", "certificates"];
      const counts: Record<string, number> = {};
      for (const table of tables) {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
        counts[table] = count || 0;
      }
      setStats(counts);
    }
    loadStats();

    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentLeads(data);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats[card.key] || 0}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Leads</h2>
            <a href="/admin/leads" className="text-sm text-[#0E6FA3] hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Name</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Phone</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-gray-400">No leads yet</td>
                  </tr>
                )}
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-t">
                    <td className="px-5 py-3 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-5 py-3 text-gray-600">{lead.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        lead.status === "new" ? "bg-blue-50 text-blue-600" :
                        lead.status === "contacted" ? "bg-amber-50 text-amber-600" :
                        "bg-green-50 text-green-600"
                      }`}>
                        {lead.status || "new"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b">
            <h2 className="font-bold text-gray-900">Quick Stats</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Services", value: stats["services"] || 0 },
              { label: "FAQs", value: stats["faq"] || 0 },
              { label: "Partners", value: stats["partners"] || 0 },
              { label: "Certificates", value: stats["certificates"] || 0 },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{s.label}</span>
                <span className="font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="p-5 border-t bg-gray-50 rounded-b-xl">
            <a href="/admin/settings" className="flex items-center gap-2 text-sm text-[#0E6FA3] font-medium hover:underline">
              <TrendingUp size={16} /> Manage Website Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
