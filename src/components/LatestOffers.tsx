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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Duplicate images for seamless loop
  const displayImages = [...images, ...images];

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = reverse ? -2.0 : 2.0; // pixels per frame (reverse goes left) - increased speed

    const loop = (now: number) => {
      if (!isPaused && el) {
        const delta = now - lastTime;
        el.scrollLeft += speed * (delta / 16);

        // Infinite loop: reset when scrolled past half (original set)
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
  }, [isPaused, reverse]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      scroll(diff > 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Scroll buttons - always visible on mobile, hover on desktop */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center transition-opacity hover:bg-[#1195db] hover:text-white md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center transition-opacity hover:bg-[#1195db] hover:text-white md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* Image strip */}
      <div
        ref={scrollRef}
        className={`flex gap-5 overflow-x-scroll scrollbar-hide snap-x snap-mandatory py-2 ${reverse ? "flex-row-reverse" : ""}`}
      >
        {displayImages.map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % images.length) * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] snap-start cursor-pointer"
            onClick={() => setSelectedImage(src)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 group/card">
              <div className="relative aspect-[4/3]">
                <Image
                  src={src}
                  alt={`Offer ${(i % images.length) + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                {/* Hot badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={10} />
                  Hot Deal
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
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
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />

      <div className="container-custom relative">
        {/* Header */}
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

        {/* Row 1 */}
        <div className="mb-6 overflow-x-hidden">
          <ScrollRow images={row1Images} />
        </div>

        {/* Row 2 */}
        <div className="mb-6 overflow-x-hidden">
          <ScrollRow images={row2Images} reverse />
        </div>
      </div>
    </section>
  );
}
