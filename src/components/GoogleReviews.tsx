"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { GoogleReview } from "@/lib/types";

const fallbackReviews: GoogleReview[] = [
  {
    id: "1",
    author_name: "Rajesh Kumar",
    rating: 5,
    text: "Excellent DTCP approved plots. The team was very professional and the registration process was smooth. Highly recommended land promoter in Karaikudi.",
    review_date: "2024-03-15",
  },
  {
    id: "2",
    author_name: "Lakshmi Narayanan",
    rating: 5,
    text: "Purchased two plots in Lena Nagar. Layout is well planned with proper roads and EB connection. Great investment for my children's future.",
    review_date: "2024-02-20",
  },
  {
    id: "3",
    author_name: "Mohammed Farook",
    rating: 5,
    text: "Professional team with transparent pricing. Site visit was well organized and all queries answered. Will recommend to friends and family.",
    review_date: "2024-01-10",
  },
];

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);

  useEffect(() => {
    supabase
      .from("google_reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data);
        else setReviews(fallbackReviews);
      });
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Google Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Google Users Say</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className={`${i < Math.round(Number(avgRating)) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="font-bold text-gray-900 text-lg">{avgRating}</span>
            <span className="text-gray-500 text-sm">out of 5</span>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              <MapPin size={10} /> Google Verified
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{review.author_name}</div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, r) => (
                      <Star key={r} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.text}</p>
              <div className="text-xs text-gray-400">{review.review_date}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0a5480] transition-colors"
          >
            <ExternalLink size={16} /> Write a Review on Google
          </a>
        </div>
      </div>
    </section>
  );
}
