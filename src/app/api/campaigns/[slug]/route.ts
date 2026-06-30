import { NextRequest, NextResponse } from "next/server";
import { getCampaignBySlug, isCampaignExpired, isCampaignLive } from "@/lib/campaigns";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  let projects: unknown[] = [];

  if (supabase && campaign.project_ids.length > 0) {
    const { data } = await supabase
      .from("projects")
      .select("id, title, location, price, area_size, approval_status, image_url, category")
      .in("id", campaign.project_ids);
    projects = data ?? [];
  }

  return NextResponse.json(
    {
      campaign,
      projects,
      live: isCampaignLive(campaign),
      expired: isCampaignExpired(campaign),
    },
    {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    }
  );
}
