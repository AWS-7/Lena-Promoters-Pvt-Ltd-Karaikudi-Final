"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Ruler,
  ShieldCheck,
  ArrowLeft,
  Phone,
  MessageCircle,
  Landmark,
  Building2,
  Home,
  CheckCircle,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { CONTACT, telHref, whatsappHref } from "@/lib/contact";

const categoryMeta = {
  government: {
    icon: Landmark,
    label: "Government Approved",
    subtitle: "DTCP & RERA Approved Layout",
    color: "#1195db",
  },
  local: {
    icon: Building2,
    label: "Local Body Approved",
    subtitle: "Panchayat Approved Layout",
    color: "#059669",
  },
  ready: {
    icon: Home,
    label: "Ready to Build",
    subtitle: "House Project",
    color: "#d97706",
  },
} as const;

export default function ProjectDetailView({ project }: { project: Project }) {
  const category = categoryMeta[project.category || "government"];
  const CategoryIcon = category.icon;
  const siteVisitHref = `/?project=${encodeURIComponent(project.title)}#site-visit`;

  const highlights = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Ruler, label: "Area", value: project.area_size },
    { icon: ShieldCheck, label: "Approval Status", value: project.approval_status },
  ].filter((item) => item.value);

  return (
    <>
      <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-10 md:pt-32 md:pb-14">
        <div className="container-custom">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/15"
            >
              <CategoryIcon size={14} />
              {category.label}
            </span>
            {project.approval_status && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1195db]">
                <CheckCircle size={12} />
                {project.approval_status}
              </span>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-3"
          >
            {project.title}
          </motion.h1>
          <p className="text-white/85 text-lg max-w-3xl">{category.subtitle}</p>
          <p className="text-2xl md:text-3xl font-bold mt-4 text-white">{project.price}</p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1195db] to-[#0a5480] text-white">
                    <div className="text-center">
                      <MapPin size={40} className="mx-auto mb-3 opacity-80" />
                      <p className="font-semibold">{project.title}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description ||
                    `${project.title} is a premium layout by Lena Promoters in ${project.location}. Contact us for full details, site visit, and documentation support.`}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#e6f2f9] flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-[#0E6FA3]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Interested in this project?</h3>
                  <p className="text-sm text-gray-500">
                    Book a free site visit or talk to our team for pricing, documents, and loan assistance.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href={siteVisitHref}
                    className="flex items-center justify-center w-full rounded-lg bg-[#0E6FA3] text-white py-3 font-semibold hover:bg-[#0a5480] transition-colors"
                  >
                    Book a Site Visit
                  </Link>
                  <a
                    href={telHref(CONTACT.phonePrimary)}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-[#0E6FA3] text-[#0E6FA3] py-3 font-semibold hover:bg-[#e6f2f9] transition-colors"
                  >
                    <Phone size={18} />
                    Call Now
                  </a>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                    WhatsApp Us
                  </a>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-900">Category:</span> {category.label}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Price:</span> {project.price}
                  </p>
                  {project.area_size && (
                    <p>
                      <span className="font-medium text-gray-900">Area:</span> {project.area_size}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
