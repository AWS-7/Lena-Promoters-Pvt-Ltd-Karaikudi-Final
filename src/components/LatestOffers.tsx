"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Tag, Sparkles, X } from "lucide-react";
import Image from "next/image";

const row1Images = [
  "/images/offers/1777794800253.jpg",
  "/images/offers/1777794800260.jpg",
  "/images/offers/1777794800276.jpg",
  "/images/offers/1777794800302.jpg",
  "/images/offers/1777794800308.jpg",
  "/images/offers/1777794800322.jpg",
];

const row2Images = [
  "/images/offers/1777794800337.jpg",
  "/images/offers/1777794800351.jpg",
  "/images/offers/1777794800369.jpg",
  "/images/offers/1777794800380.jpg",
  "/images/offers/1777794800389.jpg",
];

function ScrollRow({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [allowAutoScroll, setAllowAutoScroll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const displayImages = [...images, ...images];

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  }, []);

  const pauseAutoScroll = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  }, []);

  const resumeAutoScrollLater = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 3500);
  }, []);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setAllowAutoScroll(!coarse);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isInView || !allowAutoScroll) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = reverse ? -2.0 : 2.0;

    const loop = (now: number) => {
      if (!isPaused && el) {
        const delta = now - lastTime;
        el.scrollLeft += speed * (delta / 16);

        const halfScroll = el.scrollWidth / 2;
        if (reverse) {
          if (el.scrollLeft <= 0) el.scrollLeft = halfScroll;
        } else {
          if (el.scrollLeft >= halfScroll) el.scrollLeft = 0;
        }
      }
      lastTime = now;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, reverse, isInView, allowAutoScroll]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    pauseAutoScroll();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 8 || dy > 8) dragRef.current = true;
  };

  const handlePointerUp = () => {
    resumeAutoScrollLater();
  };

  const handleImageClick = (src: string) => {
    if (!dragRef.current) setSelectedImage(src);
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        setIsPaused(false);
      }}
    >
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center transition-opacity hover:bg-[#1195db] hover:text-white md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center transition-opacity hover:bg-[#1195db] hover:text-white md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 touch-pan-x overscroll-x-contain ${
          reverse ? "flex-row-reverse" : ""
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {displayImages.map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % images.length) * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] snap-start cursor-pointer select-none"
            onClick={() => handleImageClick(src)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 group/card">
              <div className="relative aspect-[4/3]">
                <Image
                  src={src}
                  alt={`Offer ${(i % images.length) + 1}`}
                  fill
                  draggable={false}
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                  <Sparkles size={10} />
                  Hot Deal
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                <Image
                  src={selectedImage}
                  alt="Full size offer image"
                  width={1200}
                  height={900}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LatestOffers() {
  return (
    <section className="py-16 md:py-24 bg-[#1195db] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Tag size={14} />
            Special Deals
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">
            Latest Offers & Deals
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Exclusive offers on premium plots and properties. Grab them before they are gone!
          </p>
        </motion.div>

        <div className="mb-6">
          <ScrollRow images={row1Images} />
        </div>

        <div className="mb-6">
          <ScrollRow images={row2Images} reverse />
        </div>
      </div>
    </section>
  );
}
