import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd";
import { SITE_URL, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "DTCP Approved Land Projects in Karaikudi | Lena Promoters",
  description:
    "Explore DTCP approved residential & commercial land layouts in Karaikudi, Sivaganga, and Chettinad. Premium plots with clear titles, patta, and bank loan support from Lena Promoters.",
  path: "/projects",
  keywords: [
    "DTCP approved projects Karaikudi",
    "land layouts Tamil Nadu",
    "residential plots Karaikudi",
    "commercial plots Sivaganga",
    "Chettinad land projects",
    "premium plots Karaikudi",
    "plot with patta",
    "clear title land",
    "bank loan approved plots",
    "land for sale Tamil Nadu",
  ],
});

export default function ProjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Projects", url: `${SITE_URL}/projects` },
        ]}
      />
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
