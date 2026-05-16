"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, User, Phone, MapPin, Send, CheckCircle, Clock, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EnquiryPopup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [enquiryStatus, setEnquiryStatus] = useState<"pending" | "verified" | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyShown = sessionStorage.getItem("enquiryPopupShown");
      if (!alreadyShown) setShow(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem("enquiryPopupShown", "true");
  };

  const checkEnquiryStatus = async (phone: string) => {
    if (!phone.trim()) return;
    setCheckingStatus(true);
    const { data } = await supabase
      .from("enquiries")
      .select("status")
      .eq("phone", phone)
      .single();
    setCheckingStatus(false);
    if (data) {
      setEnquiryStatus(data.status as "pending" | "verified");
    }
  };

  const handlePhoneBlur = () => {
    checkEnquiryStatus(form.phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);

    const { error: enquiryError } = await supabase.from("enquiries").insert([{
      name: form.name,
      phone: form.phone,
      location: form.location,
      source: "website_popup",
      status: "pending",
    }]);
    if (enquiryError) {
      console.error("Enquiry insert error:", enquiryError);
      alert("Failed to save enquiry: " + enquiryError.message);
      setLoading(false);
      return;
    }

    const { error: notifError } = await supabase.from("notifications").insert([{
      title: "New Enquiry",
      message: `${form.name} from ${form.location || "Unknown"} enquired. Phone: ${form.phone}`,
      type: "lead",
      read: false,
    }]);
    if (notifError) console.error("Notification insert error:", notifError);

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      close();
      setSubmitted(false);
      setForm({ name: "", phone: "", location: "" });
      setEnquiryStatus(null);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 z-[105] backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 pt-20 pointer-events-none"
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top blue bar */}
              <div className="bg-gradient-to-r from-[#1195db] to-[#0a5480] p-6 text-center relative">
                {/* Close */}
                <button
                  onClick={close}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Logo */}
                <div className="relative w-16 h-16 mx-auto mb-3 bg-white rounded-xl p-1.5 shadow-lg">
                  <Image
                    src="/images/logo.png"
                    alt="Lena Promoters"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-white font-bold text-lg">Get Best Property Deals</h3>
                <p className="text-white/80 text-sm mt-1">Fill in your details and we will contact you shortly</p>
              </div>

              {/* Form */}
              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle size={28} className="text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Thank You!</h4>
                    <p className="text-gray-500 text-sm mt-1">Our team will reach out to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                        <User size={14} className="text-[#1195db]" />
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                        <Phone size={14} className="text-[#1195db]" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        onBlur={handlePhoneBlur}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                      />
                    </div>

                    {enquiryStatus === "pending" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2"
                      >
                        <Clock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          You have already submitted your enquiry. Our team is reviewing your details. Please wait until verification is complete.
                        </p>
                      </motion.div>
                    )}

                    {enquiryStatus === "verified" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2"
                      >
                        <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-800">
                          Your enquiry has been successfully verified. Our team has already contacted you. If you need further assistance, please visit the Contact section.
                        </p>
                      </motion.div>
                    )}

                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                        <MapPin size={14} className="text-[#1195db]" />
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your location (optional)"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || enquiryStatus === "pending" || enquiryStatus === "verified"}
                      className="w-full bg-gradient-to-r from-[#1195db] to-[#0a5480] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="animate-pulse">Submitting...</span>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Enquiry
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
