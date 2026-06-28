/** Client-side helpers — validate remote images via server before Next/Image loads them */
export async function batchCheckImageUrls(urls: string[]): Promise<Record<string, boolean>> {
  const remote = [...new Set(urls.filter((url) => url?.startsWith("http")))];
  if (remote.length === 0) return {};

  try {
    const res = await fetch("/api/image-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: remote }),
    });
    if (!res.ok) return {};
    const data = (await res.json()) as { results?: Record<string, boolean> };
    return data.results ?? {};
  } catch {
    return {};
  }
}

export async function pickReachableImageUrl(
  url: string | null | undefined,
  fallback: string
): Promise<string> {
  if (!url?.trim()) return fallback;

  const trimmed = url.trim();
  if (trimmed.startsWith("/")) {
    return trimmed.endsWith("/hero-bg.png") ? fallback : trimmed;
  }

  const results = await batchCheckImageUrls([trimmed]);
  return results[trimmed] ? trimmed : fallback;
}

export async function sanitizeProjectImageUrls<T extends { image_url?: string | null }>(
  items: T[]
): Promise<T[]> {
  const urls = items.map((item) => item.image_url).filter(Boolean) as string[];
  const reachable = await batchCheckImageUrls(urls);

  return items.map((item) => {
    if (!item.image_url || reachable[item.image_url]) return item;
    return { ...item, image_url: "" };
  });
}
