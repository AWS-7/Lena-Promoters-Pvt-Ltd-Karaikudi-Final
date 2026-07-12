"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileCheck, Gift, ScrollText, Coins, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

const offers = [
  {
    id: "01",
    icon: FileCheck,
    title: "50% Payment Document",
    description: "Pay 50% and get all documents instantly with complete legal verification.",
    highlight: "Instant Docs",
  },
  {
    id: "02",
    icon: Gift,
    title: "Buy One Get One",
    description: "Buy a plot and get another plot absolutely free. Limited time exclusive deal.",
    highlight: "BOGO Offer",
  },
  {
    id: "03",
    icon: ScrollText,
    title: "Document & Patta Free",
    description: "Free legal documentation and patta registration included with every purchase.",
    highlight: "Free Patta",
  },
  {
    id: "04",
    icon: Coins,
    title: "Gold & Silver Coin Free",
    description: "Get complimentary gold and silver coins on every successful booking.",
    highlight: "Free Gold",
  },
];

function OfferCard({ offer }: { offer: typeof offers[0] }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 border-2 border-[#f59e0b]/30 shadow-lg hover:shadow-xl hover:border-[#f59e0b]/60 transition-all group flex-shrink-0 w-[280px] snap-start">
      {/* Highlight badge */}
      <div className="absolute -top-3 left-4 bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        {offer.highlight}
      </div>

      {/* Number */}
      <div className="absolute top-4 right-4 text-4xl font-black text-[#f59e0b]/10">
        {offer.id}
      </div>

      <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center mb-5 shadow-md">
        <offer.icon size={28} className="text-white" />
      </div>

      <h3 className="font-bold text-gray-900 text-lg mb-2">{offer.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {offer.description}
      </p>
    </div>
  );
}

export default function OffersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto scroll on mobile — only while section is visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isInView) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = 2.0;

    const loop = (now: number) => {
      if (!isPaused && el) {
        const delta = now - lastTime;
        el.scrollLeft += speed * (delta / 16);

        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      lastTime = now;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, isInView]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#1195db] relative overflow-hidden">
      {/* Decorative sparkles */}
      <div className="absolute top-6 left-6 text-[#f59e0b]/20">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-6 right-6 text-[#f59e0b]/20">
        <Sparkles size={48} />
      </div>

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-[#f59e0b] text-white font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} />
            Limited Time Deals
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Our General Offers
          </h2>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">
            Exclusive deals and benefits when you book a plot with Lena Promoters.
          </p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-white text-[#0E6FA3] px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            View All Festival Offers <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Mobile: Horizontal scrolling with auto-scroll */}
        <div
          className="md:hidden relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        >
          {/* Scroll buttons */}
          <button
            onClick={() => scroll(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-scroll scrollbar-hide snap-x snap-mandatory py-2 px-1"
          >
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl p-6 border-2 border-[#f59e0b]/30 shadow-lg hover:shadow-xl hover:border-[#f59e0b]/60 transition-all group"
            >
              {/* Highlight badge */}
              <div className="absolute -top-3 left-4 bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {offer.highlight}
              </div>

              {/* Number */}
              <div className="absolute top-4 right-4 text-4xl font-black text-[#f59e0b]/10">
                {offer.id}
              </div>

              <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center mb-5 shadow-md">
                <offer.icon size={28} className="text-white" />
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{offer.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {offer.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
