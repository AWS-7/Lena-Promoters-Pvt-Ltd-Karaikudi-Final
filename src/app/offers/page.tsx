import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LatestOffers from "@/components/LatestOffers";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getActiveCampaigns } from "@/lib/campaigns";
import { Sparkles, ArrowRight } from "lucide-react";

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

export default async function OffersPage() {
  const campaigns = await getActiveCampaigns();

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

        {campaigns.length > 0 && (
          <section className="py-10 bg-[#f8fbfd] border-b border-gray-100">
            <div className="container-custom">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Sparkles className="text-[#1195db]" size={22} />
                Festival & Limited-Time Campaigns
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/offers/${campaign.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#1195db]/30 transition-all"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#1195db] mb-2">
                      {campaign.title}
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#0E6FA3]">
                      {campaign.headline}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {campaign.subtitle || campaign.offer_text}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0E6FA3]">
                      View offer <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <LatestOffers />
      </main>
      <Footer />
    </>
  );
}
