"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CallPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const phone1 = CONTACT.phonePrimary;
  const phone2 = CONTACT.phoneSecondary;
  const email = settings?.email || CONTACT.email;
  const address = settings?.address || CONTACT.address;
  const whatsapp = settings?.whatsapp || CONTACT.whatsapp;

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-gradient-to-br from-[#0E6FA3] to-[#0a5480]">
        <div className="container-custom py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Reach out to us for plot enquiries, site visits, or any questions about our projects.
            </p>
          </motion.div>

          <div className="max-w-md mx-auto space-y-4">
            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1195db]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-[#1195db]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <div className="text-xl font-bold text-gray-900">{phone1}</div>
                  <div className="text-xl font-bold text-gray-900">{phone2}</div>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">WhatsApp</div>
                  <div className="text-xl font-bold text-gray-900">{whatsapp}</div>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-[#f59e0b]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-lg font-bold text-gray-900">{email}</div>
                </div>
              </div>
            </motion.div>

            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <div className="text-lg font-bold text-gray-900">{address}</div>
                </div>
              </div>
            </motion.div>

            {/* Timing Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Working Hours</div>
                  <div className="text-lg font-bold text-gray-900">{CONTACT.workingHours}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-10"
          >
            <a
              href={`tel:${phone1.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-3 rounded-2xl bg-green-500 text-white px-10 py-4 font-bold text-lg hover:bg-green-600 transition-colors shadow-xl"
            >
              <Phone size={24} /> Call {phone1}
            </a>
            <p className="text-white/60 text-sm mt-4">Click to dial directly</p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
