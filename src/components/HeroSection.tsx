"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, MapPin, Shield, Award, ChevronRight, Search, Banknote, Building2 } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CONTACT, telHref } from "@/lib/contact";
import { HERO_BG_FALLBACK, resolveHeroBackground } from "@/lib/images";
import { pickReachableImageUrl } from "@/lib/sanitize-images-client";
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
  const [heroContent, setHeroContent] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");
  const [heroBgSrc, setHeroBgSrc] = useState(HERO_BG_FALLBACK);
  const [heroBgFailed, setHeroBgFailed] = useState(false);
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
      .from("homepage_content")
      .select("content")
      .eq("section_key", "hero")
      .single()
      .then(({ data }) => {
        if (data) setHeroContent(data.content);
      });

    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .then(({ data }) => {
        if (data) setProjects(data);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const candidate = resolveHeroBackground(heroContent?.bgImage);
      const resolved = await pickReachableImageUrl(candidate, HERO_BG_FALLBACK);
      if (!cancelled) {
        setHeroBgSrc(resolved);
        setHeroBgFailed(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [heroContent?.bgImage]);

  const phone = CONTACT.phonePrimary;

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
        className="absolute inset-0 -top-[15%] -bottom-[15%] bg-gradient-to-br from-[#0E6FA3] via-[#1195db] to-[#0a5480]"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ y: backgroundY }}
      >
        {!heroBgFailed && (
          <Image
            src={heroBgSrc}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            onError={() => {
              if (heroBgSrc !== HERO_BG_FALLBACK) {
                setHeroBgSrc(HERO_BG_FALLBACK);
                return;
              }
              setHeroBgFailed(true);
            }}
          />
        )}
      </motion.div>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container-custom relative flex items-center min-h-[700px] sm:min-h-[780px] md:min-h-[600px] lg:min-h-[700px] py-10 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:text-center max-w-full"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-4 md:mb-6">
              <Shield size={14} />
              {heroContent?.badge || "DTCP & RERA Approved Layouts"}
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-tight mb-4 md:mb-6">
              {heroContent?.title1 || "Premium DTCP Approved"} <span className="block text-[#e6f2f9]">{heroContent?.title2 || "Land & Plot Layouts"}</span>
              {heroContent?.location || "in Karaikudi"}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
              {heroContent?.subtitle || "Trusted land promoter in Tamil Nadu offering clear-title plots, legal assurance, and hassle-free registration at prime locations."}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 justify-center md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-[#0E6FA3] px-4 sm:px-5 md:px-6 py-2.5 md:py-3 font-semibold hover:bg-gray-100 transition-colors hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                {heroContent?.ctaText || "Explore Projects"} <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a
                href={telHref(phone)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 px-4 sm:px-5 md:px-6 py-2.5 md:py-3 font-semibold hover:bg-white/20 transition-colors hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                <Phone size={16} className="md:w-[18px] md:h-[18px]" /> Call Now
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm justify-center md:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award size={14} className="text-[#e6f2f9] sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                <span>DTCP Approved</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin size={14} className="text-[#e6f2f9] sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                <span>Prime Locations</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield size={14} className="text-[#e6f2f9] sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                <span>Legal Clearance</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-full"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 w-full max-w-full"
            >
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-1.5 sm:mb-2">
                  {heroContent?.formTitle || "Find Your Ideal Plot in Karaikudi"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  {heroContent?.formSubtitle || "DTCP Approved | Clear Title | Prime Locations"}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-3 sm:space-y-4">
                {/* Location */}
                <div className="relative">
                  <label className="block text-[10px] sm:text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5 sm:mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full appearance-none rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/10 pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer hover:bg-white/20 transition-colors [&>option]:text-gray-900 [&>option]:bg-white"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronRight size={16} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Budget */}
                <div className="relative">
                  <label className="block text-[10px] sm:text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5 sm:mb-2">Budget</label>
                  <div className="relative">
                    <Banknote size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full appearance-none rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/10 pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer hover:bg-white/20 transition-colors [&>option]:text-gray-900 [&>option]:bg-white"
                    >
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <ChevronRight size={16} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(17, 149, 219, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1195db] to-[#0E6FA3] text-white py-3 sm:py-4 font-bold text-sm sm:text-lg hover:from-[#0E6FA3] hover:to-[#0a5480] transition-all shadow-xl shadow-[#1195db]/30 mt-2 sm:mt-4"
                >
                  {heroContent?.searchBtn || "View Available Plots"}
                  <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              {/* Trust Elements */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/20">
                    <Shield size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs font-medium text-white">DTCP Approved</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/20">
                    <Award size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs font-medium text-white">Bank Loan</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/20">
                    <MapPin size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs font-medium text-white">Clear Docs</span>
                  </div>
                </div>
              </div>

              {/* Secondary Link */}
              <div className="mt-3 sm:mt-4 text-center">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors font-medium"
                >
                  Explore All Projects
                  <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                </a>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
