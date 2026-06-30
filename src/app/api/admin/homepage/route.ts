import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const section = body?.section as string;
  const content = body?.content;

  if (!section || typeof content !== "object" || content === null) {
    return NextResponse.json({ error: "Invalid section or content" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("homepage_content")
    .select("content")
    .eq("section_key", section)
    .maybeSingle();

  const merged = { ...(existing?.content ?? {}), ...content };

  const { data, error } = await supabase
    .from("homepage_content")
    .upsert(
      {
        section_key: section,
        content: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    )
    .select("content, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    content: data.content,
    updated_at: data.updated_at,
  });
}
