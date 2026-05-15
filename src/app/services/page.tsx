import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Our Services</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              End-to-end land and plot solutions with legal assurance and professional support.
            </p>
          </div>
        </section>
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
}
