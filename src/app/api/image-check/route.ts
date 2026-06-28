import { NextResponse } from "next/server";
import { filterReachableUrls, isImageUrlReachable } from "@/lib/validate-image";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = await isImageUrlReachable(url);
  return NextResponse.json({ ok });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls = Array.isArray(body?.urls) ? body.urls.filter((u: unknown) => typeof u === "string") : [];
    const results = await filterReachableUrls(urls);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: {} }, { status: 400 });
  }
}
