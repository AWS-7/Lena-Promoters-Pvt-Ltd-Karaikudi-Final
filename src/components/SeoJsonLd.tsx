"use client";

import { CONTACT, SITE_STATS } from "@/lib/contact";
import {
  SITE_URL,
  aeoService,
  geoService,
} from "@/lib/seo/geo-aeo";
import { businessGeo } from "@/lib/seo";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: "Lena Promoters Private Limited",
    alternateName: "Lena Promoters",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/hero-bg.jpg`,
    description:
      "Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience.",
    foundingDate: "2006",
    email: CONTACT.email,
    telephone: "+91-814-874-8140",
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessGeo.latitude,
      longitude: businessGeo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Karaikudi",
      containedInPlace: {
        "@type": "State",
        name: "Tamil Nadu",
        containedInPlace: {
          "@type": "Country",
          name: "India",
        },
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "No:49/3 Keelamel, 100 Feet Road, Soodamanipuram",
      addressLocality: "Karaikudi",
      postalCode: "630001",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-814-874-8140",
      email: CONTACT.email,
      contactType: "sales",
      availableLanguage: ["Tamil", "English"],
      areaServed: "IN",
    },
    sameAs: [
      CONTACT.facebook,
      CONTACT.instagram,
      CONTACT.youtube,
      CONTACT.twitter,
      CONTACT.linkedin,
      CONTACT.googleBusiness,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plot Sales & Land Layouts",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "DTCP Approved Residential Plots",
            description: "DTCP approved residential plots in Karaikudi with clear titles",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Commercial Land",
            description: "Commercial land parcels for business development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Real Estate Consulting",
            description: "Expert property investment advice and market analysis",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bank Loan Assistance",
            description: "Home and plot loan support from leading banks",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Legal Documentation",
            description: "Title verification and registration support",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: geoService.name,
            alternateName: geoService.alternateName,
            description: geoService.description,
            serviceType: geoService.serviceType,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: aeoService.name,
            alternateName: aeoService.alternateName,
            description: aeoService.description,
            serviceType: aeoService.serviceType,
          },
        },
      ],
    },
    knowsAbout: [
      "DTCP approved plots Karaikudi",
      "Generative Engine Optimization",
      "Answer Engine Optimization",
      "Real estate Karaikudi Tamil Nadu",
      "Land layouts Sivaganga district",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: String(SITE_STATS.happyCustomers),
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Lena Promoters Customer" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Excellent DTCP approved plots in Karaikudi with clear legal documentation and helpful staff.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Plot Buyer, Karaikudi" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Smooth registration process and bank loan assistance. Highly recommend Lena Promoters.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function buildGeoAeoServiceJsonLd(service: typeof geoService | typeof aeoService) {
  return {
    "@type": "Service",
    name: service.name,
    alternateName: service.alternateName,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      "@type": "RealEstateAgent",
      name: "Lena Promoters Private Limited",
      url: SITE_URL,
    },
    url: SITE_URL,
    areaServed: {
      "@type": "City",
      name: "Karaikudi",
      containedInPlace: {
        "@type": "State",
        name: "Tamil Nadu",
      },
    },
    hasOffer: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#contact`,
    },
  };
}

export function GeoAeoJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildGeoAeoServiceJsonLd(geoService),
      buildGeoAeoServiceJsonLd(aeoService),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#ai-seo`,
        name: "GEO and AEO Optimization — Lena Promoters",
        description:
          "Generative Engine Optimization and Answer Engine Optimization structured data for Lena Promoters in Karaikudi, Tamil Nadu.",
        url: SITE_URL,
        isPartOf: {
          "@type": "WebSite",
          name: "Lena Promoters Private Limited",
          url: SITE_URL,
        },
        about: [
          { "@type": "Thing", name: "Generative Engine Optimization" },
          { "@type": "Thing", name: "Answer Engine Optimization" },
          { "@type": "Thing", name: "DTCP approved plots Karaikudi" },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lena Promoters Private Limited",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/projects?location={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "RealEstateAgent",
      name: "Lena Promoters Private Limited",
      url: SITE_URL,
    },
    url,
    areaServed: {
      "@type": "City",
      name: "Karaikudi",
      containedInPlace: {
        "@type": "State",
        name: "Tamil Nadu",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  location,
}: {
  name: string;
  description: string;
  image?: string;
  url: string;
  price?: string;
  location?: string;
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    category: "Real Estate Plot",
    brand: {
      "@type": "Brand",
      name: "Lena Promoters Private Limited",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Lena Promoters Private Limited",
    },
    offers: {
      "@type": "Offer",
      url,
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      seller: {
        "@type": "RealEstateAgent",
        name: "Lena Promoters Private Limited",
      },
      areaServed: {
        "@type": "City",
        name: location || "Karaikudi",
      },
    },
  };

  if (image) jsonLd.image = image;
  if (price) (jsonLd.offers as Record<string, string>).price = price;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OfferJsonLd({
  name,
  description,
  url,
  image,
  validThrough,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  validThrough?: string;
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name,
    description,
    url,
    availability: "https://schema.org/InStock",
    priceCurrency: "INR",
    seller: {
      "@type": "RealEstateAgent",
      name: "Lena Promoters Private Limited",
      url: SITE_URL,
    },
    offeredBy: {
      "@type": "RealEstateAgent",
      name: "Lena Promoters Private Limited",
    },
    areaServed: {
      "@type": "City",
      name: "Karaikudi",
    },
  };

  if (image) jsonLd.image = image;
  if (validThrough) jsonLd.validThrough = validThrough;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
