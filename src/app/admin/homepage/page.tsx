"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Image, Type, Layout, BarChart3, Users, Award,
  Star, MapPin, Phone, Sparkles, Briefcase, Home, MessageSquare,
  HelpCircle, FileText, Globe
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

const tabs = [
  { key: "hero", label: "Hero Banner", icon: Home },
  { key: "stats", label: "Stats", icon: BarChart3 },
  { key: "about", label: "About", icon: Users },
  { key: "offers", label: "Offers", icon: Sparkles },
  { key: "latest", label: "Latest Offers", icon: Image },
  { key: "whyus", label: "Why Choose Us", icon: Award },
  { key: "trust", label: "Trust & Credibility", icon: Star },
  { key: "journey", label: "Journey", icon: MapPin },
  { key: "cta", label: "CTA Section", icon: Phone },
  { key: "contact", label: "Contact Info", icon: Globe },
];

export default function HomepageAdmin() {
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("homepage_content")
      .select("*")
      .then(({ data: rows }) => {
        const map: Record<string, any> = {};
        rows?.forEach((row) => {
          map[row.section_key] = row.content;
        });
        setData(map);
        setLoading(false);
      });
  }, []);

  const saveSection = async (section: string, content: any) => {
    setSaving(true);
    const { error } = await supabase
      .from("homepage_content")
      .upsert({ section_key: section, content }, { onConflict: "section_key" });

    if (!error) {
      setMessage("Saved successfully!");
      setData((prev) => ({ ...prev, [section]: content }));
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  const updateField = (section: string, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const get = (section: string, field: string, fallback: any = "") =>
    data[section]?.[field] ?? fallback;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1195db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Sections</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all homepage content. Images stored in Cloudinary, text in Supabase.</p>
        </div>
        {message && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {message}
          </motion.span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#1195db] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          {/* HERO */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Home size={20} className="text-[#1195db]" />
                Hero Banner
              </h2>
              <CloudinaryUpload
                label="Hero Background Image"
                value={get("hero", "bgImage", "/hero-bg.png")}
                onChange={(url) => updateField("hero", "bgImage", url)}
              />
              <div>
                <label className="text-sm font-medium text-gray-700">Title Line 1</label>
                <input
                  type="text"
                  value={get("hero", "title1", "Premium Plots & Land")}
                  onChange={(e) => updateField("hero", "title1", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Title Line 2</label>
                <input
                  type="text"
                  value={get("hero", "title2", "For Your Dream Home")}
                  onChange={(e) => updateField("hero", "title2", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subtitle</label>
                <textarea
                  rows={2}
                  value={get("hero", "subtitle", "DTCP Approved Layouts in Karaikudi...")}
                  onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">CTA Button Text</label>
                <input
                  type="text"
                  value={get("hero", "ctaText", "Explore Projects")}
                  onChange={(e) => updateField("hero", "ctaText", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <button
                onClick={() => saveSection("hero", data.hero || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Hero"}
              </button>
            </div>
          )}

          {/* STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-[#1195db]" />
                Stats Section
              </h2>
              {[
                { key: "stat1", label: "Stat 1 - Number", sub: "Stat 1 - Label" },
                { key: "stat2", label: "Stat 2 - Number", sub: "Stat 2 - Label" },
                { key: "stat3", label: "Stat 3 - Number", sub: "Stat 3 - Label" },
                { key: "stat4", label: "Stat 4 - Number", sub: "Stat 4 - Label" },
                { key: "stat5", label: "Stat 5 - Number", sub: "Stat 5 - Label" },
              ].map((s, i) => (
                <div key={s.key} className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{s.label}</label>
                    <input
                      type="text"
                      value={get("stats", `value${i + 1}`, "0")}
                      onChange={(e) => updateField("stats", `value${i + 1}`, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{s.sub}</label>
                    <input
                      type="text"
                      value={get("stats", `label${i + 1}`, "Label")}
                      onChange={(e) => updateField("stats", `label${i + 1}`, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => saveSection("stats", data.stats || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Stats"}
              </button>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-[#1195db]" />
                About Section
              </h2>
              <CloudinaryUpload
                label="About Image"
                value={get("about", "image", "/images/about.jpg")}
                onChange={(url) => updateField("about", "image", url)}
              />
              <div>
                <label className="text-sm font-medium text-gray-700">Badge Text</label>
                <input
                  type="text"
                  value={get("about", "badge", "About Us")}
                  onChange={(e) => updateField("about", "badge", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={get("about", "title", "Trusted Real Estate Partner")}
                  onChange={(e) => updateField("about", "title", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={get("about", "description", "")}
                  onChange={(e) => updateField("about", "description", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <button
                onClick={() => saveSection("about", data.about || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save About"}
              </button>
            </div>
          )}

          {/* OFFERS */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={20} className="text-[#1195db]" />
                Offers Section
              </h2>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="font-medium text-gray-700 text-sm">Offer {i}</div>
                  <input
                    type="text"
                    placeholder="Offer Title"
                    value={get("offers", `title${i}`, "")}
                    onChange={(e) => updateField("offers", `title${i}`, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Offer Description"
                    value={get("offers", `desc${i}`, "")}
                    onChange={(e) => updateField("offers", `desc${i}`, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                  />
                  <CloudinaryUpload
                    label="Offer Image"
                    value={get("offers", `image${i}`, "")}
                    onChange={(url) => updateField("offers", `image${i}`, url)}
                  />
                </div>
              ))}
              <button
                onClick={() => saveSection("offers", data.offers || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Offers"}
              </button>
            </div>
          )}

          {/* LATEST OFFERS */}
          {activeTab === "latest" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Image size={20} className="text-[#1195db]" />
                Latest Offer Images
              </h2>
              <p className="text-sm text-gray-500">
                Upload up to 11 offer images. These appear in the auto-scrolling gallery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 11 }).map((_, i) => (
                  <CloudinaryUpload
                    key={i}
                    label={`Offer Image ${i + 1}`}
                    value={get("latest", `image${i + 1}`, "")}
                    onChange={(url) => updateField("latest", `image${i + 1}`, url)}
                  />
                ))}
              </div>
              <button
                onClick={() => saveSection("latest", data.latest || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Latest Offers"}
              </button>
            </div>
          )}

          {/* WHY CHOOSE US */}
          {activeTab === "whyus" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Award size={20} className="text-[#1195db]" />
                Why Choose Us
              </h2>
              <div>
                <label className="text-sm font-medium text-gray-700">Section Title</label>
                <input
                  type="text"
                  value={get("whyus", "title", "Why Choose Lena Promoters?")}
                  onChange={(e) => updateField("whyus", "title", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder={`Feature ${i} Title`}
                    value={get("whyus", `featureTitle${i}`, "")}
                    onChange={(e) => updateField("whyus", `featureTitle${i}`, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                  />
                  <input
                    type="text"
                    placeholder={`Feature ${i} Description`}
                    value={get("whyus", `featureDesc${i}`, "")}
                    onChange={(e) => updateField("whyus", `featureDesc${i}`, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                  />
                </div>
              ))}
              <button
                onClick={() => saveSection("whyus", data.whyus || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Why Choose Us"}
              </button>
            </div>
          )}

          {/* TRUST */}
          {activeTab === "trust" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Star size={20} className="text-[#1195db]" />
                Trust & Credibility
              </h2>
              <div>
                <label className="text-sm font-medium text-gray-700">Section Title</label>
                <input
                  type="text"
                  value={get("trust", "title", "Certified & Registered Company")}
                  onChange={(e) => updateField("trust", "title", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Certificate Number</label>
                <input
                  type="text"
                  value={get("trust", "certNo", "IN57483A")}
                  onChange={(e) => updateField("trust", "certNo", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Valid Until</label>
                <input
                  type="text"
                  value={get("trust", "validUntil", "06 Aug 2027")}
                  onChange={(e) => updateField("trust", "validUntil", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <button
                onClick={() => saveSection("trust", data.trust || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Trust"}
              </button>
            </div>
          )}

          {/* JOURNEY */}
          {activeTab === "journey" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-[#1195db]" />
                Journey Milestones
              </h2>
              <p className="text-sm text-gray-500">Manage the timeline milestones. Add up to 17 entries.</p>
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg items-center">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Year"
                      value={get("journey", `year${i + 1}`, "")}
                      onChange={(e) => updateField("journey", `year${i + 1}`, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={get("journey", `title${i + 1}`, "")}
                      onChange={(e) => updateField("journey", `title${i + 1}`, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                    />
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder="Description"
                      value={get("journey", `desc${i + 1}`, "")}
                      onChange={(e) => updateField("journey", `desc${i + 1}`, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => saveSection("journey", data.journey || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Journey"}
              </button>
            </div>
          )}

          {/* CTA */}
          {activeTab === "cta" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Phone size={20} className="text-[#1195db]" />
                CTA Section
              </h2>
              <div>
                <label className="text-sm font-medium text-gray-700">CTA Title</label>
                <input
                  type="text"
                  value={get("cta", "title", "Ready to Build Your Dream Home?")}
                  onChange={(e) => updateField("cta", "title", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">CTA Subtitle</label>
                <input
                  type="text"
                  value={get("cta", "subtitle", "Book a free site visit today")}
                  onChange={(e) => updateField("cta", "subtitle", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Button Text</label>
                <input
                  type="text"
                  value={get("cta", "buttonText", "Book Site Visit")}
                  onChange={(e) => updateField("cta", "buttonText", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <button
                onClick={() => saveSection("cta", data.cta || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save CTA"}
              </button>
            </div>
          )}

          {/* CONTACT */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Globe size={20} className="text-[#1195db]" />
                Contact Information
              </h2>
              <p className="text-sm text-gray-500">
                This also updates the footer contact info and site settings.
              </p>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={get("contact", "phone", "+91 98765 43210")}
                  onChange={(e) => updateField("contact", "phone", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  value={get("contact", "email", "info@lenapromoters.com")}
                  onChange={(e) => updateField("contact", "email", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <textarea
                  rows={2}
                  value={get("contact", "address", "Karaikudi, Tamil Nadu")}
                  onChange={(e) => updateField("contact", "address", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                <input
                  type="text"
                  value={get("contact", "whatsapp", "+91 98765 43210")}
                  onChange={(e) => updateField("contact", "whatsapp", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]"
                />
              </div>
              <button
                onClick={() => saveSection("contact", data.contact || {})}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1195db] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a5480] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Contact Info"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
