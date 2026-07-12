import type { Metadata } from "next";
import dynamic from "next/dynamic";
import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ScrollReveal from "@/components/ScrollReveal";
import { FaqJsonLd } from "@/components/SeoJsonLd";
import { buildPageMetadata, homepageFaqs, localKeywords } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "DTCP Approved Plots in Karaikudi, Tamil Nadu | Buy Land with Clear Title",
  description:
    "Buy DTCP approved residential & commercial plots in Karaikudi, Tamil Nadu from Lena Promoters. 18+ years experience, 1200+ happy customers, clear legal titles, bank loan assistance & free site visit.",
  path: "/",
  keywords: localKeywords,
});

const AboutSection = dynamic(() => import("@/components/AboutSection"));
const TrustSection = dynamic(() => import("@/components/TrustSection"));
const OffersSection = dynamic(() => import("@/components/OffersSection"));
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"));
const LatestOffers = dynamic(() => import("@/components/LatestOffers"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const BranchesSection = dynamic(() => import("@/components/BranchesSection"));
const CTASection = dynamic(() => import("@/components/CTASection"));
const SchemesSection = dynamic(() => import("@/components/SchemesSection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));
const EnquiryPopup = dynamic(() => import("@/components/EnquiryPopup"));

export default function Home() {
  return (
    <>
      <FaqJsonLd faqs={[...homepageFaqs]} />
      <TopHeader />
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <ScrollReveal  delay={0.1}>
          <StatsSection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <AboutSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <TrustSection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <OffersSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FeaturedProjects />
        </ScrollReveal>
        <ScrollReveal>
          <LatestOffers />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ServicesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <BranchesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <SchemesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <CTASection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <ContactSection />
        </ScrollReveal>
      </main>
      <Footer />
      <EnquiryPopup />
    </>
  );
}
