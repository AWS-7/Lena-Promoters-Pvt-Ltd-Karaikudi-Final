import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectDetailView from "@/components/ProjectDetailView";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/SeoJsonLd";
import { getProjectById } from "@/lib/projects";
import { SITE_URL, buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: "Project Not Found | Lena Promoters" };
  }

  return buildPageMetadata({
    title: `${project.title} | DTCP Approved Plots in Karaikudi`,
    description:
      project.description ||
      `${project.title} in ${project.location}. ${project.price}. DTCP approved plots with clear title from Lena Promoters.`,
    path: `/projects/${id}`,
    image: project.image_url || undefined,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const projectUrl = `${SITE_URL}/projects/${id}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Projects", url: `${SITE_URL}/projects` },
          { name: project.title, url: projectUrl },
        ]}
      />
      <ProductJsonLd
        name={project.title}
        description={project.description || `${project.title} in ${project.location}`}
        image={project.image_url}
        url={projectUrl}
        price={project.price}
        location={project.location}
      />
      <Navbar />
      <main>
        <ProjectDetailView project={project} />
      </main>
      <Footer />
    </>
  );
}
