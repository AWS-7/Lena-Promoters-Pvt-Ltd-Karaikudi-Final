import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaigns: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const id = body.id as string | undefined;
  const slug = slugify(body.slug || body.title || "");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const benefits = Array.isArray(body.benefits)
    ? body.benefits.filter((item: unknown) => typeof item === "string" && item.trim())
    : String(body.benefits || "")
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean);

  const projectIds = Array.isArray(body.project_ids)
    ? body.project_ids.filter((item: unknown) => typeof item === "string")
    : [];

  const payload = {
    slug,
    title: String(body.title || "").trim(),
    headline: String(body.headline || "").trim(),
    subtitle: String(body.subtitle || "").trim(),
    offer_text: String(body.offer_text || "").trim(),
    banner_url: String(body.banner_url || "").trim(),
    benefits,
    project_ids: projectIds,
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    whatsapp_message: String(body.whatsapp_message || "").trim(),
    active: body.active !== false,
    updated_at: new Date().toISOString(),
  };

  if (!payload.title || !payload.headline) {
    return NextResponse.json({ error: "Title and headline are required" }, { status: 400 });
  }

  const query = id
    ? supabase.from("campaigns").update(payload).eq("id", id).select("*").single()
    : supabase.from("campaigns").insert([payload]).select("*").single();

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, campaign: data });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Campaign id is required" }, { status: 400 });
  }

  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
