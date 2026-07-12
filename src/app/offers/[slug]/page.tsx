import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FestivalLandingPage from "@/components/FestivalLandingPage";
import { BreadcrumbJsonLd, OfferJsonLd } from "@/components/SeoJsonLd";
import { getCampaignBySlug, getCampaignProjects } from "@/lib/campaigns";
import { SITE_URL, buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return { title: "Offer Not Found" };
  }

  const url = `${SITE_URL}/offers/${campaign.slug}`;

  return buildPageMetadata({
    title: `${campaign.title} | Lena Promoters Karaikudi`,
    description: campaign.subtitle || campaign.headline,
    path: `/offers/${campaign.slug}`,
    image: campaign.banner_url || undefined,
  });
}

export default async function CampaignOfferPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) notFound();

  const projects = await getCampaignProjects(campaign.project_ids);
  const offerUrl = `${SITE_URL}/offers/${campaign.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Offers", url: `${SITE_URL}/offers` },
          { name: campaign.title, url: offerUrl },
        ]}
      />
      <OfferJsonLd
        name={campaign.headline}
        description={campaign.subtitle || campaign.offer_text}
        url={offerUrl}
        image={campaign.banner_url}
        validThrough={campaign.end_date || undefined}
      />
      <FestivalLandingPage campaign={campaign} projects={projects} />
    </>
  );
}
