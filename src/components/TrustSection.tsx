"use client";

import { motion } from "framer-motion";
import { Award, FileCheck, Shield, Building2, Calendar, Hash, Check } from "lucide-react";

const credentials = [
  {
    icon: Building2,
    label: "Company Registration",
    value: "16.01.2024",
    sublabel: "Registered Under Ministry of Corporate Affairs",
    color: "#1195db",
  },
  {
    icon: Award,
    label: "ISO Certified",
    value: "ISO 9001:2015",
    sublabel: "Quality Management System Standard",
    color: "#059669",
  },
  {
    icon: Shield,
    label: "Scope of Operations",
    value: "Real Estate",
    sublabel: "DTCP & RERA Approved Layouts",
    color: "#d97706",
  },
];

const certDetails = [
  { icon: Hash, label: "Certificate No", value: "IN57483A" },
  { icon: Calendar, label: "Initial Date", value: "07 Aug 2024" },
  { icon: Calendar, label: "Valid Until", value: "06 Aug 2027" },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1195db]/3 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#059669]/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Shield size={14} />
            Trust & Credibility
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
            Certified & Registered Company
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            We operate with full transparency and hold all necessary certifications and registrations.
          </p>
        </motion.div>

        {/* Credential Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {credentials.map((cred, i) => (
            <motion.div
              key={cred.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: i * 0.15,
              }}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-b-full"
                style={{ backgroundColor: cred.color }}
              />

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ backgroundColor: cred.color }}
              >
                <cred.icon size={32} className="text-white" />
              </div>

              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                {cred.label}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-3">
                {cred.value}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {cred.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certificate Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1195db]/10 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            {/* Left - Certificate Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1195db] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
                <Award size={14} />
                ISO 9001:2015 Certified
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Quality Management System Standard
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                This is to Certify that the Management System of{" "}
                <span className="text-white font-bold">LENA PROMOTERS PRIVATE LIMITED</span>{" "}
                has been found to conform to the Quality Management System standard.
              </p>

              {/* Detail Grid */}
              <div className="grid grid-cols-3 gap-4">
                {certDetails.map((detail, i) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10"
                  >
                    <detail.icon size={18} className="text-[#1195db] mb-2" />
                    <div className="text-xs text-gray-400 mb-1">{detail.label}</div>
                    <div className="font-bold text-white text-sm">{detail.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right - Certificate Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                {/* Certificate badge */}
                <div className="w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-8 border-white/10">
                  <Award size={48} className="mb-3" />
                  <div className="text-2xl font-black">ISO</div>
                  <div className="text-sm font-bold">9001:2015</div>
                  <div className="text-xs mt-2 opacity-80">CERTIFIED</div>
                </div>
                {/* Ring decoration */}
                <div className="absolute -inset-4 border-4 border-dashed border-[#f59e0b]/30 rounded-full" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
