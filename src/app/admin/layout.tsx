"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  MessageSquare,
  Image,
  HelpCircle,
  Building2,
  FileCheck,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Home,
  Mail,
  Map,
  Archive,
  ChevronRight,
  Bell,
  Shield,
  AlertTriangle,
} from "lucide-react";
import NotificationBell from "@/components/admin/NotificationBell";
import { supabase } from "@/lib/supabase";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const navGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Leads & CRM",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
      { label: "CRM", href: "/admin/crm", icon: ClipboardList },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Leads", href: "/admin/leads", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Projects", href: "/admin/projects", icon: Briefcase },
      { label: "Layout Map", href: "/admin/layoutmap", icon: Map },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Gallery", href: "/admin/gallery", icon: Image },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
      { label: "Partners", href: "/admin/partners", icon: Building2 },
      { label: "Certificates", href: "/admin/certificates", icon: FileCheck },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Backup", href: "/admin/backup", icon: Archive },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function clearAllStorage() {
  try {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("auth");
    localStorage.removeItem("supabase.auth.token");
    localStorage.removeItem("sb-");
    sessionStorage.clear();
    // Clear all localStorage keys that might contain auth
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.includes("auth") || key.includes("token") || key.includes("session") || key.includes("supabase") || key.includes("sb-"))) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error("Storage clear error:", e);
  }
}

async function logoutServer() {
  try {
    // Sign out from Supabase if using it
    await supabase.auth.signOut();
    // Clear server cookie
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
  } catch (e) {
    console.error("Logout error:", e);
  }
  clearAllStorage();
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Strict logout function
  const forceLogout = useCallback(async () => {
    await logoutServer();
    window.location.href = "/login";
  }, []);

  // Reset idle timer on activity
  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setShowTimeoutWarning(false);

    // Set warning timer (1 min before logout)
    warningTimer.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, INACTIVITY_TIMEOUT - 60 * 1000);

    // Set logout timer
    idleTimer.current = setTimeout(() => {
      forceLogout();
    }, INACTIVITY_TIMEOUT);
  }, [forceLogout]);

  // Activity listeners
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [resetIdleTimer]);

  // Auto-logout when leaving admin (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable async call on page close
      const blob = new Blob([], { type: "application/json" });
      navigator.sendBeacon("/api/admin/logout", blob);
      clearAllStorage();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Validate session on mount
  useEffect(() => {
    async function validateSession() {
      try {
        const res = await fetch("/api/admin/session", { credentials: "include" });
        if (!res.ok) {
          clearAllStorage();
          window.location.href = "/login";
        }
      } catch {
        clearAllStorage();
        window.location.href = "/login";
      }
    }
    validateSession();
  }, []);

  const handleLogout = async () => {
    await forceLogout();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.04)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-5 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-9 h-9 bg-gradient-to-br from-[#0E6FA3] to-[#1195db] rounded-lg flex items-center justify-center shadow-md shadow-[#0E6FA3]/20">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-[15px] leading-tight">Lena Promoters</div>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin Portal</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white shadow-md shadow-[#0E6FA3]/20"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon
                        size={17}
                        className={`shrink-0 transition-colors ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {active && <ChevronRight size={14} className="text-white/70" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 m-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors w-full"
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut size={15} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span className="text-gray-900 font-medium">Admin</span>
            <ChevronRight size={14} />
            <span className="capitalize">{pathname.replace("/admin", "").replace("/", " ").trim() || "Dashboard"}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors relative">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0E6FA3] to-[#1195db] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#0E6FA3]/20">
              A
            </div>
          </div>
        </header>

        {/* Timeout Warning */}
        {showTimeoutWarning && (
          <div className="fixed top-16 left-0 right-0 z-40 lg:left-[260px] flex justify-center pointer-events-none">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-pulse">
              <AlertTriangle size={16} />
              Session expires in 1 minute due to inactivity
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
