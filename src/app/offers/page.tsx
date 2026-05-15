import Navbar from "@/components/Navbar";
import LatestOffers from "@/components/LatestOffers";
import Footer from "@/components/Footer";

export default function OffersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Latest Offers</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Exclusive deals on premium plots and properties. Grab them before they are gone!
            </p>
          </div>
        </section>
        <LatestOffers />
      </main>
      <Footer />
    </>
  );
}
