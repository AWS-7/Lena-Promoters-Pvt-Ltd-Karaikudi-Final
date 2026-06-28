"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Home,
  Landmark,
  Hammer,
  FileText,
  Scale,
  Search,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/types";

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

const serviceCatalog: ServiceCard[] = [
  {
    id: "1",
    title: "Real Estate Consulting",
    description: "Expert advice on property investment and market trends to help you make informed decisions.",
    icon: Building2,
    features: ["Market Analysis", "Investment Strategy", "Property Valuation"],
  },
  {
    id: "2",
    title: "Property Exchange",
    description: "Hassle-free property buying and selling services with transparent pricing and documentation.",
    icon: Home,
    features: ["Buy/Sell Assistance", "Negotiation Support", "Legal Verification"],
  },
  {
    id: "3",
    title: "Bank Loan Assistance",
    description: "Complete support for home and plot loans from leading banks with competitive interest rates.",
    icon: Landmark,
    features: ["Loan Processing", "Documentation", "Bank Tie-ups"],
  },
  {
    id: "4",
    title: "Construction Services",
    description: "End-to-end building and renovation services with quality materials and expert supervision.",
    icon: Hammer,
    features: ["New Construction", "Renovation", "Material Supply"],
  },
  {
    id: "5",
    title: "Documentation Support",
    description: "Legal verification and registration assistance to ensure your property is legally sound.",
    icon: FileText,
    features: ["Title Verification", "Registration", "Legal Compliance"],
  },
  {
    id: "6",
    title: "Legal Advisory",
    description: "Property dispute resolution and legal consultation from experienced property lawyers.",
    icon: Scale,
    features: ["Dispute Resolution", "Legal Consultation", "Court Representation"],
  },
  {
    id: "7",
    title: "Site Investigation",
    description: "Professional land survey and feasibility analysis before property purchase.",
    icon: Search,
    features: ["Land Survey", "Feasibility Study", "Boundary Marking"],
  },
];

const iconByKey: Record<string, LucideIcon> = {
  consulting: Building2,
  exchange: Home,
  loan: Landmark,
  construction: Hammer,
  docs: FileText,
  legal: Scale,
  site: Search,
};

function mergeServices(dbServices: Service[]): ServiceCard[] {
  if (dbServices.length === 0) return serviceCatalog;

  return dbServices.map((service) => {
    const catalogMatch = serviceCatalog.find(
      (item) => item.title.toLowerCase() === service.title.toLowerCase()
    );

    return {
      id: service.id,
      title: service.title,
      description: service.description || catalogMatch?.description || "",
      icon: iconByKey[service.icon] || catalogMatch?.icon || Wrench,
      features: catalogMatch?.features || ["Professional Support", "Trusted Service", "Expert Guidance"],
    };
  });
}

function ServiceCardItem({ service, index }: { service: ServiceCard; index: number }) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="flex-shrink-0 w-[300px] sm:w-[320px] md:w-auto snap-start group"
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1195db]/30 transition-all duration-300 overflow-hidden flex flex-col">
        <div className="h-1.5 bg-gradient-to-r from-[#1195db] to-[#0E6FA3]" />
        <div className="p-6 md:p-7 flex flex-col flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1195db] to-[#0E6FA3] flex items-center justify-center mb-5 shadow-md shadow-[#1195db]/25 group-hover:scale-105 transition-transform">
            <Icon size={28} className="text-white" />
          </div>

          <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">{service.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.description}</p>

          <ul className="space-y-2 mb-6 flex-1">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-[#1195db] shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[#0E6FA3] text-sm font-semibold group-hover:gap-2.5 transition-all"
          >
            Learn more <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceCard[]>(serviceCatalog);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setServices(mergeServices(data));
      });
  }, []);

  const scroll = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 336, behavior: "smooth" });
  }, []);

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-visible">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#1195db]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0E6FA3]/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Wrench size={14} />
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">Our Services</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base md:text-lg">
            Comprehensive real estate services designed to make your property journey smooth, secure, and stress-free.
          </p>
        </motion.div>

        {/* Mobile & tablet: carousel */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous services"
            className="absolute left-0 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0E6FA3] text-white shadow-lg flex items-center justify-center hover:bg-[#0a5480]"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next services"
            className="absolute right-0 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0E6FA3] text-white shadow-lg flex items-center justify-center hover:bg-[#0a5480]"
          >
            <ChevronRight size={22} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-12"
          >
            {services.map((service, i) => (
              <ServiceCardItem key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCardItem key={service.id} service={service} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-[#0E6FA3] text-white px-7 py-3 font-semibold hover:bg-[#0a5480] transition-colors shadow-lg"
          >
            View All Services <ArrowRight size={18} />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0E6FA3] text-[#0E6FA3] px-7 py-3 font-semibold hover:bg-[#e6f2f9] transition-colors"
          >
            Book Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
