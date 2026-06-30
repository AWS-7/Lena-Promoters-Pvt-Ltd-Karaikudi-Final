import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FestivalLandingPage from "@/components/FestivalLandingPage";
import { getCampaignBySlug, getCampaignProjects } from "@/lib/campaigns";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return { title: "Offer Not Found" };
  }

  const url = `https://www.lenapromoterspvtltd.com/offers/${campaign.slug}`;

  return {
    title: `${campaign.title} | Lena Promoters Karaikudi`,
    description: campaign.subtitle || campaign.headline,
    alternates: { canonical: url },
    openGraph: {
      title: campaign.headline,
      description: campaign.subtitle || campaign.offer_text,
      url,
      images: campaign.banner_url ? [{ url: campaign.banner_url }] : undefined,
    },
  };
}

export default async function CampaignOfferPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) notFound();

  const projects = await getCampaignProjects(campaign.project_ids);

  return <FestivalLandingPage campaign={campaign} projects={projects} />;
}
