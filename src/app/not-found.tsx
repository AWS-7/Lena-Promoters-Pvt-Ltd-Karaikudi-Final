import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for could not be found. Browse DTCP approved plots and services from Lena Promoters in Karaikudi.",
  path: "/404",
  noIndex: true,
});

const helpfulLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/#contact" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <p className="text-[#1195db] font-semibold text-sm uppercase tracking-wider mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you requested does not exist. Explore our DTCP approved plots and real estate services in Karaikudi.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {helpfulLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-full bg-[#0E6FA3] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#0a5480] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
