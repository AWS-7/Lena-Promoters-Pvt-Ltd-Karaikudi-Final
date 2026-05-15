"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Users, Calendar, Phone, MousePointer, CheckCircle, Clock } from "lucide-react";

const COLORS = ["#0E6FA3", "#3b99cc", "#7cc4e8", "#0a5480", "#e6f2f9"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>({});
  const [monthlyLeads, setMonthlyLeads] = useState<any[]>([]);
  const [leadStatusData, setLeadStatusData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Leads", value: stats.leads || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Site Visits", value: stats.site_visit_bookings || 0, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
    { label: "Projects", value: stats.projects || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Follow-ups", value: stats.notifications || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

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
            <div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#e6f2f9] rounded-full flex items-center justify-center">
                <TrendingUp size={14} className="text-[#0E6FA3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{act.title}</div>
                <div className="text-xs text-gray-500 truncate">{act.message}</div>
              </div>
              <div className="text-xs text-gray-400 shrink-0">
                {new Date(act.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
