import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.lenapromoterspvtltd.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/services`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${baseUrl}/projects`, lastModified: now, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/lena-group`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/why-us`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/offers`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
    { url: `${baseUrl}/refund-policy`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
  ];

  const projects = await getAllProjects();
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.created_at ? new Date(project.created_at) : now,
    priority: 0.85,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...projectPages];
}
