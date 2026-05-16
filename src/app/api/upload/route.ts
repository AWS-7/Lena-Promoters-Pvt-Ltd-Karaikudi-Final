import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "backup-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      image_url: cloudinaryUrl,
      backup_url: backupUrl,
    });
  } catch (error: any) {
    console.error("Dual upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
