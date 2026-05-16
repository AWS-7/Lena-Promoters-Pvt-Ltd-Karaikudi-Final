"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, CheckCircle, Phone, User, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const projectOptions = [
  "Lena Nagar Phase 1",
  "Lena Garden",
  "Lena Enclave",
  "Lena City",
  "Any Project",
];

export default function SiteVisitForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    project: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("site_visit_bookings").insert([
      { ...form, status: "pending" },
    ]);

    await supabase.from("notifications").insert([
      {
        title: "New Site Visit Booking",
        message: `${form.name} booked a site visit for ${form.project} on ${form.preferred_date}`,
        type: "site_visit",
        read: false,
      },
    ]);

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="site-visit" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Site Visit</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Book a Free Site Visit</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Schedule a complimentary site visit to any of our layouts. Our team will guide you through the plots.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border p-8 shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 mb-6">
                  Thank you {form.name}! Our team will contact you shortly to confirm your site visit.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", phone: "", email: "", project: "", preferred_date: "", preferred_time: "", notes: "" });
                  }}
                  className="rounded-lg bg-[#0E6FA3] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#0a5480]"
                >
                  Book Another Visit
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border p-8 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                        placeholder="+91..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Project *</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <select
                        required
                        value={form.project}
                        onChange={(e) => setForm({ ...form, project: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3] appearance-none bg-white"
                      >
                        <option value="">Select a project</option>
                        {projectOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Preferred Date *</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        required
                        type="date"
                        value={form.preferred_date}
                        onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Preferred Time *</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                      <select
                        required
                        value={form.preferred_time}
                        onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3] appearance-none bg-white"
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-1">Additional Notes</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6FA3]"
                      placeholder="Any specific requirements..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0E6FA3] text-white py-3 font-semibold hover:bg-[#0a5480] transition-colors disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Book Site Visit"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
