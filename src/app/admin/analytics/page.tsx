"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Users, Calendar, Phone, MousePointer, CheckCircle, Clock, Eye, Smartphone, Monitor, Tablet, Search, Filter, Trash2, RefreshCw, Download } from "lucide-react";

const COLORS = ["#0E6FA3", "#3b99cc", "#7cc4e8", "#0a5480", "#e6f2f9"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>({});
  const [monthlyLeads, setMonthlyLeads] = useState<any[]>([]);
  const [leadStatusData, setLeadStatusData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Visitor analytics state
  const [visitorStats, setVisitorStats] = useState({ todayVisits: 0, todayUnique: 0, totalAllTime: 0, totalVisits: 0 });
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<any[]>([]);
  const [dailyVisitors, setDailyVisitors] = useState<any[]>([]);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorFilterDate, setVisitorFilterDate] = useState("");
  const [visitorLoading, setVisitorLoading] = useState(false);

  useEffect(() => {
    async function load() {
      // Counts
      const tables = ["leads", "site_visit_bookings", "projects", "testimonials", "notifications"];
      const counts: any = {};
      for (const t of tables) {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        counts[t] = count || 0;
      }
      setStats(counts);

      // Monthly leads (last 6 months)
      const months: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
          month: d.toLocaleString("default", { month: "short" }),
          start: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(),
          end: new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString(),
        });
      }
      const monthly = [];
      for (const m of months) {
        const { count } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", m.start)
          .lt("created_at", m.end);
        monthly.push({ name: m.month, leads: count || 0 });
      }
      setMonthlyLeads(monthly);

      // Lead status breakdown
      const statuses = ["new", "contacted", "interested", "site_visit_scheduled", "site_visited", "negotiation", "closed", "rejected"];
      const statusCounts = [];
      for (const s of statuses) {
        const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", s);
        statusCounts.push({ name: s.replace(/_/g, " "), value: count || 0 });
      }
      setLeadStatusData(statusCounts.filter((s) => s.value > 0));

      // Recent activity
      const { data: activity } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentActivity(activity || []);

      // --- Visitor Analytics ---
      await loadVisitorData();
    }
    load();
  }, []);

  // Auto-refresh visitor logs every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadVisitorData(visitorFilterDate || undefined);
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [visitorFilterDate]);

  async function loadVisitorData(dateFilter?: string) {
    setVisitorLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const filterDate = dateFilter || today;

      // Today's visits (sum of visit_count for today)
      const { data: todayData } = await supabase
        .from("visitor_logs")
        .select("visit_count")
        .eq("visit_date", today);
      const todayVisits = (todayData || []).reduce((s, r) => s + (r.visit_count || 0), 0);
      const todayUnique = (todayData || []).length;

      // Total all-time unique visitors + total visits
      const { data: allData } = await supabase
        .from("visitor_logs")
        .select("visit_count");
      const totalAllTime = (allData || []).length;
      const totalVisits = (allData || []).reduce((s, r) => s + (r.visit_count || 0), 0);

      setVisitorStats({ todayVisits, todayUnique, totalAllTime, totalVisits });

      // Visitor logs (last 100)
      let query = supabase
        .from("visitor_logs")
        .select("*")
        .order("visit_date", { ascending: false })
        .order("last_visit", { ascending: false })
        .limit(100);
      if (dateFilter) {
        query = query.eq("visit_date", dateFilter);
      }
      const { data: logs } = await query;
      setVisitorLogs(logs || []);

      // Device breakdown
      const { data: devices } = await supabase
        .from("visitor_logs")
        .select("device, visit_count");
      const deviceMap: Record<string, number> = {};
      for (const d of devices || []) {
        const key = d.device || "desktop";
        deviceMap[key] = (deviceMap[key] || 0) + (d.visit_count || 0);
      }
      setDeviceBreakdown(
        Object.entries(deviceMap).map(([name, value]) => ({ name, value }))
      );

      // Daily visitors for last 14 days
      const days: any[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ date: d.toISOString().split("T")[0], label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }) });
      }
      const daily = [];
      for (const d of days) {
        const { data: dayData } = await supabase
          .from("visitor_logs")
          .select("visit_count")
          .eq("visit_date", d.date);
        const visits = (dayData || []).reduce((s, r) => s + (r.visit_count || 0), 0);
        const unique = (dayData || []).length;
        daily.push({ name: d.label, visits, unique });
      }
      setDailyVisitors(daily);
    } catch (e) {
      console.error("Visitor data error:", e);
    } finally {
      setVisitorLoading(false);
    }
  }

  const statCards = [
    { label: "Total Leads", value: stats.leads || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Site Visits", value: stats.site_visit_bookings || 0, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
    { label: "Projects", value: stats.projects || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Follow-ups", value: stats.notifications || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

      {/* ===== VISITOR ANALYTICS ===== */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Eye size={20} className="text-[#1195db]" />
          Visitor Analytics
        </h2>

        {/* Visitor Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Visits", value: visitorStats.todayVisits, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Unique Visitors Today", value: visitorStats.todayUnique, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total All-Time Unique", value: visitorStats.totalAllTime, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Total Page Views", value: visitorStats.totalVisits, icon: MousePointer, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg}`}>
                  <card.icon size={18} className={card.color} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Charts: Daily Visitors + Device Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Daily Visitors (Last 14 Days)</h3>
            <div className="h-64">
              {dailyVisitors.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyVisitors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="visits" name="Page Views" fill="#0E6FA3" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unique" name="Unique Visitors" fill="#3b99cc" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-gray-400 py-4 text-center">No visitor data yet</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="h-64">
              {deviceBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-gray-400 py-4 text-center">No device data yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Visitor Logs Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              Visitor Logs
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => loadVisitorData(visitorFilterDate || undefined)}
                disabled={visitorLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} className={visitorLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => {
                  const rows = visitorLogs.map((log: any) => ({
                    "Cookie ID": log.cookie_id || "",
                    "IP Address": log.ip_address || "",
                    "Date": log.visit_date,
                    "Visit Count": log.visit_count,
                    "First Visit": new Date(log.first_visit).toLocaleString(),
                    "Last Visit": new Date(log.last_visit).toLocaleString(),
                    "Device": log.device || "desktop",
                  }));
                  if (rows.length === 0) return;
                  const headers = Object.keys(rows[0]);
                  const csv = [
                    headers.join(","),
                    ...rows.map((r: any) => headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")),
                  ].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `visitor_logs_${new Date().toISOString().split("T")[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                disabled={visitorLogs.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-[#1195db]"
              >
                <Download size={14} />
                Export CSV
              </button>
              <div className="relative">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IP or Cookie ID..."
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1195db] w-48"
                />
              </div>
              <input
                type="date"
                value={visitorFilterDate}
                onChange={(e) => {
                  setVisitorFilterDate(e.target.value);
                  loadVisitorData(e.target.value || undefined);
                }}
                className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1195db]"
              />
              {visitorFilterDate && (
                <button
                  onClick={() => { setVisitorFilterDate(""); loadVisitorData(); }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-4 py-3 text-left font-medium">Cookie ID</th>
                  <th className="px-4 py-3 text-left font-medium">IP Address</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-center font-medium">Visits</th>
                  <th className="px-4 py-3 text-left font-medium">First Visit</th>
                  <th className="px-4 py-3 text-left font-medium">Last Visit</th>
                  <th className="px-4 py-3 text-center font-medium">Device</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitorLoading ? (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-8">Loading...</td></tr>
                ) : visitorLogs.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-8">No visitor logs yet. Data will appear once visitors start arriving.</td></tr>
                ) : (
                  visitorLogs
                    .filter((log) => {
                      if (!visitorSearch) return true;
                      const s = visitorSearch.toLowerCase();
                      return (
                        (log.ip_address || "").toLowerCase().includes(s) ||
                        (log.cookie_id || "").toLowerCase().includes(s)
                      );
                    })
                    .map((log) => (
                      <tr key={log.id} className="border-t hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-[120px] truncate">
                          {log.cookie_id ? log.cookie_id.slice(0, 16) + "..." : "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{log.ip_address || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{log.visit_date}</td>
                        <td className="px-4 py-3 text-center font-semibold text-[#1195db]">{log.visit_count}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.first_visit).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.last_visit).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          {log.device === "mobile" ? <Smartphone size={16} className="text-blue-500 mx-auto" /> :
                           log.device === "tablet" ? <Tablet size={16} className="text-purple-500 mx-auto" /> :
                           <Monitor size={16} className="text-gray-400 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={async () => {
                              await supabase.from("visitor_logs").delete().eq("id", log.id);
                              setVisitorLogs((prev) => prev.filter((l) => l.id !== log.id));
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== EXISTING LEAD ANALYTICS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg}`}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Monthly Leads</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#0E6FA3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Lead Status Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Lead Conversion Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#0E6FA3" strokeWidth={3} dot={{ r: 4, fill: "#0E6FA3" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length === 0 && (
            <div className="text-sm text-gray-400 py-4 text-center">No recent activity</div>
          )}
          {recentActivity.map((act: any) => (
            <div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
              <div className="w-8 h-8 bg-[#e6f2f9] rounded-full flex items-center justify-center">
                <TrendingUp size={14} className="text-[#0E6FA3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{act.title}</div>
                <div className="text-xs text-gray-500 truncate">{act.message}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400 shrink-0">
                  {new Date(act.created_at).toLocaleTimeString()}
                </div>
                <button
                  onClick={async () => {
                    await supabase.from("notifications").delete().eq("id", act.id);
                    setRecentActivity((prev) => prev.filter((a) => a.id !== act.id));
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
