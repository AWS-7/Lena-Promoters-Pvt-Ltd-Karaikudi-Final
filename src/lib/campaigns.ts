import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { Campaign, Project } from "@/lib/types";

function normalizeCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title ?? ""),
    headline: String(row.headline ?? ""),
    subtitle: String(row.subtitle ?? ""),
    offer_text: String(row.offer_text ?? ""),
    banner_url: String(row.banner_url ?? ""),
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    project_ids: Array.isArray(row.project_ids) ? (row.project_ids as string[]) : [],
    start_date: row.start_date ? String(row.start_date) : null,
    end_date: row.end_date ? String(row.end_date) : null,
    whatsapp_message: String(row.whatsapp_message ?? ""),
    active: Boolean(row.active),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function isCampaignExpired(campaign: Campaign): boolean {
  if (!campaign.end_date) return false;
  const end = new Date(`${campaign.end_date}T23:59:59`);
  return Number.isFinite(end.getTime()) && end.getTime() < Date.now();
}

export function isCampaignLive(campaign: Campaign): boolean {
  if (!campaign.active) return false;
  if (isCampaignExpired(campaign)) return false;
  if (campaign.start_date) {
    const start = new Date(`${campaign.start_date}T00:00:00`);
    if (Number.isFinite(start.getTime()) && start.getTime() > Date.now()) return false;
  }
  return true;
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeCampaign(data);
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("active", true)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map(normalizeCampaign).filter(isCampaignLive);
}

export async function getCampaignProjects(projectIds: string[]): Promise<Project[]> {
  if (!projectIds.length) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds);

  if (error || !data) return [];

  const order = new Map(projectIds.map((id, index) => [id, index]));
  return [...data].sort(
    (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999)
  ) as Project[];
}
