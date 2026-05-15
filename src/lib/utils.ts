import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number; crop?: string }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const { width = 800, height, crop = "fill" } = options || {};
  const h = height ? `,h_${height}` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width}${h},q_auto,f_auto/${publicId}`;
}
