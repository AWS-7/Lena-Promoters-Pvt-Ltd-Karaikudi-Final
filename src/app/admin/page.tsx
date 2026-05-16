"use client";

import { useEffect, useState } from "react";
import {
  Briefcase, Users, MessageSquare, Image, TrendingUp,
  ArrowUpRight, ArrowDownRight, Zap, Calendar, Clock, MoreHorizontal,
  FileText, Globe, Award, ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const statCards = [
  {
    label: "Total Projects",
    icon: Briefcase,
    gradient: "from-[#0E6FA3] to-[#1195db]",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-white/70",
    key: "projects",
    trend: "up",
  },
  {
    label: "Total Leads",
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-white/70",
    key: "leads",
    trend: "up",
  },
  {
    label: "Testimonials",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-500",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-white/70",
    key: "testimonials",
    trend: "up",
  },
  {
    label: "Gallery Images",
    icon: Image,
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-white/70",
    key: "gallery",
    trend: "up",
  },
];

const quickActions = [
  { label: "Add Project", href: "/admin/projects", icon: Briefcase, color: "bg-blue-50 text-[#0E6FA3]" },
  { label: "View Enquiries", href: "/admin/enquiries", icon: FileText, color: "bg-emerald-50 text-emerald-600" },
  { label: "Update Gallery", href: "/admin/gallery", icon: Image, color: "bg-violet-50 text-violet-600" },
  { label: "Site Settings", href: "/admin/settings", icon: Globe, color: "bg-amber-50 text-amber-600" },
  { label: "Certificates", href: "/admin/certificates", icon: Award, color: "bg-rose-50 text-rose-600" },
  { label: "Backup Data", href: "/admin/backup", icon: Zap, color: "bg-cyan-50 text-cyan-600" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const tables = ["projects", "leads", "testimonials", "gallery", "services", "faq", "partners", "certificates", "enquiries"];
      const counts: Record<string, number> = {};
      for (const table of tables) {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
        counts[table] = count || 0;
      }
      setStats(counts);
    }
    loadStats();

    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setRecentLeads(data); });

    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setRecentEnquiries(data); });
  }, []);

  const totalLeads = (stats.leads || 0) + (stats.enquiries || 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
          <div className="text-xs text-gray-400">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.key} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-lg shadow-${card.key === "projects" ? "[#0E6FA3]" : "gray"}-900/10`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${card.subColor}`}>{card.label}</p>
                <p className="text-3xl font-bold mt-2">{stats[card.key] || 0}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                <card.icon size={20} className={card.iconColor} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-white/70">
              <TrendingUp size={12} />
              <span>Updated live</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Recent Leads Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Recent Leads</h2>
                <p className="text-xs text-gray-400 mt-0.5">Latest inquiries from your website</p>
              </div>
              <Link href="/admin/leads" className="text-sm font-medium text-[#0E6FA3] hover:text-[#0a5480] flex items-center gap-1 transition-colors">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-5 py-3">Name</th>
                    <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-5 py-3">Phone</th>
                    <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={24} className="text-gray-300" />
                          No leads yet
                        </div>
                      </td>
                    </tr>
                  )}
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E6FA3] to-[#1195db] flex items-center justify-center text-white font-bold text-xs">
                            {lead.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-gray-900">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{lead.phone}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={lead.status || "new"} />
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Enquiries */}
          {recentEnquiries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">Recent Enquiries</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Popup form submissions</p>
                </div>
                <Link href="/admin/enquiries" className="text-sm font-medium text-[#0E6FA3] hover:text-[#0a5480] flex items-center gap-1 transition-colors">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentEnquiries.map((e) => (
                  <div key={e.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {e.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.phone} {e.location ? "· " + e.location : ""}</p>
                      </div>
                    </div>
                    <StatusBadge status={e.status || "pending"} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-[#0E6FA3] hover:to-[#1195db] transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:bg-white/20 transition-colors`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-white transition-colors text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Content Overview</h2>
            <div className="space-y-3">
              {[
                { label: "Services", value: stats.services || 0, total: 10, color: "bg-emerald-500" },
                { label: "FAQs", value: stats.faq || 0, total: 20, color: "bg-violet-500" },
                { label: "Partners", value: stats.partners || 0, total: 15, color: "bg-amber-500" },
                { label: "Certificates", value: stats.certificates || 0, total: 10, color: "bg-rose-500" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-500">{s.label}</span>
                    <span className="text-sm font-bold text-gray-900">{s.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: `${Math.min((s.value / s.total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Leads Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Total Leads</span>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold">{totalLeads}</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <ArrowUpRight size={12} />
              <span>Combined leads + enquiries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-50 text-blue-600 border-blue-100",
    contacted: "bg-amber-50 text-amber-600 border-amber-100",
    converted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    verified: "bg-green-50 text-green-600 border-green-100",
    closed: "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${styles[status] || styles.new}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "new" ? "bg-blue-500" : status === "verified" || status === "converted" ? "bg-emerald-500" : status === "pending" ? "bg-orange-500" : "bg-gray-400"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
