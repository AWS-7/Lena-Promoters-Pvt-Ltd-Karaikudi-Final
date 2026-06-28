"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Youtube } from "lucide-react";
import Link from "next/link";

const youtubeReviews = [
  { id: "wNR3mzn5Ptc", url: "https://youtube.com/shorts/wNR3mzn5Ptc" },
  { id: "5g5k3P2dkUg", url: "https://youtube.com/shorts/5g5k3P2dkUg" },
  { id: "cgJBW5aPX2g", url: "https://youtube.com/shorts/cgJBW5aPX2g" },
  { id: "7hONoHNxwjM", url: "https://youtube.com/shorts/7hONoHNxwjM" },
  { id: "gJcDZABTKDI", url: "https://youtube.com/shorts/gJcDZABTKDI" },
  { id: "sbMLQqsTP3g", url: "https://youtube.com/shorts/sbMLQqsTP3g" },
  { id: "cfvsjIQmWEI", url: "https://youtube.com/shorts/cfvsjIQmWEI" },
  { id: "g9ti7SihbeU", url: "https://youtube.com/shorts/g9ti7SihbeU" },
  { id: "LLyZjVFED2I", url: "https://youtube.com/shorts/LLyZjVFED2I" },
  { id: "V0SJCcTUoX8", url: "https://youtube.com/shorts/V0SJCcTUoX8" },
];

function VideoCard({ video, index }: { video: (typeof youtubeReviews)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] snap-start"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-white/20">
        <div className="relative aspect-[9/16] bg-gray-900">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={`Customer video review ${index + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="p-3 flex items-center justify-between gap-2 bg-white">
          <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
            <Play size={12} className="text-[#0E6FA3]" />
            Customer Review
          </span>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0E6FA3] hover:underline whitespace-nowrap"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#1195db] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-white/3 rounded-full" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4"
          >
            <Youtube size={14} />
            Video Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mt-2"
          >
            Real Customer Video Reviews
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/70 mt-4 max-w-2xl mx-auto text-lg"
          >
            Watch genuine feedback from our customers on YouTube — real stories from Lena Promoters plot buyers.
          </motion.p>
        </motion.div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous reviews"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur rounded-full shadow-lg hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0E6FA3] hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next reviews"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur rounded-full shadow-lg hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0E6FA3] hover:text-white"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-1"
          >
            {youtubeReviews.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </div>

        <p className="flex justify-center text-white/50 text-xs mt-5 md:hidden">
          Swipe to watch more video reviews
        </p>

        <div className="text-center mt-10">
          <Link
            href="https://www.youtube.com/@Lena_Promoters"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#0E6FA3] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Youtube size={18} />
            View More on YouTube
          </Link>
        </div>
      </div>
    </section>
  );
}
