"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const schemes = [
  { src: "/schemes/scheme-1.jpg", alt: "விதிமுறைகள் மற்றும் நிபந்தனைகள்" },
  { src: "/schemes/scheme-2.jpg", alt: "Lena's Lucky Buyer Scheme" },
  { src: "/schemes/scheme-3.jpg", alt: "வீட்டு மனை சேமிப்பு திட்டம்" },
];

export default function SchemesSection() {
  return (
    <section id="schemes" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4 shadow-sm"
            >
              <Sparkles size={16} />
              Exclusive Schemes
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Special{" "}
              <span className="bg-gradient-to-r from-[#0E6FA3] to-[#1195db] bg-clip-text text-transparent">
                Schemes
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Discover our exclusive offers designed to make your dream of owning a plot a reality
            </p>
          </div>
        </ScrollReveal>

        {/* Image Grid */}
        <div className="grid gap-6 md:gap-8 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={scheme.src}
                    alt={scheme.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-10 md:mt-14 text-center">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0E6FA3] to-[#1195db] text-white px-8 py-3.5 rounded-xl font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-shadow"
            >
              Contact Us For More Details
              <Sparkles size={18} />
            </motion.a>
            <p className="text-gray-500 text-xs md:text-sm mt-4">
              * Terms and conditions apply. Contact us for more details.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
