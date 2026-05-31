import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LatestOffers from "@/components/LatestOffers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Exclusive Plot Offers in Karaikudi | Deals & Discounts | Lena Promoters",
  description:
    "Limited-time offers on DTCP approved plots in Karaikudi. Get 50% payment document, BOGO deals, free gold coins, free patta registration & more from Lena Promoters.",
  keywords: [
    "plot offers Karaikudi",
    "land deals Tamil Nadu",
    "discount on plots Karaikudi",
    "BOGO plot offer",
    "free patta registration",
    "50% payment document",
    "gold coin offer plot",
    "plot booking discount",
    "limited time plot deals",
    "Lena Promoters offers",
    "affordable plots offer",
    "plot festival Karaikudi",
    "real estate offers Tamil Nadu",
  ].join(", "),
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/offers",
  },
  openGraph: {
    title: "Exclusive Plot Offers in Karaikudi | Lena Promoters",
    description:
      "Limited-time offers on DTCP approved plots — BOGO, free gold coins, free patta & more.",
    url: "https://www.lenapromoterspvtltd.com/offers",
    images: ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
  },
};

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
