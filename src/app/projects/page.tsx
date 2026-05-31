import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DTCP Approved Land Projects in Karaikudi | Lena Promoters",
  description:
    "Explore DTCP approved residential & commercial land layouts in Karaikudi, Sivaganga, and Chettinad. Premium plots with clear titles, patta, and bank loan support from Lena Promoters.",
  keywords: [
    "DTCP approved projects Karaikudi",
    "land layouts Tamil Nadu",
    "residential plots Karaikudi",
    "commercial plots Sivaganga",
    "Chettinad land projects",
    "premium plots Karaikudi",
    "Lena Nagar Phase 1",
    "Lena Garden",
    "Lena Enclave",
    "Lena City",
    "plot with patta",
    "clear title land",
    "bank loan approved plots",
    "villament plots Karaikudi",
    "land for sale Tamil Nadu",
  ].join(", "),
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/projects",
  },
  openGraph: {
    title: "DTCP Approved Land Projects in Karaikudi | Lena Promoters",
    description:
      "Explore DTCP approved residential & commercial land layouts with clear titles and bank loan support.",
    url: "https://www.lenapromoterspvtltd.com/projects",
    images: ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Our Projects</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Explore our DTCP approved land layouts across Karaikudi and surrounding areas.
            </p>
          </div>
        </section>
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  );
}
