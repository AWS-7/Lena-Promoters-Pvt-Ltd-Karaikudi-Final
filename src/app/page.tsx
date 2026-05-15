import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import OffersSection from "@/components/OffersSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import LatestOffers from "@/components/LatestOffers";
import ServicesSection from "@/components/ServicesSection";
import EMICalculator from "@/components/EMICalculator";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import TrustSection from "@/components/TrustSection";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import LayoutMap from "@/components/LayoutMap";
import CTASection from "@/components/CTASection";
import SiteVisitForm from "@/components/SiteVisitForm";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import EnquiryPopup from "@/components/EnquiryPopup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <TopHeader />
      <Navbar />
      <main>
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
          <EMICalculator />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ServicesSection />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <WhyChooseUs />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Gallery />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <LayoutMap />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <JourneySection />
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
