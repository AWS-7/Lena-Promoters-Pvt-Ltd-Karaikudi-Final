import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { loginRateLimiter, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `login:${ip}`;

    // Check rate limit
    const rateLimit = loginRateLimiter.isAllowed(rateLimitKey);
    if (!rateLimit.allowed) {
      logger.warn("Rate limit exceeded for login", { ip, resetTime: rateLimit.resetTime });
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const { username, password } = await request.json();

    // Get credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    logger.info("Login attempt", { username, ip });

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set auth cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60, // 8 hours
        path: "/",
      });

      logger.info("Login successful", { username, ip });
      return NextResponse.json(
        { success: true },
        { headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime) }
      );
    }

    logger.warn("Invalid login credentials", { username, ip });
    return NextResponse.json(
      { error: "Invalid username or password" },
      {
        status: 401,
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error) {
    logger.error("Login error", error as Error, { path: "/api/admin/login" });
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
