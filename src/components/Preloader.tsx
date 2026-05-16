"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), isMobile ? 800 : 1200);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-gradient-to-br from-[#0E6FA3] via-[#0E6FA3] to-[#0a5480] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Gradient overlay - static on mobile */}
          {(!mounted || isMobile) ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />
          ) : (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]"
            />
          )}

          {/* Floating particles - desktop only */}
          {mounted && !isMobile && [
            { left: 10, top: 15 }, { left: 25, top: 35 }, { left: 65, top: 45 },
            { left: 80, top: 25 }, { left: 15, top: 60 }, { left: 55, top: 55 },
            { left: 75, top: 70 }, { left: 90, top: 50 }
          ].map((pos, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.6, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 1.5 + i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05
              }}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`
              }}
            />
          ))}

          {/* Animated waves - desktop only */}
          {mounted && !isMobile && (
            <>
              <motion.div
                animate={{ x: [0, -100, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent"
              />
              <motion.div
                animate={{ x: [100, 0, 100] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent"
              />
            </>
          )}

          {/* Spinning rings - desktop only */}
          {mounted && !isMobile && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 md:w-72 md:h-72 border border-dashed border-white/15 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 md:w-96 md:h-96 border border-dotted border-white/10 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-64 h-64 md:w-80 md:h-80 bg-white/5 rounded-full blur-2xl"
              />
            </>
          )}

          {/* Pulsing circles - desktop only */}
          {mounted && !isMobile && [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.4, 0, 0.4]
              }}
              transition={{
                duration: 1 + i * 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute w-32 h-32 md:w-44 md:h-44 border-2 border-white/20 rounded-full"
            />
          ))}

          {/* Logo container with glow */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut", delay: 0.1 }}
            className="relative z-10"
          >
            {/* Glow behind logo - simplified on mobile */}
            {(!mounted || isMobile) ? (
              <div className="absolute inset-0 bg-white/15 rounded-full blur-3xl scale-150 -z-10" />
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150 -z-10"
              />
            )}

            {(!mounted || isMobile) ? (
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 mx-auto">
                <div className="absolute inset-0 bg-white rounded-full shadow-2xl" />
                <Image
                  src="/images/logo-main.png"
                  alt="Lena Promoters"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            ) : (
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-32 h-32 md:w-44 md:h-44 mx-auto"
              >
              {/* White background circle behind logo */}
              <div className="absolute inset-0 bg-white rounded-full shadow-2xl" />
                <Image
                  src="/images/logo-main.png"
                  alt="Lena Promoters"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </motion.div>
            )}

            {/* Company name with typewriter-like stagger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center mt-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                className="text-white font-bold text-2xl md:text-3xl tracking-[0.2em] uppercase"
              >
                Lena Promoters
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
                className="w-16 h-0.5 bg-white/50 mx-auto my-3"
              />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase font-light"
              >
                Private Limited
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.3 }}
                className="text-[#e6f2f9]/80 text-xs mt-1 tracking-wider"
              >
                DTCP Approved Plots &bull; Karaikudi
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Animated progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute bottom-20 md:bottom-24 w-56 md:w-72"
          >
            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/30 text-xs text-center mt-4 tracking-[0.2em] uppercase"
            >
              Loading Experience
            </motion.p>
          </motion.div>

          {/* Bottom decorative dots - desktop only */}
          {mounted && !isMobile && (
            <div className="absolute bottom-8 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
