import type { Metadata } from "next";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/SeoJsonLd";
import { SITE_URL, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Real Estate Services in Karaikudi | Plot Consulting, Legal & Loan Support",
  description:
    "Complete real estate services in Karaikudi — property consulting, bank loan assistance, legal documentation, title verification, construction services & site investigation by Lena Promoters.",
  path: "/services",
  keywords: [
    "real estate services Karaikudi",
    "property consulting Tamil Nadu",
    "bank loan for plot Karaikudi",
    "legal documentation property",
    "title verification Tamil Nadu",
    "construction services Karaikudi",
    "land survey Karaikudi",
    "property dispute resolution",
    "home loan assistance Karaikudi",
    "plot loan support",
    "DTCP approval assistance",
    "patta registration Karaikudi",
    "property valuation Karaikudi",
    "land buying guide Tamil Nadu",
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Services", url: `${SITE_URL}/services` },
        ]}
      />
      <ServiceJsonLd
        name="Real Estate Services in Karaikudi"
        description="Complete land and plot solutions including consulting, legal documentation, bank loan assistance, and construction support."
        url={`${SITE_URL}/services`}
      />
      {children}
    </>
  );
}
