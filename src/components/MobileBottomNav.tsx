"use client";

import { motion } from "framer-motion";
import { Home, Briefcase, Phone, Wrench, Tag, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Offers", href: "/offers", icon: Tag },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Call", href: "/call", icon: Phone },
];

export default function MobileBottomNav() {
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const phone = settings?.phone || "+91 98765 43210";
  const whatsapp = settings?.whatsapp || "+91 98765 43210";

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] md:hidden pb-safe"
    >
      <div className="flex items-center justify-around px-3 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const href = item.href;

          const content = (
            <div
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px] ${
                isActive ? "bg-[#1195db] text-white shadow-lg shadow-[#1195db]/30 scale-105" : item.label === "Call" ? "text-[#1195db]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </div>
          );

          return (
            <Link key={item.label} href={href} prefetch={false}>
              {content}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
