"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { GalleryImage } from "@/lib/types";

const fallbackGallery: GalleryImage[] = [
  { id: "1", title: "Site Entrance", category: "Site", image_url: "", order: 1 },
  { id: "2", title: "Layout Aerial View", category: "Drone", image_url: "", order: 2 },
  { id: "3", title: "Plot Development", category: "Development", image_url: "", order: 3 },
  { id: "4", title: "Registration Event", category: "Event", image_url: "", order: 4 },
  { id: "5", title: "Road Construction", category: "Development", image_url: "", order: 5 },
  { id: "6", title: "Layout Entrance Arch", category: "Site", image_url: "", order: 6 },
];

// Blur placeholder for progressive loading
const blurPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzVCN0A9LjpHQ1xERktVTktcT0tYXE1dWj9aYFRfWmdITVRkWf/2wBDAR...";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [visibleCount, setVisibleCount] = useState(12); // Virtual scroll - load 12 initially
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data);
        else setImages(fallbackGallery);
      });
  }, []);

  // Intersection Observer for infinite scroll (virtual scrolling)
  useEffect(() => {
    if (images.length <= visibleCount) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, images.length)); // Load 8 more images
        }
      },
      { rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [images.length, visibleCount]);

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our Project Gallery</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Visual journey through our layouts, site visits, and customer registration moments.
          </p>
        </motion.div>

        {/* Gallery Grid with Virtual Scrolling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] ${
                i === 0 || i === 3 ? "md:row-span-2 min-h-[240px]" : "min-h-[180px]"
              }`}
              onClick={() => setSelectedImage(img)}
            >
              {/* Progressive Image Loading with Next.js Image */}
              {img.image_url ? (
                <>
                  <Image
                    src={img.image_url}
                    alt={img.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className={`object-cover transition-all duration-500 ${
                      loadedImages.has(img.id) ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    } group-hover:scale-110`}
                    placeholder="blur"
                    blurDataURL={blurPlaceholder}
                    loading={i < 6 ? "eager" : "lazy"} // Priority for first 6 images
                    priority={i < 6}
                    quality={75}
                    onLoad={() => handleImageLoad(img.id)}
                  />
                  {/* Loading spinner */}
                  {!loadedImages.has(img.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white/60" size={24} />
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480]" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                {!img.image_url && (
                  <>
                    <ImageIcon size={32} className="opacity-60 mb-3" />
                    <div className="font-semibold text-center">{img.title}</div>
                  </>
                )}
              </div>

              {/* Hover Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="font-semibold">{img.title}</div>
                <div className="text-xs opacity-80">{img.category}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Trigger for Virtual Scrolling */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading more images...</span>
            </div>
          </div>
        )}

        {/* Image Count */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Showing {visibleCount} of {images.length} images
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.image_url && (
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full rounded-lg"
                  priority
                  quality={90}
                />
              )}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">{selectedImage.title}</h3>
                <p className="text-white/70 text-sm">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
