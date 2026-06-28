import fs from "fs";
import sharp from "sharp";

const outJpg = "public/hero-bg.jpg";
const placeholder = "public/images/project-placeholder.jpg";

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E6FA3"/>
      <stop offset="45%" stop-color="#1195db"/>
      <stop offset="100%" stop-color="#0a5480"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1195db"/>
      <stop offset="100%" stop-color="#0a5480"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="52%" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="28" font-weight="700">Lena Promoters</text>
</svg>`;

fs.mkdirSync("public/images", { recursive: true });

await sharp(Buffer.from(heroSvg)).jpeg({ quality: 88 }).toFile(outJpg);
await sharp(Buffer.from(placeholderSvg)).jpeg({ quality: 85 }).toFile(placeholder);

console.log("Created", outJpg, "and", placeholder);
