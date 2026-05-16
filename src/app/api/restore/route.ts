import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY. Go to Vercel Dashboard → Settings → Environment Variables and add it." },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    const { data: backupData } = body;

    if (!backupData || !backupData.tables) {
      return NextResponse.json(
        { error: "Invalid backup data. Must contain 'tables' object." },
        { status: 400 }
      );
    }

    const results: Record<string, { inserted: number; error?: string }> = {};
    const tables = backupData.tables as Record<string, any[]>;

    for (const [tableName, rows] of Object.entries(tables)) {
      if (!Array.isArray(rows) || rows.length === 0) {
        results[tableName] = { inserted: 0 };
        continue;
      }

      // Remove IDs to let Supabase generate new ones (avoid conflicts)
      const cleanRows = rows.map((row) => {
        const { id, created_at, updated_at, ...rest } = row;
        return rest;
      });

      const { error, data } = await supabase.from(tableName).insert(cleanRows);

      if (error) {
        console.error(`Restore error for ${tableName}:`, error);
        results[tableName] = { inserted: 0, error: error.message };
      } else {
        results[tableName] = { inserted: cleanRows.length };
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      totalInserted: Object.values(results).reduce(
        (sum, r) => sum + r.inserted,
        0
      ),
    });
  } catch (error: any) {
    console.error("Restore error:", error);
    return NextResponse.json(
      { error: error.message || "Restore failed" },
      { status: 500 }
    );
  }
}
