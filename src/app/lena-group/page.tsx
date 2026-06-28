import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import JourneySection from "@/components/JourneySection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Journey of LENA GROUP | Our Legacy Since 2009",
  description:
    "Explore the growth story of LENA GROUP — from Lena Mobiles in 2009 to Lena Promoters Private Limited, ISO certification, and international expansion in Dubai.",
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/lena-group",
  },
  openGraph: {
    title: "Journey of LENA GROUP | Lena Promoters",
    description:
      "From a small mobile shop to a diversified business conglomerate — discover the LENA GROUP legacy since 2009.",
    url: "https://www.lenapromoterspvtltd.com/lena-group",
    images: ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
  },
};

export default function LenaGroupPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-4">
              Our Legacy Since 2009
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Journey of LENA GROUP</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              From a small mobile shop to a diversified business conglomerate — explore how LENA GROUP grew across Tamil Nadu and beyond.
            </p>
          </div>
        </section>
        <JourneySection showHeader={false} />
      </main>
      <Footer />
    </>
  );
}
