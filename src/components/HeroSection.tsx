"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, MapPin, Shield, Award, ChevronRight, Search, Banknote, Building2 } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Parse price string like "8.5 Lakhs" or "12 Lakhs" to number
function parsePrice(priceStr: string): number {
  const match = priceStr.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

// Build budget ranges from project prices
function buildBudgetRanges(prices: number[]): string[] {
  if (prices.length === 0) return ["Any Budget"];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const ranges: string[] = ["Any Budget"];

  // Create sensible ranges
  const step = Math.ceil((max - min) / 3);
  if (step <= 0) {
    ranges.push(`Below ${min} Lakhs`, `${min} Lakhs & Above`);
    return ranges;
  }

  const p1 = Math.ceil(min + step);
  const p2 = Math.ceil(min + step * 2);

  if (min > 0) ranges.push(`Below ${p1} Lakhs`);
  if (p1 < max) ranges.push(`${p1} - ${p2} Lakhs`);
  if (p2 < max) ranges.push(`${p2} Lakhs & Above`);

  return ranges;
}

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Government Approved", value: "government" },
  { label: "Local Body Approved", value: "local" },
  { label: "Ready to Build", value: "ready" },
];

export default function HeroSection() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });

    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .then(({ data }) => {
        if (data) setProjects(data);
      });
  }, []);

  const phone = settings?.phone || "+91 98765 43210";

  // Extract unique locations from projects
  const locations = useMemo(() => {
    const locs = new Set<string>();
    projects.forEach((p) => {
      if (p.location) {
        // Use first part of location (city)
        const city = p.location.split(",")[0].trim();
        if (city) locs.add(city);
      }
    });
    return ["All Locations", ...Array.from(locs).sort()];
  }, [projects]);

  // Build budget ranges from project prices
  const budgetRanges = useMemo(() => {
    const prices = projects.map((p) => parsePrice(p.price)).filter((p) => p > 0);
    return buildBudgetRanges(prices);
  }, [projects]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "All Locations") {
      params.set("location", selectedLocation);
    }
    if (selectedBudget && selectedBudget !== "Any Budget") {
      params.set("budget", selectedBudget);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <section ref={sectionRef} id="home" className="relative text-white overflow-hidden">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 -top-[15%] -bottom-[15%]"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ y: backgroundY }}
      >
        <Image
          src="/hero-bg.png"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
      </motion.div>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container-custom relative flex items-center min-h-[700px] sm:min-h-[780px] md:min-h-[600px] lg:min-h-[700px] py-10 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-4 md:mb-6">
              <Shield size={14} />
              DTCP & RERA Approved Layouts
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-tight mb-4 md:mb-6">
              Premium DTCP Approved  <span className="block text-[#e6f2f9]">Land & Plot Layouts</span>
              in Karaikudi
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
              Trusted land promoter in Tamil Nadu offering clear-title plots, legal assurance, and hassle-free registration at prime locations.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 justify-center md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-[#0E6FA3] px-5 md:px-6 py-2.5 md:py-3 font-semibold hover:bg-gray-100 transition-colors hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                Explore Projects <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 px-5 md:px-6 py-2.5 md:py-3 font-semibold hover:bg-white/20 transition-colors hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                <Phone size={16} className="md:w-[18px] md:h-[18px]" /> Call Now
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 md:gap-6 text-xs sm:text-sm justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#e6f2f9] md:w-[18px] md:h-[18px]" />
                <span>DTCP Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#e6f2f9] md:w-[18px] md:h-[18px]" />
                <span>Prime Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#e6f2f9] md:w-[18px] md:h-[18px]" />
                <span>Legal Clearance</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20"
            >
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
                  Find Your Ideal Plot in Karaikudi
                </h3>
                <p className="text-white/70 text-sm">
                  DTCP Approved | Clear Title | Prime Locations
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Location */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full appearance-none rounded-2xl border-2 border-white/30 bg-white/10 pl-12 pr-12 py-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Budget */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Budget</label>
                  <div className="relative">
                    <Banknote size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full appearance-none rounded-2xl border-2 border-white/30 bg-white/10 pl-12 pr-12 py-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(17, 149, 219, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-[#1195db] to-[#0E6FA3] text-white py-4.5 font-bold text-lg hover:from-[#0E6FA3] hover:to-[#0a5480] transition-all shadow-xl shadow-[#1195db]/30 mt-4"
                >
                  View Available Plots
                  <ChevronRight size={20} />
                </motion.button>
              </div>

              {/* Trust Elements */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                    <Shield size={14} className="text-white" />
                    <span className="text-xs font-medium text-white">DTCP Approved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                    <Award size={14} className="text-white" />
                    <span className="text-xs font-medium text-white">Bank Loan Available</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                    <MapPin size={14} className="text-white" />
                    <span className="text-xs font-medium text-white">Clear Documentation</span>
                  </div>
                </div>
              </div>

              {/* Secondary Link */}
              <div className="mt-4 text-center">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-medium"
                >
                  Explore All Projects
                  <ChevronRight size={14} />
                </a>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
