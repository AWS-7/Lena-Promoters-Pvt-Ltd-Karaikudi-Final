"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactSection() {
  const [settings, setSettings] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: leadsError } = await supabase.from("leads").insert([
      { name: form.name, email: form.email, phone: form.phone, message: form.message, status: "new" },
    ]);
    if (leadsError) {
      console.error("Leads insert error:", leadsError);
      alert("Failed to save lead: " + leadsError.message);
      return;
    }
    const { error: notifError } = await supabase.from("notifications").insert([
      {
        title: "New Contact Inquiry",
        message: `${form.name} submitted a contact form. Phone: ${form.phone}`,
        type: "contact",
        read: false,
      },
    ]);
    if (notifError) console.error("Notification insert error:", notifError);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const phone1 = "+91 81487 48140";
  const phone2 = "+91 81481 48140";
  const email = settings?.email || "info@lenapromoters.com";
  const address = settings?.address || "123, Main Road, Karaikudi, Sivaganga District, Tamil Nadu - 630001";
  const whatsapp = settings?.whatsapp || "+91 81487 48140";

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
                    <div className="font-semibold text-gray-900">Mon - Sat: 9:00 AM - 7:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <a
                  href={`https://wa.me/${phone1.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Send size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100 h-64 bg-gray-100 flex items-center justify-center">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.1!2d78.78!3d10.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDAzJzUyLjgiTiA3OMKwNDYnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send an Inquiry</h3>
              <p className="text-gray-500 text-sm mb-6">Fill the form below and we will contact you shortly.</p>

              {submitted ? (
                <div className="flex items-center gap-3 text-green-600 bg-green-50 rounded-xl p-4">
                  <CheckCircle size={20} />
                  <span className="font-medium">Thank you! We will get back to you soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                        placeholder="+91..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                      placeholder="I'm interested in..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#0E6FA3] text-white py-3 font-semibold hover:bg-[#0a5480] transition-colors"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
