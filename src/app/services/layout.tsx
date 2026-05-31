import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Services in Karaikudi | Plot Consulting, Legal & Loan Support",
  description:
    "Complete real estate services in Karaikudi — property consulting, bank loan assistance, legal documentation, title verification, construction services & site investigation by Lena Promoters.",
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
  ].join(", "),
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/services",
  },
  openGraph: {
    title: "Real Estate Services in Karaikudi | Lena Promoters",
    description:
      "Complete real estate services — consulting, loan, legal, construction & site investigation in Karaikudi, Tamil Nadu.",
    url: "https://www.lenapromoterspvtltd.com/services",
    images: ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
