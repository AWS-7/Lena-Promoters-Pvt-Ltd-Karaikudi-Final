/** Default local fallbacks when remote/optimized images fail */
export const HERO_BG_FALLBACK = "/hero-bg.jpg";
export const HERO_BG_LEGACY = "/hero-bg.png";
export const PROJECT_IMAGE_PLACEHOLDER = "/images/project-placeholder.jpg";

/** Prefer a working local hero asset over a broken remote URL */
export function resolveHeroBackground(bgImage?: string | null): string {
  const trimmed = bgImage?.trim();
  if (!trimmed || trimmed === HERO_BG_LEGACY) return HERO_BG_FALLBACK;
  return trimmed;
}
