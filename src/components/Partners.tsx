"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Partner } from "@/lib/types";

const fallbackPartners: Partner[] = [
  { id: "1", name: "State Bank of India", type: "Bank", order: 1 },
  { id: "2", name: "HDFC Bank", type: "Bank", order: 2 },
  { id: "3", name: "ICICI Bank", type: "Bank", order: 3 },
  { id: "4", name: "Axis Bank", type: "Bank", order: 4 },
  { id: "5", name: "LIC Housing Finance", type: "Finance", order: 5 },
  { id: "6", name: "DHFL", type: "Finance", order: 6 },
  { id: "7", name: "IndiaBulls Housing", type: "Finance", order: 7 },
  { id: "8", name: "PNB Housing", type: "Finance", order: 8 },
];

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from("partners")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPartners(data);
        else setPartners(fallbackPartners);
      });
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Partnerships</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Exclusive Deals</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            We have partnered with leading banks and financial institutions for easy plot loans and financing.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#0E6FA3]/30 transition-colors"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <Building2 size={24} className="text-[#0E6FA3]" />
              </div>
              <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
              <div className="text-xs text-gray-400 mt-1">{p.type}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
