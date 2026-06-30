import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("homepage_content")
    .select("content, updated_at")
    .eq("section_key", "hero")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      content: data?.content ?? null,
      updated_at: data?.updated_at ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
