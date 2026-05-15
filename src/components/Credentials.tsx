"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Award, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Certificate } from "@/lib/types";

const fallbackCerts = [
  { id: "1", title: "ISO 9001:2015 Certified", type: "ISO", order: 1 },
  { id: "2", title: "DTCP Approved Promoter", type: "Approval", order: 2 },
  { id: "3", title: "RERA Registered", type: "Approval", order: 3 },
  { id: "4", title: "Government Registered", type: "Registration", order: 4 },
];

export default function Credentials() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setCerts(data);
        else setCerts(fallbackCerts as any);
      });
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Credentials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Company Credentials</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Registered and approved by all relevant government bodies. Your trust is our foundation.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-[#e6f2f9] rounded-full flex items-center justify-center mx-auto mb-4">
                {c.type === "ISO" ? <Award size={28} className="text-[#0E6FA3]" /> : c.type === "Approval" ? <Shield size={28} className="text-[#0E6FA3]" /> : <FileCheck size={28} className="text-[#0E6FA3]" />}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
              <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {c.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
