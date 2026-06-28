"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { User, Check, Award, Shield, MapPin } from "lucide-react";
import Image from "next/image";

import { SITE_STATS } from "@/lib/contact";

const features = [
  "DTCP & RERA Approved Layouts",
  "100% Legal Clearance Guarantee",
  "Hassle-free Registration Support",
  "Prime Location Plots",
];

const stats = [
  { value: `${SITE_STATS.yearsExperience}+`, label: "Years Exp" },
  { value: `${SITE_STATS.projectsCompleted}+`, label: "Projects Done" },
  { value: `${SITE_STATS.happyCustomers.toLocaleString()}+`, label: "Happy Customers" },
  { value: `${SITE_STATS.plotsSold.toLocaleString()}+`, label: "Plots Sold" },
];

export default function AboutSection() {
  const [imgError, setImgError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax for decorative shapes
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const circle1Y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const circle2Y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative shapes with parallax */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-[#1195db]/5 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ y: circle1Y }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full translate-y-1/2 -translate-x-1/2"
        style={{ y: circle2Y }}
      />

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
            <Award size={14} />
            About Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
            Building Trust, One Plot at a Time
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="order-2 lg:order-1"
          >
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Lena Promoters Private Limited is a leading real estate company based in Karaikudi, Tamil Nadu. Founded by{" "}
              <strong className="font-bold text-gray-900">C.T. Subaramanian, Founder and Managing Director</strong>, with a
              vision to provide premium DTCP and RERA-approved land layouts, we proudly serve customers with transparency,
              legal clarity, and trusted service.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Lena Promoters Pvt. Ltd. was incorporated on the 16th day of January 2024 under the Companies Act. We are an
              ISO Certified Company with our Head Office in Karaikudi and branches in Karaikudi, Sivaganga, and Dubai.
            </p>

            {/* Feature checklist */}
            <div className="space-y-3 mb-8 sm:mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-[#1195db] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1195db] text-white px-6 py-3 font-semibold hover:bg-[#0E6FA3] transition-colors shadow-lg shadow-[#1195db]/25"
              >
                <MapPin size={18} />
                Explore Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-[#1195db] hover:text-[#1195db] transition-colors"
              >
                <Shield size={18} />
                Book Site Visit
              </a>
            </div>
          </motion.div>

          {/* Image - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="order-1 lg:order-2 relative px-2 sm:px-0"
          >
            {/* Main image with decorative frame */}
            <div className="relative w-full max-w-[50%] mx-auto lg:max-w-[55%]">
              {/* Decorative border frame */}
              <div className="absolute -inset-2 sm:-inset-3 border-2 border-[#1195db]/20 rounded-3xl transform rotate-2" />
              <div className="absolute -inset-2 sm:-inset-3 border-2 border-[#f59e0b]/20 rounded-3xl transform -rotate-2" />

              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1195db] to-[#0a5480]">
                {!imgError ? (
                  <Image
                    src="/images/about.jpg"
                    alt="Lena Promoters"
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <User size={36} className="sm:w-12 sm:h-12" />
                    </div>
                    <p className="text-base sm:text-lg font-semibold">Owner Image</p>
                    <p className="text-xs sm:text-sm opacity-70 mt-1">Add /images/about.jpg</p>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute -bottom-3 sm:-bottom-6 left-2 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-5 border border-gray-100"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#1195db]">{SITE_STATS.yearsExperience}+</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Years Experience</div>
              </motion.div>

              {/* Second floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute -top-2 sm:-top-4 right-2 sm:-right-4 bg-[#f59e0b] text-white rounded-lg sm:rounded-xl shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-sm"
              >
                Trusted Brand
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1195db] mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
