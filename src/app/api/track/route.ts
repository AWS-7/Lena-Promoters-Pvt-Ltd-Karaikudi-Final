import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getClientIP(request: NextRequest): string {
  // Standard headers for IP behind proxies
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "x-client-ip",
    "x-cluster-client-ip",
  ];
  for (const h of headers) {
    const val = request.headers.get(h);
    if (val) {
      // x-forwarded-for can be a comma-separated list; take first
      return val.split(",")[0].trim();
    }
  }
  // Fallback to socket remote address (less reliable behind proxy)
  return "0.0.0.0";
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ ok: true }); // Silently ignore if not configured
    }

    const body = await request.json().catch(() => ({}));
    const { cookieId, device = "desktop", page = "/" } = body;
    const ip = getClientIP(request);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if visitor already has a record for today (by cookie_id + date)
    const { data: existing } = await supabase
      .from("visitor_logs")
      .select("id, visit_count, first_visit")
      .eq("cookie_id", cookieId || ip)
      .eq("visit_date", today)
      .maybeSingle();

    if (existing) {
      // Increment visit count and update last_visit
      await supabase
        .from("visitor_logs")
        .update({
          visit_count: existing.visit_count + 1,
          last_visit: new Date().toISOString(),
          ip_address: ip, // Update IP in case it changed
          device,
        })
        .eq("id", existing.id);
    } else {
      // New visit for today
      await supabase.from("visitor_logs").insert({
        ip_address: ip,
        cookie_id: cookieId || null,
        visit_date: today,
        visit_count: 1,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        device,
        page,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    // Always return 200 so the client never blocks
    return NextResponse.json({ ok: true });
  }
}
