import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const cloudApiKey = process.env.CLOUDINARY_API_KEY || "";
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET || "";

// Tier limits (adjust these based on your actual plan)
const LIMITS = {
  supabaseDbMB: 500,      // Free tier: 500MB
  supabaseStorageMB: 1024, // Free tier: 1GB
  cloudinaryStorageMB: 25, // Free tier: 25MB
};

async function getSupabaseDbSize(supabase: any): Promise<number> {
  try {
    const { data, error } = await supabase.rpc("get_db_size_bytes");
    if (error) {
      // Fallback: try raw SQL via the REST API (requires executing SQL)
      const { data: sqlData, error: sqlError } = await supabase
        .from("_")
        .select("*")
        .limit(0);
      // If RPC doesn't exist, estimate from table row counts
      return 0;
    }
    return data ? parseInt(data) / (1024 * 1024) : 0;
  } catch {
    return 0;
  }
}

async function getSupabaseStorageSize(supabase: any): Promise<number> {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    let totalBytes = 0;
    for (const bucket of buckets || []) {
      const { data: objects } = await supabase.storage.from(bucket.name).list("", { limit: 1000 });
      for (const obj of objects || []) {
        totalBytes += obj.metadata?.size || 0;
      }
    }
    return totalBytes / (1024 * 1024);
  } catch {
    return 0;
  }
}

async function getCloudinaryUsage(): Promise<{ storageMB: number; credits: number; bandwidthMB: number } | null> {
  if (!cloudName || !cloudApiKey || !cloudApiSecret) return null;
  try {
    const auth = Buffer.from(`${cloudApiKey}:${cloudApiSecret}`).toString("base64");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      storageMB: (data.storage?.usage || 0) / (1024 * 1024),
      credits: data.plan?.credits_usage || 0,
      bandwidthMB: (data.bandwidth?.usage || 0) / (1024 * 1024),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Supabase DB size via RPC (most accurate)
    let dbSizeMB = 0;
    let usingEstimate = false;
    try {
      const { data, error } = await supabase.rpc("get_db_size_mb");
      if (!error && data) {
        dbSizeMB = parseFloat(data);
      } else {
        throw new Error("RPC not available");
      }
    } catch {
      // Fallback: use pg_stat_user_tables for approximate row count + size
      usingEstimate = true;
      try {
        const { data: stats } = await supabase
          .from("pg_stat_user_tables")
          .select("relname, n_live_tup")
          .not("schemaname", "eq", "pg_catalog")
          .not("schemaname", "eq", "information_schema");
        let totalRows = 0;
        for (const row of stats || []) {
          totalRows += row.n_live_tup || 0;
        }
        // Rough estimate: ~2.5KB per row average including indexes
        dbSizeMB = (totalRows * 2.5) / 1024;
      } catch {
        // Final fallback: count rows from known tables
        const tables = ["projects","services","testimonials","gallery","faq","partners","certificates","leads","settings","notifications","site_visit_bookings","enquiries","homepage_content","project_layouts","project_plots"];
        let totalRows = 0;
        for (const t of tables) {
          const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
          totalRows += count || 0;
        }
        dbSizeMB = (totalRows * 2.5) / 1024;
      }
    }

    // Get Supabase Storage size
    const storageSizeMB = await getSupabaseStorageSize(supabase);

    // Get Cloudinary usage
    const cloudinary = await getCloudinaryUsage();

    const supabaseDbPct = Math.min(100, Math.round((dbSizeMB / LIMITS.supabaseDbMB) * 100));
    const supabaseStoragePct = Math.min(100, Math.round((storageSizeMB / LIMITS.supabaseStorageMB) * 100));
    const cloudinaryStoragePct = cloudinary
      ? Math.min(100, Math.round((cloudinary.storageMB / LIMITS.cloudinaryStorageMB) * 100))
      : null;

    const anyWarning = supabaseDbPct >= 80 || supabaseStoragePct >= 80 || (cloudinaryStoragePct !== null && cloudinaryStoragePct >= 80);
    const anyCritical = supabaseDbPct >= 90 || supabaseStoragePct >= 90 || (cloudinaryStoragePct !== null && cloudinaryStoragePct >= 90);

    return NextResponse.json({
      supabase: {
        db: { usedMB: Math.round(dbSizeMB * 10) / 10, limitMB: LIMITS.supabaseDbMB, percent: supabaseDbPct, estimated: usingEstimate },
        storage: { usedMB: Math.round(storageSizeMB * 10) / 10, limitMB: LIMITS.supabaseStorageMB, percent: supabaseStoragePct },
      },
      cloudinary: cloudinary
        ? {
            storage: { usedMB: Math.round(cloudinary.storageMB * 10) / 10, limitMB: LIMITS.cloudinaryStorageMB, percent: cloudinaryStoragePct },
            credits: cloudinary.credits,
            bandwidthMB: Math.round(cloudinary.bandwidthMB * 10) / 10,
            configured: true,
          }
        : { configured: false },
      status: anyCritical ? "critical" : anyWarning ? "warning" : "ok",
      thresholds: { warning: 80, critical: 90 },
      checkedAt: new Date().toISOString(),
      setupNote: usingEstimate
        ? "For accurate DB size, create this RPC in Supabase SQL Editor: CREATE OR REPLACE FUNCTION get_db_size_mb() RETURNS numeric AS $$ SELECT round(pg_database_size(current_database())::numeric / (1024*1024), 2); END; $$ LANGUAGE sql SECURITY DEFINER;"
        : undefined,
    });
  } catch (error: any) {
    console.error("Quota check error:", error);
    return NextResponse.json(
      { error: error.message || "Quota check failed" },
      { status: 500 }
    );
  }
}
