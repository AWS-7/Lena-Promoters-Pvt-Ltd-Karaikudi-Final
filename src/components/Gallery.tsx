"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
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

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] rounded-xl overflow-hidden group cursor-pointer ${
                i === 0 || i === 3 ? "md:row-span-2 min-h-[240px]" : "min-h-[180px]"
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480]"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ImageIcon size={32} className="opacity-60 mb-3 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="font-semibold text-center group-hover:scale-105 transition-transform">{img.title}</div>
                <div className="text-xs opacity-70 mt-1">{img.category}</div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
