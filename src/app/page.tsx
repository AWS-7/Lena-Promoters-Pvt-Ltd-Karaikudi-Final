import dynamic from "next/dynamic";
import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ScrollReveal from "@/components/ScrollReveal";

const AboutSection = dynamic(() => import("@/components/AboutSection"));
const TrustSection = dynamic(() => import("@/components/TrustSection"));
const OffersSection = dynamic(() => import("@/components/OffersSection"));
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"));
const LatestOffers = dynamic(() => import("@/components/LatestOffers"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Gallery = dynamic(() => import("@/components/Gallery"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const LayoutMap = dynamic(() => import("@/components/LayoutMap"));
const JourneySection = dynamic(() => import("@/components/JourneySection"));
const BranchesSection = dynamic(() => import("@/components/BranchesSection"));
const CTASection = dynamic(() => import("@/components/CTASection"));
const SiteVisitForm = dynamic(() => import("@/components/SiteVisitForm"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));
const EnquiryPopup = dynamic(() => import("@/components/EnquiryPopup"));

export default function Home() {
  return (
    <>
      <TopHeader />
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <ScrollReveal delay={0.1}>
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
        <ScrollReveal delay={0.15}>
          <WhyChooseUs />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ServicesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Gallery />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <LayoutMap />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <JourneySection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <BranchesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <CTASection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <SiteVisitForm />
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
