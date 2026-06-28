"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Landmark, Building2, Home, Filter, X, Loader2, Ruler, ShieldCheck, Layers } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sanitizeProjectImageUrls } from "@/lib/sanitize-images-client";
import type { Project } from "@/lib/types";
import Link from "next/link";

// Blur placeholder for progressive loading
const blurPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzVCN0A9LjpHQ1xERktVTktcT0tYXE1dWj9aYFRfWmdITVRkWf/2wBDAR";

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

function getStatusLabel(status: string) {
  if (!status) return "Available";
  return status;
}

function ProjectCard({ project, index }: { project: ProjectWithCategory; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const detailRows = [
    { icon: MapPin, text: project.location },
    project.description ? { icon: Layers, text: project.description } : null,
    project.area_size ? { icon: Ruler, text: project.area_size } : null,
    project.approval_status ? { icon: ShieldCheck, text: project.approval_status } : null,
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[];

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-start">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
        <div className="relative h-52 sm:h-56">
          {project.image_url && !imageFailed ? (
            <>
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 340px, 380px"
                className={`object-cover transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                placeholder="blur"
                blurDataURL={blurPlaceholder}
                loading={index < 6 ? "eager" : "lazy"}
                priority={index < 6}
                quality={75}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setImageFailed(true);
                  setIsLoaded(true);
                }}
              />
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1195db] to-[#0a5480]">
                  <Loader2 className="animate-spin text-white/60" size={24} />
                </div>
              )}
            </>
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
          {project.approval_status && (
            <div className="absolute top-0 left-0">
              <span className="inline-block bg-[#1195db] text-white text-xs font-semibold px-4 py-2 rounded-br-lg shadow-sm">
                {getStatusLabel(project.approval_status)}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2">{project.title}</h3>
          <p className="text-[#1195db] font-bold text-base sm:text-lg mb-4">{project.price}</p>

          <ul className="space-y-3 mb-5 flex-1">
            {detailRows.map((row) => (
              <li key={row.text} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <row.icon size={16} className="text-gray-900 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="line-clamp-2">{row.text}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-3">
            <Link
              href={`/?project=${encodeURIComponent(project.title)}#site-visit`}
              className="inline-flex items-center justify-center rounded-md border border-[#0E6FA3] text-[#0E6FA3] px-3 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#e6f2f9] transition-colors text-center"
            >
              Book a site visit
            </Link>
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center justify-center rounded-md bg-[#0E6FA3] text-white px-3 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#0a5480] transition-colors text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectScrollRow({ projects, color }: { projects: ProjectWithCategory[]; color: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 396, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous projects"
        className="absolute left-2 sm:left-4 md:left-6 top-[40%] -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0E6FA3] text-white shadow-[0_4px_24px_rgba(14,111,163,0.55)] ring-4 ring-white flex items-center justify-center hover:bg-[#0a5480] hover:scale-105 transition-all"
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next projects"
        className="absolute right-2 sm:right-4 md:right-6 top-[40%] -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0E6FA3] text-white shadow-[0_4px_24px_rgba(14,111,163,0.55)] ring-4 ring-white flex items-center justify-center hover:bg-[#0a5480] hover:scale-105 transition-all"
      >
        <ChevronRight size={26} strokeWidth={2.5} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-3 pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
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
      const sanitized = await sanitizeProjectImageUrls(uniqueProjects);
      setProjects(sanitized);
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
    <section id="projects" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-visible">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[#1195db]/3 rounded-full -translate-y-1/2" />

      <div className="container-custom relative overflow-visible">
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
                  <div key={j} className="flex-shrink-0 w-[300px] sm:w-[340px] bg-gray-100 rounded-lg h-[520px] animate-pulse" />
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
                    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 px-3 sm:px-6 md:px-10">
                      <ProjectScrollRow projects={catProjects} color={cat.color} />
                    </div>
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
