"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUp, Code } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Footer() {
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

  const phone1 = "+91 81487 48140";
  const phone2 = "+91 81481 48140";
  const email = settings?.email || "info@lenapromoters.com";
  const address = settings?.address || "Karaikudi, Tamil Nadu";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-hidden">
      <div className="container-custom py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-14 h-14">
                <Image src="/images/logo.png" alt="Lena Promoters Logo" fill className="object-contain" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-white text-lg">LENA PROMOTERS</div>
                <div className="text-xs text-gray-400">Private Limited</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu. Trusted by 1200+ happy customers since 2006.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "About", "Projects", "Services", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="group inline-flex items-center gap-1 hover:text-white transition-colors relative">
                    <span className="relative">
                      {link}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {["DTCP Approved Plots", "Land Investment", "Documentation", "Bank Loan Assistance", "Registration Support"].map((s) => (
                <li key={s}>
                  <span className="group inline-flex hover:text-white transition-colors cursor-pointer relative">
                    <span className="relative">
                      {s}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <a href={`tel:${phone1.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> {phone1}
              </a>
              <a href={`tel:${phone2.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> {phone2}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> {email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5" /> {address}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex flex-col gap-1">
            <div>&copy; {new Date().getFullYear()} Lena Promoters Private Limited. All rights reserved.</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Code size={12} /> Developed by AWS-Agni Web Solution — 9080700642
            </div>
          </div>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            Back to top <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowUp size={14} /></motion.span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
