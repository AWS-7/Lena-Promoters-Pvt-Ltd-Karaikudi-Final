"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { CONTACT, whatsappHref } from "@/lib/contact";
import { supabase } from "@/lib/supabase";
import { SiteVisitFormBox } from "@/components/SiteVisitForm";

export default function ContactSection() {
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
  const email = CONTACT.email;
  const address = CONTACT.address;
  const whatsapp = settings?.whatsapp || CONTACT.whatsapp;
  const workingHours = CONTACT.workingHours;

  return (
    <section id="contact" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Get In Touch</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Have questions? Reach out to us and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#e6f2f9] rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#0E6FA3]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <a href={`tel:${phone1.replace(/\s/g, "")}`} className="font-semibold text-gray-900 hover:text-[#0E6FA3] block">{phone1}</a>
                    <a href={`tel:${phone2.replace(/\s/g, "")}`} className="font-semibold text-gray-900 hover:text-[#0E6FA3] block">{phone2}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#e6f2f9] rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#0E6FA3]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <a href={`mailto:${email}`} className="font-semibold text-gray-900 hover:text-[#0E6FA3]">{email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#e6f2f9] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#0E6FA3]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Office Address</div>
                    <div className="font-semibold text-gray-900">{address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#e6f2f9] rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#0E6FA3]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Working Hours</div>
                    <div className="font-semibold text-gray-900">{workingHours}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <a
                  href={whatsappHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Send size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100 h-64 bg-gray-100 flex items-center justify-center">
              <iframe
                title="Office Location"
                src={CONTACT.googleMapsEmbed}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Book a Free Site Visit</h3>
              <p className="text-gray-500 text-sm">
                Schedule a complimentary site visit to any of our layouts. Our team will guide you through the plots.
              </p>
            </div>
            <SiteVisitFormBox embedded />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
