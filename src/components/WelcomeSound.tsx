"use client";

import { useEffect, useRef } from "react";

export default function WelcomeSound() {
  // Only true when speech ACTUALLY starts (onstart fires).
  // Chrome blocks speak() without a user gesture — speak() returns void
  // and does not throw, so we must NOT trust it as "played".
  const hasStarted = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const playWelcome = () => {
      // Prevent double-play across all paths
      if (hasStarted.current) return;

      const utterance = new SpeechSynthesisUtterance(
        "Welcome to Lena Promoters Private Limited Site."
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.7;

      // Try to set a good English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Microsoft")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      // Only mark as played when audio genuinely begins
      utterance.onstart = () => {
        hasStarted.current = true;
      };

      // If speech fails or ends without starting, allow retry
      utterance.onerror = () => {
        // onerror fires when Chrome blocks autoplay
        // hasStarted stays false so fallback can retry
      };

      utteranceRef.current = utterance;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // --- Path A: Immediate play (works on Edge, Safari, desktop) ---
    const tryImmediate = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        playWelcome();
      }
    };

    window.speechSynthesis.onvoiceschanged = tryImmediate;
    tryImmediate();

    // --- Path B: User-interaction fallback (required for Chrome / Android Chrome) ---
    // Chrome only allows speechSynthesis.speak() inside a user-gesture handler.
    const triggerEvents = ["click", "touchstart", "touchend", "keydown"];
    let interactionTimer: ReturnType<typeof setTimeout> | null = null;

    const onInteraction = () => {
      // Slight delay ensures the gesture is fully registered by Chrome
      if (interactionTimer) clearTimeout(interactionTimer);
      interactionTimer = setTimeout(() => {
        if (!hasStarted.current) {
          playWelcome();
        }
      }, 50);

      // Remove all listeners after first interaction
      triggerEvents.forEach((evt) => {
        window.removeEventListener(evt, onInteraction, { capture: true });
      });
      if (interactionTimer) {
        clearTimeout(interactionTimer);
        interactionTimer = null;
      }
    };

    triggerEvents.forEach((evt) => {
      window.addEventListener(evt, onInteraction, { capture: true, passive: true });
    });

    // --- Path C: Page Visibility fallback ---
    // When user switches back to the tab, try again (they interacted with the OS)
    const onVisibility = () => {
      if (!document.hidden && !hasStarted.current) {
        playWelcome();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
      triggerEvents.forEach((evt) => {
        window.removeEventListener(evt, onInteraction, { capture: true });
      });
      document.removeEventListener("visibilitychange", onVisibility);
      if (interactionTimer) clearTimeout(interactionTimer);
    };
  }, []);

  return null;
}
