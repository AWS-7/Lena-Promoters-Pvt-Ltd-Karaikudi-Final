const reachabilityCache = new Map<string, boolean>();

/** Server-side check whether a remote image URL responds successfully */
export async function isImageUrlReachable(url: string): Promise<boolean> {
  const trimmed = url?.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/")) {
    return !trimmed.endsWith("/hero-bg.png");
  }

  if (!trimmed.startsWith("http")) return false;

  if (reachabilityCache.has(trimmed)) {
    return reachabilityCache.get(trimmed)!;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response = await fetch(trimmed, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(trimmed, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: controller.signal,
        redirect: "follow",
      });
    }

    clearTimeout(timeout);

    const ok = response.ok || response.status === 206;
    reachabilityCache.set(trimmed, ok);
    return ok;
  } catch {
    reachabilityCache.set(trimmed, false);
    return false;
  }
}

export async function filterReachableUrls(urls: string[]): Promise<Record<string, boolean>> {
  const unique = [...new Set(urls.filter(Boolean))];
  const entries = await Promise.all(
    unique.map(async (url) => [url, await isImageUrlReachable(url)] as const)
  );
  return Object.fromEntries(entries);
}
