"use client";

import { useEffect, useRef } from "react";

export default function WelcomeSound() {
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const playWelcome = () => {
      if (hasPlayed.current) return;
      hasPlayed.current = true;

      const utterance = new SpeechSynthesisUtterance(
        "Welcome to Lena Promoters Private Limited Site."
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.7;

      // Try to set a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Samantha") ||
          v.name.includes("Female")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // Chrome mobile blocks speech without user interaction.
    // Try immediate play first (works on some browsers).
    // If voices aren't loaded yet, wait for them.
    const tryPlay = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        playWelcome();
      }
    };

    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = tryPlay;
    tryPlay();

    // Fallback: play on first user interaction (required for Chrome mobile)
    const interactionEvents = ["click", "touchstart", "scroll", "keydown"];
    const handleInteraction = () => {
      playWelcome();
      interactionEvents.forEach((e) =>
        window.removeEventListener(e, handleInteraction, { capture: true })
      );
    };

    interactionEvents.forEach((e) =>
      window.addEventListener(e, handleInteraction, { capture: true, once: true })
    );

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
      interactionEvents.forEach((e) =>
        window.removeEventListener(e, handleInteraction, { capture: true })
      );
    };
  }, []);

  return null;
}
