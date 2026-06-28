import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Why Choose Lena Promoters | Trusted DTCP Plot Developer in Karaikudi",
  description:
    "Discover why 1200+ customers trust Lena Promoters — prime locations, legal assurance, transparent pricing, bank loan support, and hassle-free registration in Karaikudi.",
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/why-us",
  },
  openGraph: {
    title: "Why Choose Lena Promoters | Karaikudi Real Estate",
    description:
      "Prime DTCP approved plots, clear titles, transparent pricing, and dedicated customer support from Lena Promoters.",
    url: "https://www.lenapromoterspvtltd.com/why-us",
    images: ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
  },
};

export default function WhyUsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-4">
              Why Lena Promoters
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Why Choose Us?</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Trusted land promoter in Karaikudi with transparency, legal clarity, and customer-first service at every step.
            </p>
          </div>
        </section>
        <WhyChooseUs showHeader={false} />
      </main>
      <Footer />
    </>
  );
}
