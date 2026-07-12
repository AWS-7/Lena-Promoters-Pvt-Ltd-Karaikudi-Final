"use client";

import { useEffect } from "react";
import { scheduleIdleTask } from "@/lib/defer";

function getOrCreateCookieId(): string {
  const COOKIE_NAME = "lp_visitor_id";
  const COOKIE_DAYS = 30;

  // Read existing
  const match = document.cookie.match(new RegExp(`(^|;)\\s*${COOKIE_NAME}\\s*=\\s*([^;]+)`));
  if (match) return match[2];

  // Generate new UUID v4
  const uuid = crypto.randomUUID();
  const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${uuid}; expires=${expires}; path=/; SameSite=Lax`;
  return uuid;
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return "tablet";
    return "mobile";
  }
  if (/iPad|Tablet|Kindle|Silk|PlayBook/i.test(ua)) return "tablet";
  return "desktop";
}

export default function VisitorTracker() {
  useEffect(() => {
    const cancel = scheduleIdleTask(async () => {
      try {
        const cookieId = getOrCreateCookieId();
        const device = detectDevice();
        const page = window.location.pathname + window.location.search;

        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cookieId, device, page }),
          keepalive: true,
        });
      } catch {
        // Silently fail — tracking should never break UX
      }
    }, 4000);

    return cancel;
  }, []);

  return null;
}
