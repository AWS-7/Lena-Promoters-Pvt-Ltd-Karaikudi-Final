"use client";

import { CONTACT, telHref } from "@/lib/contact";
import { HERO_BG_FALLBACK, resolveHeroBackground, withImageCacheBuster } from "@/lib/images";
import { scheduleIdleTask } from "@/lib/defer";
import type { Project } from "@/lib/types";
import { Phone, MapPin, Shield, Award, ChevronRight, Banknote } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [heroContent, setHeroContent] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");
  const [heroBgSrc, setHeroBgSrc] = useState(HERO_BG_FALLBACK);
  const [heroBgFailed, setHeroBgFailed] = useState(false);
  const [heroUpdatedAt, setHeroUpdatedAt] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    return scheduleIdleTask(() => {
      fetch("/api/homepage/hero", { next: { revalidate: 60 } })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (payload?.content) {
            setHeroContent(payload.content);
            setHeroUpdatedAt(payload.updated_at ?? null);
          }
        })
        .catch(() => {});

      import("@/lib/supabase").then(({ supabase }) => {
        supabase
          .from("projects")
          .select("id, location, price")
          .eq("featured", true)
          .then(({ data }) => {
            if (data) setProjects(data as Project[]);
          });
      });
    });
  }, []);

  useEffect(() => {
    const resolved = resolveHeroBackground(heroContent?.bgImage);
    setHeroBgSrc(withImageCacheBuster(resolved, heroUpdatedAt));
    setHeroBgFailed(false);
  }, [heroContent?.bgImage, heroUpdatedAt]);

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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E6FA3] via-[#1195db] to-[#0a5480]">
        {!heroBgFailed && (
          <Image
            key={heroBgSrc}
            src={heroBgSrc}
            alt="DTCP approved land layouts in Karaikudi by Lena Promoters"
            fill
            priority
            quality={75}
            sizes="100vw"
            unoptimized={heroBgSrc.startsWith("http") || heroBgSrc.includes("?v=")}
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
      </div>
      <div className="absolute inset-0 bg-black/50" />

      <div className="container-custom relative flex items-center min-h-[560px] sm:min-h-[620px] md:min-h-[600px] lg:min-h-[700px] py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-full">
          <div className="text-center md:text-center max-w-full">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm mb-4 md:mb-6">
              <Shield size={14} />
              {heroContent?.badge || "DTCP & RERA Approved Layouts"}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-tight mb-4 md:mb-6">
              {heroContent?.title1
                ? `${heroContent.title1}${heroContent.title2 ? ` ${heroContent.title2}` : ""}${heroContent.location ? ` ${heroContent.location}` : ""}`
                : "Lena Promoters — DTCP Approved Plots in Karaikudi"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
              {heroContent?.subtitle || "Trusted land promoter in Tamil Nadu offering clear-title plots, legal assurance, and hassle-free registration at prime locations."}
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 justify-center md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#0E6FA3] px-5 md:px-6 py-3 font-semibold hover:bg-gray-100 transition-colors text-base min-h-[44px]"
              >
                {heroContent?.ctaText || "Explore Projects"} <ChevronRight size={16} />
              </a>
              <a
                href={telHref(phone)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 px-5 md:px-6 py-3 font-semibold hover:bg-white/20 transition-colors text-base min-h-[44px]"
              >
                <Phone size={16} /> Call Now
              </a>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-sm justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#e6f2f9]" />
                <span>DTCP Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#e6f2f9]" />
                <span>Prime Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#e6f2f9]" />
                <span>Legal Clearance</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-full">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 w-full max-w-full">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-1.5 sm:mb-2">
                  {heroContent?.formTitle || "Find Your Ideal Plot in Karaikudi"}
                </h2>
                <p className="text-white/70 text-sm">
                  {heroContent?.formSubtitle || "DTCP Approved | Clear Title | Prime Locations"}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full appearance-none rounded-xl border-2 border-white/30 bg-white/10 pl-12 pr-12 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[48px] [&>option]:text-gray-900 [&>option]:bg-white"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Budget</label>
                  <div className="relative">
                    <Banknote size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full appearance-none rounded-xl border-2 border-white/30 bg-white/10 pl-12 pr-12 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[48px] [&>option]:text-gray-900 [&>option]:bg-white"
                    >
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#1195db] to-[#0E6FA3] text-white py-3.5 font-bold text-base hover:from-[#0E6FA3] hover:to-[#0a5480] transition-colors shadow-xl min-h-[48px] mt-2"
                >
                  {heroContent?.searchBtn || "View Available Plots"}
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 text-xs font-medium text-white">
                    <Shield size={14} />
                    DTCP Approved
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 text-xs font-medium text-white">
                    <Award size={14} />
                    Bank Loan
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 text-xs font-medium text-white">
                    <MapPin size={14} />
                    Clear Docs
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-medium min-h-[44px]"
                >
                  Explore All Projects
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
