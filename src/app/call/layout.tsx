import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Lena Promoters | Call, WhatsApp & Site Visit Booking",
  description:
    "Contact Lena Promoters in Karaikudi for DTCP approved plot enquiries. Call +91 814 874 8140, WhatsApp us, or book a free site visit. Open Monday to Sunday, 9 AM to 8 PM.",
  path: "/call",
  keywords: [
    "contact Lena Promoters",
    "call Karaikudi plot dealer",
    "site visit booking Karaikudi",
    "Lena Promoters phone number",
    "WhatsApp plot enquiry Karaikudi",
  ],
});

export default function CallLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/call` },
        ]}
      />
      {children}
    </>
  );
}
