"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    location: "Chennai",
    rating: 5,
    message: "Excellent service from Lena Promoters. The DTCP approval was genuine and the registration process was smooth. Highly recommended for land buyers.",
  },
  {
    id: "2",
    name: "Lakshmi Narayanan",
    location: "Karaikudi",
    rating: 5,
    message: "I purchased two plots in Lena Nagar. The layout is well planned with proper roads and EB connection. Great investment for my children's future.",
  },
  {
    id: "3",
    name: "Mohammed Farook",
    location: "Madurai",
    rating: 5,
    message: "Professional team with transparent pricing. Site visit was well organized and all my queries were answered. Will definitely recommend to friends.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
        else setTestimonials(fallbackTestimonials);
      });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#1195db] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-white/3 rounded-full" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-14"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4"
          >
            <MessageCircle size={14} />
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mt-2"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/70 mt-4 max-w-2xl mx-auto text-lg"
          >
            Real stories from satisfied customers who trusted Lena Promoters for their land investments.
          </motion.p>
        </motion.div>

        {/* Mobile: horizontal scroll | Desktop: grid */}
        <div className="overflow-x-hidden w-full">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth scrollbar-hide">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: i * 0.15
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl cursor-pointer flex-shrink-0 w-[calc(100vw-3rem)] max-w-[360px] sm:max-w-[400px] md:w-auto snap-start"
              >
              {/* Large quote icon */}
              <motion.div 
                className="absolute -top-4 left-6 w-10 h-10 bg-[#0E6FA3] rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Quote size={18} className="text-white" />
              </motion.div>

              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4 mt-2">
                {Array.from({ length: t.rating }).map((_, r) => (
                  <Star key={r} size={18} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-gray-400 ml-2 font-medium">5.0</span>
              </div>

              {/* Message */}
              <p className="text-gray-600 text-base leading-relaxed mb-6 italic">
                &ldquo;{t.message}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
          ))}
        </div>

        {/* Swipe hint for mobile */}
        <p className="flex md:hidden justify-center text-white/50 text-xs mt-2">
          Swipe to see more reviews
        </p>
      </div>
    </section>
  );
}
