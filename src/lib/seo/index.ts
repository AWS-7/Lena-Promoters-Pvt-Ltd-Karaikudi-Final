import type { Metadata } from "next";

export const SITE_URL = "https://www.lenapromoterspvtltd.com";
export const SITE_NAME = "Lena Promoters Private Limited";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-bg.jpg`;

export const businessGeo = {
  latitude: 10.0661,
  longitude: 78.7831,
} as const;

export const directoryCitations = [
  {
    name: "Google Business Profile",
    url: "https://www.google.com/maps/search/Lena+Promoters+Karaikudi",
  },
  {
    name: "JustDial",
    url: "https://www.justdial.com/Karaikudi/Lena-Promoters",
  },
  {
    name: "IndiaMART",
    url: "https://www.indiamart.com/lena-promoters-karaikudi",
  },
  {
    name: "Sulekha",
    url: "https://www.sulekha.com/lena-promoters-karaikudi",
  },
] as const;

export const homepageFaqs = [
  {
    question: "Are your plots DTCP approved?",
    answer:
      "Yes, all our layouts are fully approved by the Directorate of Town and Country Planning (DTCP). We provide the approval documents for verification before purchase.",
  },
  {
    question: "What is the registration process?",
    answer:
      "We provide end-to-end registration support. Our team prepares all required documents, schedules sub-registrar appointments, and assists throughout the registration process at no extra cost.",
  },
  {
    question: "Can I get a bank loan for plot purchase?",
    answer:
      "Yes, we have tie-ups with SBI, HDFC, ICICI, and other leading banks. We assist with loan documentation and coordination with bank representatives for smooth processing.",
  },
  {
    question: "How can I book a site visit?",
    answer:
      "You can book a site visit by calling our office, sending a WhatsApp message, or filling the contact form on this website. We offer free pickup and drop for site visits within Karaikudi.",
  },
  {
    question: "What documents will I receive after purchase?",
    answer:
      "You will receive the sale deed, DTCP approval copy, layout plan, encumbrance certificate, and all relevant legal documents ensuring clear title ownership.",
  },
] as const;

export const localKeywords = [
  "DTCP approved plots Karaikudi",
  "land promoter Karaikudi",
  "plot sales Tamil Nadu",
  "real estate Karaikudi",
  "Lena Promoters",
  "residential plots Sivaganga",
  "commercial land Karaikudi",
  "buy plot Karaikudi",
  "land for sale Karaikudi",
  "property dealer Karaikudi",
  "house site Karaikudi",
  "RERA approved plots",
  "land investment Karaikudi",
  "Chettinad plots",
  "Sivaganga district plots",
  "clear title plots",
  "bank loan for plot purchase",
  "real estate company Karaikudi",
  "affordable plots Karaikudi",
  "premium land layouts Karaikudi",
] as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[] | string[];
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@lenapromoters",
      site: "@lenapromoters",
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-image-preview": "large" as const,
              "max-snippet": -1,
            },
          },
        }),
  };
}
