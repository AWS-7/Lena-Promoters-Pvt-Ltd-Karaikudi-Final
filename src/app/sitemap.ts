import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.lenapromoterspvtltd.com";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/services`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${baseUrl}/projects`, lastModified: now, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/offers`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
    { url: `${baseUrl}/refund-policy`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
  ];
}
