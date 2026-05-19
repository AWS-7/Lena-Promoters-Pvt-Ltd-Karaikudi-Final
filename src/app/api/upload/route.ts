import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { uploadRateLimiter, getRateLimitHeaders } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: NextRequest) {
  let fileName = "unknown";
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `upload:${ip}`;

    // Check rate limit
    const rateLimit = uploadRateLimiter.isAllowed(rateLimitKey);
    if (!rateLimit.allowed) {
      logger.warn("Rate limit exceeded for upload", { ip });
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "backup-images";

    if (!file) {
      logger.warn("Upload attempt with no file", { ip });
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime) }
      );
    }

    fileName = file.name;
    logger.info("File upload started", { fileName, fileSize: file.size, ip });

    // 1. Upload to Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

    let cloudinaryUrl = "";
    if (cloudName && uploadPreset) {
      const cf = new FormData();
      cf.append("file", file);
      cf.append("upload_preset", uploadPreset);
      const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cf,
      });
      const cData = await cRes.json();
      if (cData.secure_url) cloudinaryUrl = cData.secure_url;
    }

    // 2. Upload to Supabase Storage as backup
    let backupUrl = "";
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("backups")
        .upload(filePath, await file.arrayBuffer(), {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("backups").getPublicUrl(filePath);
        backupUrl = urlData.publicUrl;
      }
    }

    logger.info("File upload completed", { fileName, cloudinaryUrl: !!cloudinaryUrl, backupUrl: !!backupUrl });

    return NextResponse.json(
      {
        success: true,
        image_url: cloudinaryUrl,
        backup_url: backupUrl,
      },
      { headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime) }
    );
  } catch (error: any) {
    logger.error("Upload failed", error, { fileName, path: "/api/upload" });
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
