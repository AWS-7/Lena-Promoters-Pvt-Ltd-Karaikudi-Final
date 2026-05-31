"use client";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Lena Promoters Private Limited",
    alternateName: "Lena Promoters",
    url: "https://www.lenapromoterspvtltd.com",
    logo: "https://www.lenapromoterspvtltd.com/logo.png",
    image: "https://www.lenapromoterspvtltd.com/og-image.jpg",
    description:
      "Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience.",
    foundingDate: "2006",
    priceRange: "₹₹",
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
      streetAddress: "Karaikudi",
      addressLocality: "Karaikudi",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-81487-48140",
      contactType: "sales",
      availableLanguage: ["Tamil", "English"],
    },
    sameAs: [
      "https://www.facebook.com/lenapromoters",
      "https://www.instagram.com/lenapromoters",
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
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1200",
      bestRating: "5",
      worstRating: "1",
    },
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
    url: "https://www.lenapromoterspvtltd.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.lenapromoterspvtltd.com/projects?q={search_term_string}",
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
      url: "https://www.lenapromoterspvtltd.com",
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
}: {
  name: string;
  description: string;
  image?: string;
  url: string;
  price?: number;
}) {
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
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
      areaServed: {
        "@type": "City",
        name: "Karaikudi",
      },
    },
  };

  if (image) jsonLd.image = image;
  if (price) jsonLd.offers.price = price.toString();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
