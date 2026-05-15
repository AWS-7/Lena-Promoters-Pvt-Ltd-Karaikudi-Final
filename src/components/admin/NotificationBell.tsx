"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, X, Phone, Calendar, MessageCircle, FileText, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Notification } from "@/lib/types";

const typeIcons: Record<string, any> = {
  lead: Phone,
  site_visit: Calendar,
  contact: MessageCircle,
  whatsapp: MessageCircle,
  project: Briefcase,
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function load() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data);
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          setToast(newNotif);
          setTimeout(() => setToast(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    load();
  }

  async function markAllRead() {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    load();
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-white border border-gray-100 shadow-lg rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-right fade-in duration-300 max-w-sm">
          <div className="w-8 h-8 bg-[#e6f2f9] rounded-lg flex items-center justify-center shrink-0">
            <Bell size={16} className="text-[#0E6FA3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900">{toast.title}</div>
            <div className="text-xs text-gray-500 truncate">{toast.message}</div>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 shrink-0"><X size={14} /></button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold text-sm text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#0E6FA3] hover:underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications yet</div>
            )}
            {notifications.map((n) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                    !n.read ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? "bg-[#e6f2f9]" : "bg-gray-100"}`}>
                    <Icon size={14} className={!n.read ? "text-[#0E6FA3]" : "text-gray-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{n.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{n.message}</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                    </div>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-[#0E6FA3] rounded-full mt-2 shrink-0" />}
                  {n.read && (
                    <button onClick={(e) => { e.stopPropagation(); markRead(n.id); }} className="text-gray-300 hover:text-gray-500 shrink-0 mt-1">
                      <Check size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
