"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-PLGH5S42";
const GA_ID = "G-ZMW2XTPPBD";
const ADS_ID = "AW-18145943083";

let loaded = false;

function loadAnalytics() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];

  // GTM bootstrap
  w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtmScript);

  // gtag (GA4 + Google Ads)
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gtagScript);

  function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
  gtag("config", ADS_ID);
}

/**
 * Loads GTM/GA4/Google Ads only after the first user interaction
 * (or after a 6s fallback), keeping third-party JS off the critical
 * path so it doesn't hurt INP/TBT.
 */
export default function DeferredAnalytics() {
  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const onInteract = () => {
      cleanup();
      loadAnalytics();
    };

    const timer = window.setTimeout(onInteract, 6000);

    const cleanup = () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };

    events.forEach((e) =>
      window.addEventListener(e, onInteract, { once: true, passive: true })
    );

    return cleanup;
  }, []);

  return null;
}
