"use client";

import { motion } from "framer-motion";
import { MapPin, Shield, Coins, Clock, Landmark, Award, Check, Sparkles } from "lucide-react";
import { SITE_STATS } from "@/lib/contact";

const features = [
  { icon: MapPin, title: "Prime Locations", desc: "Plots in high-growth areas with excellent connectivity and infrastructure." },
  { icon: Shield, title: "Legal Assurance", desc: "100% clear title plots with complete legal verification and documentation." },
  { icon: Coins, title: "Transparent Pricing", desc: "No hidden costs. All prices inclusive with detailed breakup provided." },
  { icon: Clock, title: "Fast Registration", desc: "Quick and hassle-free registration process with dedicated support." },
  { icon: Landmark, title: "Bank Loan Support", desc: "Direct tie-ups with SBI, HDFC, ICICI and other leading banks for plot loans." },
  { icon: Award, title: "Trusted Development", desc: `${SITE_STATS.yearsExperience}+ years of trusted land development with ${SITE_STATS.happyCustomers}+ happy customers.` },
];

export default function WhyChooseUs({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="why-us" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-[#1195db]/5 rounded-full translate-x-1/2" />
      <div className="absolute bottom-20 left-0 w-56 h-56 bg-[#f59e0b]/5 rounded-full -translate-x-1/2" />

      <div className="container-custom relative">
        {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} />
            Why Lena Promoters
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Why Choose Lena Promoters?
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            We are a trusted name in Karaikudi real estate with a commitment to transparency, legal clarity, and customer satisfaction.
          </p>
        </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#1195db]/30 transition-all cursor-default group"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-11 h-11 bg-[#1195db] rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-[#1195db]/20 group-hover:shadow-[#1195db]/40 transition-shadow"
                  >
                    <f.icon size={22} className="text-white" />
                  </motion.div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative lg:sticky lg:top-24"
          >
            <div className="bg-gradient-to-br from-[#1195db] to-[#0a5480] rounded-2xl p-8 md:p-10 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Get a Free Site Visit</h3>
              <p className="text-white/90 mb-6 text-sm leading-relaxed">
                Schedule a complimentary site visit to any of our layouts. Our team will guide you through plot options, amenities, and investment potential.
              </p>
              <ul className="space-y-3 mb-8">
                {["Free pickup and drop", "Expert site explanation", "Legal document overview", "No obligation consultation"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/#site-visit"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-[#1195db] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors shadow-lg w-full justify-center"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
