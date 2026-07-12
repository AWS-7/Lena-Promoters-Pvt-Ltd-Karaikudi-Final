"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem("lp_preloader_seen") === "1";

    if (isMobile || prefersReducedMotion || alreadySeen) {
      return;
    }

    sessionStorage.setItem("lp_preloader_seen", "1");
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] animate-[fadeOut_0.35s_ease_0.35s_forwards]"
      aria-hidden="true"
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36">
        <div className="absolute inset-0 rounded-full bg-white shadow-2xl" />
        <Image src="/icon.png" alt="" fill className="object-contain p-4" priority />
      </div>
      <p className="mt-5 text-white font-semibold text-lg tracking-wider">Lena Promoters</p>
    </div>
  );
}
