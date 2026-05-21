import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.lenapromoterspvtltd.com";

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), priority: 0.5 },
  ];
}
