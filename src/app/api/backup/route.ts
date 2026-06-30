import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const TABLES = [
  "projects",
  "services",
  "testimonials",
  "gallery",
  "faq",
  "partners",
  "certificates",
  "leads",
  "settings",
  "notifications",
  "site_visit_bookings",
  "enquiries",
  "homepage_content",
  "campaigns",
  "project_layouts",
  "project_plots",
];

export async function GET() {
  const hasConfig = !!(supabaseUrl && supabaseServiceKey);
  return NextResponse.json({
    configured: hasConfig,
    message: hasConfig
      ? "Backup system ready"
      : "Missing SUPABASE_SERVICE_ROLE_KEY env var. Add it in Vercel Settings → Environment Variables.",
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY. Go to Vercel Dashboard → Settings → Environment Variables and add it." },
        { status: 503 }
      );
    }

    // Parse optional triggered flag
    let triggered = false;
    try {
      const body = await request.json();
      triggered = !!body?.triggered;
    } catch {
      // GET-style POST or no body — treat as manual backup
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const backup: Record<string, any[]> = {};

    for (const table of TABLES) {
      const { data, error } = await supabase.from(table).select("*");
      if (error) {
        console.warn(`Backup: skipping table ${table}:`, error.message);
        backup[table] = [];
      } else {
        backup[table] = data || [];
      }
    }

    const timestamp = new Date().toISOString();
    const backupData = {
      version: "1.0",
      timestamp,
      source_url: supabaseUrl,
      triggered,
      tables: backup,
    };

    // Save to Supabase Storage backups bucket
    const fileName = `backup_${timestamp.replace(/[:.]/g, "-")}.json`;
    const { error: storageError } = await supabase.storage
      .from("backups")
      .upload(`data/${fileName}`, JSON.stringify(backupData, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    if (storageError) {
      console.warn("Could not save backup to storage:", storageError.message);
    }

    return NextResponse.json({
      success: true,
      timestamp,
      tables: Object.keys(backup),
      counts: Object.fromEntries(
        Object.entries(backup).map(([k, v]) => [k, v.length])
      ),
      data: backupData,
    });
  } catch (error: any) {
    console.error("Backup error:", error);
    return NextResponse.json(
      { error: error.message || "Backup failed" },
      { status: 500 }
    );
  }
}
