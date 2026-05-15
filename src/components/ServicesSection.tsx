"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/types";

const defaultServices: Service[] = [
  { id: "1", title: "Real Estate Consulting", description: "Expert advice on property investment and market trends", icon: "consulting", order: 1 },
  { id: "2", title: "Property Exchange", description: "Hassle-free property buying and selling services", icon: "exchange", order: 2 },
  { id: "3", title: "Bank Loan Assistance", description: "Complete support for home and plot loans", icon: "loan", order: 3 },
  { id: "4", title: "Construction Services", description: "End-to-end building and renovation services", icon: "construction", order: 4 },
  { id: "5", title: "Documentation Support", description: "Legal verification and registration assistance", icon: "docs", order: 5 },
  { id: "6", title: "Legal Advisory", description: "Property dispute resolution and legal consultation", icon: "legal", order: 6 },
  { id: "7", title: "Site Investigation", description: "Professional land survey and feasibility analysis", icon: "site", order: 7 },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setServices(data);
      });
  }, []);

  const display = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-16 md:py-24 bg-[#1195db] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Our Services</h2>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto">
            End-to-end land and plot solutions with legal assurance and professional support.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {display.map((service, i) => (
            <motion.div
              key={service.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: i * 0.05, type: "spring", stiffness: 300 }}
              className="group bg-white rounded-xl p-6 border-t-4 border-[#f59e0b] shadow-lg hover:shadow-2xl transition-all cursor-default"
            >
              {/* Number badge */}
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  className="w-12 h-12 bg-[#e6f2f9] rounded-lg flex items-center justify-center group-hover:bg-[#1195db] transition-colors"
                >
                  <FileText size={24} className="text-[#0E6FA3] group-hover:text-white transition-colors" />
                </motion.div>
                <span className="text-2xl font-black text-[#0E6FA3]/10 group-hover:text-[#0E6FA3]/20 transition-colors">0{i + 1}</span>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-[#0E6FA3] text-sm font-semibold group-hover:gap-2 transition-all group-hover:text-[#1195db]"
              >
                Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
