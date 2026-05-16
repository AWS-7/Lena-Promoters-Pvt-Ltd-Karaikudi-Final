"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const branches = [
  {
    name: "Sivagangai",
    tag: "Main Office",
    address: "No. 12, Ramanathapuram Road, Sivagangai, Tamil Nadu 630561",
    phone: "+91 81487 48140",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    mapUrl: "https://maps.google.com/?q=Sivagangai,Tamil+Nadu",
  },
  {
    name: "Karaikudi",
    tag: "Regional Center",
    address: "45, Sekkalai Road, Karaikudi, Tamil Nadu 630001",
    phone: "+91 81487 48140",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    mapUrl: "https://maps.google.com/?q=Karaikudi,Tamil+Nadu",
  },
  {
    name: "Dubai",
    tag: "International Office",
    address: "Business Bay, Dubai, United Arab Emirates",
    phone: "+91 81487 48140",
    hours: "Sun - Thu: 9:00 AM - 5:00 PM",
    mapUrl: "https://maps.google.com/?q=Business+Bay,Dubai",
  },
];

export default function BranchesSection() {
  return (
    <section id="branches" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#0E6FA3] rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Navigation size={14} />
              Our Presence
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Branches
            </h2>
            <p className="text-gray-500 text-base md:text-lg">
              Serving you across multiple locations with the same commitment to excellence
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {branches.map((branch, index) => (
            <ScrollReveal key={branch.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-[#1195db] to-[#0E6FA3]" />

                <div className="p-6 md:p-8">
                  {/* Icon & Name */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#1195db]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={22} className="text-[#0E6FA3]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0E6FA3] transition-colors">
                        {branch.name}
                      </h3>
                      <span className="inline-block mt-1 text-xs font-medium text-[#0E6FA3] bg-[#1195db]/10 rounded-full px-3 py-0.5">
                        {branch.tag}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0E6FA3] hover:text-[#1195db] transition-colors group/btn"
                  >
                    View on Map
                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
