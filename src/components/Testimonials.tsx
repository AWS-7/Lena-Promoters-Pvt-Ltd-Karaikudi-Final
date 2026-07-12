"use client";

import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

const youtubeReviews = [
  { id: "wNR3mzn5Ptc", url: "https://youtube.com/shorts/wNR3mzn5Ptc", name: "Customer video review 1", subtitle: "Lena Promoters — Karaikudi" },
  { id: "5g5k3P2dkUg", url: "https://youtube.com/shorts/5g5k3P2dkUg", name: "Customer video review 2", subtitle: "Lena Promoters — Karaikudi" },
  { id: "cgJBW5aPX2g", url: "https://youtube.com/shorts/cgJBW5aPX2g", name: "Customer video review 3", subtitle: "Lena Promoters — Karaikudi" },
  { id: "7hONoHNxwjM", url: "https://youtube.com/shorts/7hONoHNxwjM", name: "Customer video review 4", subtitle: "Lena Promoters — Karaikudi" },
  { id: "gJcDZABTKDI", url: "https://youtube.com/shorts/gJcDZABTKDI", name: "Customer video review 5", subtitle: "Lena Promoters — Karaikudi" },
  { id: "sbMLQqsTP3g", url: "https://youtube.com/shorts/sbMLQqsTP3g", name: "Customer video review 6", subtitle: "Lena Promoters — Karaikudi" },
  { id: "cfvsjIQmWEI", url: "https://youtube.com/shorts/cfvsjIQmWEI", name: "Customer video review 7", subtitle: "Lena Promoters — Karaikudi" },
  { id: "g9ti7SihbeU", url: "https://youtube.com/shorts/g9ti7SihbeU", name: "Customer video review 8", subtitle: "Lena Promoters — Karaikudi" },
  { id: "LLyZjVFED2I", url: "https://youtube.com/shorts/LLyZjVFED2I", name: "Customer video review 9", subtitle: "Lena Promoters — Karaikudi" },
  { id: "V0SJCcTUoX8", url: "https://youtube.com/shorts/V0SJCcTUoX8", name: "Customer video review 10", subtitle: "Lena Promoters — Karaikudi" },
];

function thumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function VideoCard({
  video,
  onPlay,
}: {
  video: (typeof youtubeReviews)[0];
  onPlay: () => void;
}) {
  return (
    <div className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[272px] snap-start">
      <div className="bg-white rounded-sm shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <button
          type="button"
          onClick={onPlay}
          className="relative block w-full aspect-[4/3] bg-gray-200 group cursor-pointer"
          aria-label={`Play ${video.name} video review`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl(video.id)}
            alt={video.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 shadow-lg flex items-center justify-center pl-1 group-hover:scale-105 transition-transform">
              <Play size={28} className="text-gray-800 fill-gray-800" />
            </span>
          </div>
        </button>

        <div className="px-4 py-5 text-center bg-white min-h-[88px] flex flex-col items-center justify-center">
          <p className="font-bold text-gray-900 text-base leading-tight">{video.name}</p>
          <p className="text-gray-500 text-sm mt-1.5 leading-snug">{video.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<(typeof youtubeReviews)[0] | null>(null);

  const scroll = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 292, behavior: "smooth" });
  }, []);

  return (
    <>
      <section className="py-14 md:py-20 bg-[#f3f3f3] overflow-hidden">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-12 tracking-tight"
          >
            Testimonials
          </motion.h2>

          <div className="relative px-10 md:px-14">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="absolute left-0 top-[38%] -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-[#0E6FA3] hover:border-[#0E6FA3] transition-colors"
            >
              <ChevronLeft size={22} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="absolute right-0 top-[38%] -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-[#0E6FA3] hover:border-[#0E6FA3] transition-colors"
            >
              <ChevronRight size={22} strokeWidth={2} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
            >
              {youtubeReviews.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={() => setActiveVideo(video)} />
              ))}
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6 md:hidden">Swipe to see more reviews</p>
        </div>
      </section>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Close video"
              >
                <X size={18} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                title={activeVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
