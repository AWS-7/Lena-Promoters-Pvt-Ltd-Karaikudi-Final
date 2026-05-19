import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  const startTime = Date.now();

  try {
    // Check critical environment variables
    const checks = {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      cloudinary: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      sentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    };

    const allHealthy = Object.values(checks).every(Boolean);

    const response = {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${Date.now() - startTime}ms`,
      checks,
      version: process.env.npm_package_version || "0.1.0",
      environment: process.env.NODE_ENV || "development",
    };

    logger.debug("Health check passed", response);

    return NextResponse.json(response, {
      status: allHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    logger.error("Health check failed", error as Error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}
