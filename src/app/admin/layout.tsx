"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
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
} from "lucide-react";
import NotificationBell from "@/components/admin/NotificationBell";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "CRM", href: "/admin/crm", icon: ClipboardList },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Layout Map", href: "/admin/layoutmap", icon: Map },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Partners", href: "/admin/partners", icon: Building2 },
  { label: "Certificates", href: "/admin/certificates", icon: FileCheck },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Client-side auth check
  useEffect(() => {
    const checkAuth = () => {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_auth="));
      
      const isAuth = authCookie ? authCookie.split("=")[1] === "true" : false;
      setIsAuthenticated(isAuth);
      setLoading(false);
      
      if (!isAuth) {
        router.push("/login");
      }
    };

    // Small delay to allow cookie to be set after login
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <NextImage src="/images/logo.png" alt="Lena Promoters Logo" fill className="object-contain" />
            </div>
            <div className="font-bold text-white text-lg">Admin Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#0E6FA3] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 lg:ml-64 h-screen overflow-y-auto">
        <header className="bg-white border-b sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="text-sm text-gray-500 hidden lg:block">
            Lena Promoters Admin
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
