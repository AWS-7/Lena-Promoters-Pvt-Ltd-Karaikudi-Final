"use client";

import { useState } from "react";

interface SafeImageProps {
  src?: string;
  backupSrc?: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export default function SafeImage({ src, backupSrc, alt, className = "", fill }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || backupSrc || "");
  const [triedBackup, setTriedBackup] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src && !backupSrc) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>
        No Image
      </div>
    );
  }

  const handleError = () => {
    if (!triedBackup && backupSrc && currentSrc !== backupSrc) {
      setCurrentSrc(backupSrc);
      setTriedBackup(true);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>
        Image Unavailable
      </div>
    );
  }

  if (fill) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className={`object-cover w-full h-full ${className}`}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}
