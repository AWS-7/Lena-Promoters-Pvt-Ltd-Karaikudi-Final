import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectDetailView from "@/components/ProjectDetailView";
import { getProjectById } from "@/lib/projects";

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

  return {
    title: `${project.title} | DTCP Approved Plots in Karaikudi`,
    description:
      project.description ||
      `${project.title} in ${project.location}. ${project.price}. DTCP approved plots with clear title from Lena Promoters.`,
    alternates: {
      canonical: `https://www.lenapromoterspvtltd.com/projects/${id}`,
    },
    openGraph: {
      title: `${project.title} | Lena Promoters`,
      description: project.description || `${project.title} — ${project.location}`,
      url: `https://www.lenapromoterspvtltd.com/projects/${id}`,
      images: project.image_url
        ? [{ url: project.image_url, alt: project.title }]
        : ["https://www.lenapromoterspvtltd.com/og-image.jpg"],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <ProjectDetailView project={project} />
      </main>
      <Footer />
    </>
  );
}
