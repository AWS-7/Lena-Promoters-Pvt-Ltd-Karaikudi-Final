"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FloatingShapes from "@/components/FloatingShapes";

export default function CTASection() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const phone = settings?.phone || "+91 98765 43210";
  const whatsapp = settings?.whatsapp || "+91 98765 43210";

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <FloatingShapes count={4} color="#ffffff" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6"
          >
            <MapPin size={14} /> Free Site Visit Available
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Book Your Site Visit Today
          </h2>
          <p className="text-lg text-white/90 mb-8">
            See our premium layouts firsthand. Our team will pick you up, explain every detail, and help you choose the perfect plot for your investment.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href={`tel:${phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg bg-white text-[#0E6FA3] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Phone size={18} /> Call Now
            </motion.a>
            <motion.a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition-colors shadow-lg"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
