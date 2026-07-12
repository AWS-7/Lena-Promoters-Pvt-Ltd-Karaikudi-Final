"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Lena Group", href: "/lena-group" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Offers", href: "/offers" },
  { label: "Why Us", href: "/why-us" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hasTopHeader = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-[100] bg-white transition-shadow duration-300 top-0 ${
          hasTopHeader ? "md:top-10" : ""
        } ${scrolled ? "shadow-md" : "shadow-sm"}`}
      >
      <div className="container-custom py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-14 h-14">
            <Image src="/images/logo.png" alt="Lena Promoters Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[#0E6FA3] text-lg tracking-tight">LENA PROMOTERS</div>
            <div className="text-xs text-gray-500">Private Limited — Karaikudi</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-[#0E6FA3] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a5480] transition-colors"
          >
            Book Site Visit
          </Link>
        </div>

        <button
          className="lg:hidden p-3 text-gray-700 min-h-[44px] min-w-[44px] tap-target"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile side drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-[#0E6FA3]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-3 text-gray-700 hover:text-[#0E6FA3] min-h-[44px] min-w-[44px] tap-target"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 min-h-[44px] rounded-lg text-base font-medium text-gray-700 hover:text-[#0E6FA3] hover:bg-[#e6f2f9] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#0E6FA3] px-4 py-3 text-sm font-medium text-white hover:bg-[#0a5480] transition-colors"
                >
                  Book Site Visit
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <div className={hasTopHeader ? "h-[72px] md:h-[112px]" : "h-[72px]"} aria-hidden="true" />
    </>
  );
}
