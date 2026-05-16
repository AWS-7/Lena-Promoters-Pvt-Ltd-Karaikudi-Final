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

  const phone = "+91 81487 48140";

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] md:hidden pb-safe"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.label} href={item.href} prefetch={false}>
              <div
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[52px] ${
                  active
                    ? "bg-[#1195db] text-white shadow-md shadow-[#1195db]/25 scale-105"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Call button */}
        <a href={`tel:${phone.replace(/\s/g, "")}`}>
          <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[52px] text-[#1195db] hover:bg-blue-50">
            <Phone size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium leading-none">Call</span>
          </div>
        </a>
      </div>
    </motion.nav>
  );
}
