"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-shadow ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container-custom py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-15 h-15">
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
          className="lg:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile side drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-[#0E6FA3]">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-gray-700 hover:text-[#0E6FA3]"
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
                className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0E6FA3] hover:bg-[#e6f2f9] transition-colors"
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
        </div>
      </div>
    </nav>
  );
}
