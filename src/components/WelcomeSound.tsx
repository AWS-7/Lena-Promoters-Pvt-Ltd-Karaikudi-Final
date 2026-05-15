"use client";

import { useEffect } from "react";

export default function WelcomeSound() {
  useEffect(() => {
    // Load voices first
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

    // Play welcome sound immediately on mount
    const playWelcomeSound = () => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("Welcome To Lena Promoters Private Limited  Site");
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Get voices and try to use a pleasant voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes("Google") || 
          voice.name.includes("Microsoft") ||
          voice.name.includes("Samantha")
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Cancel any ongoing speech and speak
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    };

    // Play immediately on mount (before preloader)
    playWelcomeSound();

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return null;
}
