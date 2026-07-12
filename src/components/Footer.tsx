"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowUp } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { directoryCitations } from "@/lib/seo";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [year, setYear] = useState<number>(2026);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setYear(new Date().getFullYear());
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const phone1 = CONTACT.phonePrimary;
  const phone2 = CONTACT.phoneSecondary;
  const email = CONTACT.email;
  const address = settings?.address || CONTACT.address;
  const workingHours = CONTACT.workingHours;

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Lena Group", href: "/lena-group" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Why Us", href: "/why-us" },
    { label: "Offers", href: "/offers" },
    { label: "Contact", href: "/#contact" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Prevent hydration mismatch - render consistent content on server
  if (!mounted) {
    return (
      <footer className="bg-gray-900 text-gray-300 overflow-hidden">
        <div className="container-custom py-12 md:py-16">
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center text-sm text-gray-500">
              © 2026 Lena Promoters Private Limited. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }

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
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 hover:text-white transition-colors relative">
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "DTCP Approved Plots", href: "/services" },
                { label: "Land Investment", href: "/services" },
                { label: "Documentation", href: "/services" },
                { label: "Bank Loan Assistance", href: "/services" },
                { label: "Registration Support", href: "/services" },
              ].map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="group inline-flex hover:text-white transition-colors relative">
                    <span className="relative">
                      {s.label}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
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
              <div className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5" /> {workingHours}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h4 className="font-bold text-white mb-4 text-center md:text-left">Find Us Online</h4>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
            <a
              href={CONTACT.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Google Business
            </a>
            {directoryCitations.slice(1).map((citation) => (
              <a
                key={citation.name}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {citation.name}
              </a>
            ))}
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href={CONTACT.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              YouTube
            </a>
            <a
              href={CONTACT.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* RERA Disclaimer */}
        <div className="mt-8 mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong className="text-gray-300">RERA Disclaimer:</strong> Projects are registered under applicable RERA regulations.
            All approvals including DTCP / Local Body / Panchayat are subject to government verification.
            Prices, layouts, and availability are subject to change without notice. Buyers are advised to verify
            all documents and approvals independently before purchase.
          </p>
        </div>

        {/* Developer Credit - Simple Style */}
        <div className="mb-6 text-center">
          <p className="text-gray-500 text-sm">
            Developed by <span className="text-gray-400">AWS-Agni Web Solution</span> — <a href="tel:9080700642" className="text-[#1195db] hover:underline">9080700642</a>
          </p>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span>&copy; {year} Lena Promoters Private Limited</span>
            <span className="hidden md:inline text-gray-700">|</span>
            <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <span className="hidden md:inline text-gray-700">|</span>
            <a href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a>
            <span className="hidden md:inline text-gray-700">|</span>
            <a href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a>
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
