"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Landmark, Building2, Home, Filter, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import Link from "next/link";

type Category = "government" | "local" | "ready";

interface ProjectWithCategory extends Project {
  category: Category;
}

// No fallback projects — only admin-added projects from Supabase are shown

const categories: { key: Category; icon: typeof Landmark; label: string; subtitle: string; color: string }[] = [
  { key: "government", icon: Landmark, label: "GOVERNMENT APPROVED", subtitle: "DTCP & RERA Approved Layouts", color: "#1195db" },
  { key: "local", icon: Building2, label: "LOCAL BODY APPROVED", subtitle: "Panchayat Approved Layouts", color: "#059669" },
  { key: "ready", icon: Home, label: "READY TO BUILD", subtitle: "House Projects", color: "#d97706" },
];

function ProjectCard({ project }: { project: ProjectWithCategory }) {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] snap-start">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group h-full">
        <div className="relative h-48">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1195db] to-[#0a5480] flex items-center justify-center">
              <div className="text-center text-white p-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin size={28} />
                </div>
                <div className="font-bold text-base">{project.title}</div>
                <div className="text-xs opacity-90">{project.location}</div>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <CheckCircle size={12} /> {project.approval_status}
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <MapPin size={12} /> {project.location}
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2">{project.title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex items-center justify-between text-sm mb-5">
            <div>
              <span className="text-xs text-gray-400">Price</span>
              <div className="font-bold text-[#1195db]">{project.price}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Area</span>
              <div className="font-bold text-gray-700">{project.area_size}</div>
            </div>
          </div>
          <a
            href="#contact"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#1195db] text-white py-2.5 text-sm font-medium hover:bg-[#0E6FA3] transition-colors group-hover:gap-3"
          >
            Enquire Now <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectScrollRow({ projects, color }: { projects: ProjectWithCategory[]; color: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Only duplicate for seamless loop when 3+ projects to avoid visual duplicates
  const shouldDuplicate = projects.length >= 3;
  const displayProjects = shouldDuplicate ? [...projects, ...projects] : projects;

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    const el = scrollRef.current;
    const shouldDup = projects.length >= 3;
    if (!el || projects.length <= 1 || !shouldDup) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = 0.5; // pixels per frame

    const loop = (now: number) => {
      if (!isPaused && el) {
        const delta = now - lastTime;
        el.scrollLeft += speed * (delta / 16);

        // Infinite loop: reset when scrolled past half (original set)
        const halfScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= halfScroll) el.scrollLeft = 0;
      }
      lastTime = now;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, projects.length]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Scroll buttons */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1195db] hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1195db] hover:text-white"
      >
        <ChevronRight size={20} />
      </button>

      {/* Horizontal scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
        style={{ scrollBehavior: "auto" }}
      >
        {displayProjects.map((project, i) => (
          <ProjectCard key={`${project.id}-${i}`} project={project} />
        ))}
      </div>
    </div>
  );
}

function parsePriceVal(priceStr: string): number {
  const match = priceStr.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function matchesBudget(priceStr: string, budgetFilter: string): boolean {
  const price = parsePriceVal(priceStr);
  if (budgetFilter.startsWith("Below ")) {
    const max = parsePriceVal(budgetFilter);
    return price > 0 && price < max;
  }
  if (budgetFilter.includes(" - ")) {
    const [minS, maxS] = budgetFilter.replace(" Lakhs", "").split(" - ");
    const min = parseFloat(minS);
    const max = parseFloat(maxS);
    return price >= min && price <= max;
  }
  if (budgetFilter.includes("& Above")) {
    const min = parsePriceVal(budgetFilter);
    return price >= min;
  }
  return true;
}

function FeaturedProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const locFilter = searchParams.get("location") || "";
  const budgetFilter = searchParams.get("budget") || "";
  const typeFilter = searchParams.get("type") || "";
  const hasFilters = locFilter || budgetFilter || typeFilter;

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      // Deduplicate by id
      const uniqueProjects = data?.filter((project, index, self) =>
        index === self.findIndex((p) => p.id === project.id)
      ) || [];
      setProjects(uniqueProjects);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const rawProjects: ProjectWithCategory[] = projects.map((p) => ({
    ...p,
    category: (p.category || "government") as Category,
  }));

  // Apply URL search filters
  const displayProjects = rawProjects.filter((p) => {
    if (locFilter && !p.location.toLowerCase().includes(locFilter.toLowerCase())) return false;
    if (budgetFilter && !matchesBudget(p.price, budgetFilter)) return false;
    if (typeFilter && p.category !== typeFilter) return false;
    return true;
  });

  const getProjectsByCategory = (cat: Category) => displayProjects.filter((p) => p.category === cat);

  return (
    <section id="projects" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[#1195db]/3 rounded-full -translate-y-1/2" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Landmark size={14} />
            Our Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">Our Premium Projects</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Discover approved layouts and premium plots in prime locations across Karaikudi and surrounding areas.
          </p>

          {/* Active Filters */}
          {hasFilters && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="flex items-center gap-1 text-sm text-gray-500 mr-1">
                <Filter size={14} /> Filters:
              </span>
              {locFilter && (
                <span className="inline-flex items-center gap-1 bg-[#1195db]/10 text-[#1195db] text-xs font-medium px-3 py-1.5 rounded-full">
                  <MapPin size={12} /> {locFilter}
                </span>
              )}
              {budgetFilter && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {budgetFilter}
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                  {typeFilter === "government" ? "Government Approved" : typeFilter === "local" ? "Local Body Approved" : "Ready to Build"}
                </span>
              )}
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors ml-1"
              >
                <X size={12} /> Clear all
              </Link>
            </div>
          )}

          {/* No results */}
          {hasFilters && displayProjects.length === 0 && (
            <div className="mt-8 p-8 bg-gray-50 rounded-2xl text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search filters to see more results.</p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1195db] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0E6FA3] transition-colors"
              >
                <X size={14} /> Clear Filters
              </Link>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-12 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 sm:gap-6 overflow-hidden">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex-shrink-0 w-[260px] sm:w-[300px] bg-gray-100 rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Landmark size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Projects will appear here once added from the admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((cat) => {
              const catProjects = getProjectsByCategory(cat.key);

              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <cat.icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{cat.label}</h3>
                      <p className="text-gray-500 text-sm">{cat.subtitle}</p>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 ml-4" />
                  </div>

                  {/* Horizontal Scrolling Row */}
                  {catProjects.length > 0 ? (
                    <ProjectScrollRow projects={catProjects} color={cat.color} />
                  ) : (
                    <div className="p-8 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">No projects in this category yet.</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function FeaturedProjects() {
  return (
    <Suspense fallback={<div className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>}>
      <FeaturedProjectsContent />
    </Suspense>
  );
}
