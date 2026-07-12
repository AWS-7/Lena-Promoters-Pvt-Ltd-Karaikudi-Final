"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  Gift,
  Shield,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { CONTACT, telHref, whatsappHref } from "@/lib/contact";
import type { Campaign, Project } from "@/lib/types";
import { isCampaignExpired, isCampaignLive } from "@/lib/campaigns";

interface FestivalLandingPageProps {
  campaign: Campaign;
  projects: Project[];
}

function useCountdown(endDate: string | null) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });

  useEffect(() => {
    if (!endDate) return;

    const tick = () => {
      const end = new Date(`${endDate}T23:59:59`).getTime();
      const diff = end - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return;
      }
      setRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        done: false,
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return remaining;
}

export default function FestivalLandingPage({ campaign, projects }: FestivalLandingPageProps) {
  const live = isCampaignLive(campaign);
  const expired = isCampaignExpired(campaign);
  const countdown = useCountdown(campaign.end_date);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappLink = useMemo(() => {
    const message =
      campaign.whatsapp_message ||
      `Hi Lena Promoters, I am interested in the ${campaign.title} offer. Please share details.`;
    return `${whatsappHref()}?text=${encodeURIComponent(message)}`;
  }, [campaign.title, campaign.whatsapp_message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    setLoading(true);
    const source = `campaign:${campaign.slug}`;

    const { error: enquiryError } = await supabase.from("enquiries").insert([
      {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        source,
        status: "pending",
      },
    ]);

    if (enquiryError) {
      alert("Failed to submit. Please call us directly.");
      setLoading(false);
      return;
    }

    await supabase.from("notifications").insert([
      {
        title: `Festival Lead: ${campaign.title}`,
        message: `${form.name} (${form.phone}) claimed offer from ${campaign.slug}`,
        type: "lead",
        read: false,
      },
    ]);

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-[72vh] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0E6FA3] via-[#1195db] to-[#0a5480]" />
          {campaign.banner_url && (
            <Image
              src={campaign.banner_url}
              alt={campaign.title}
              fill
              priority
              unoptimized={campaign.banner_url.startsWith("http")}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/55" />

          <div className="container-custom relative py-28 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <Sparkles size={14} />
                {campaign.title}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
                {campaign.headline}
              </h1>
              {campaign.subtitle && (
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-6">{campaign.subtitle}</p>
              )}
              {campaign.offer_text && (
                <p className="text-white/75 text-sm md:text-base mb-8">{campaign.offer_text}</p>
              )}

              {live && campaign.end_date && !countdown.done && (
                <div className="inline-flex flex-wrap items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 mb-8">
                  <Clock size={18} className="text-[#fde68a]" />
                  <span className="text-sm font-medium">Offer ends in</span>
                  {[
                    { label: "Days", value: countdown.days },
                    { label: "Hrs", value: countdown.hours },
                    { label: "Min", value: countdown.minutes },
                    { label: "Sec", value: countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center min-w-[52px]">
                      <div className="text-xl font-bold leading-none">{String(item.value).padStart(2, "0")}</div>
                      <div className="text-xs uppercase tracking-wide text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {!live && (
                <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-300/40 text-red-100 rounded-xl px-4 py-3 mb-8">
                  <Calendar size={18} />
                  {expired ? "This festival offer has ended." : "This offer is not active right now."}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href="#claim-offer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0E6FA3] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Claim Offer <ArrowRight size={18} />
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-6 py-3 font-semibold hover:bg-[#1ebe57] transition-colors"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {campaign.benefits.length > 0 && (
          <section className="py-14 bg-[#f8fbfd]">
            <div className="container-custom">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                What You Get
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {campaign.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1195db]/10 text-[#1195db] flex items-center justify-center shrink-0">
                      <Gift size={18} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="py-14">
            <div className="container-custom">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Featured Plots in This Offer
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized={project.image_url.startsWith("http")}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1195db] to-[#0a5480]" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{project.title}</h3>
                      <p className="text-[#1195db] font-bold mb-2">{project.price}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-4">
                        <MapPin size={14} /> {project.location}
                      </p>
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0E6FA3] hover:underline"
                      >
                        View details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="claim-offer" className="py-16 bg-gradient-to-br from-[#0E6FA3] to-[#0a5480] text-white">
          <div className="container-custom grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {live ? "Claim Your Festival Offer" : "Offer Inquiry"}
              </h2>
              <p className="text-white/85 mb-6">
                Fill the form and our team will call you within 2 hours with full offer details and a free site visit slot.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield size={16} /> DTCP approved layouts with clear title
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {CONTACT.phonePrimary}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-300 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-white/85">
                    We received your request for <strong>{campaign.title}</strong>. Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Your Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Preferred Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                      placeholder="Karaikudi / Sivaganga"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !live}
                    className="w-full rounded-xl bg-white text-[#0E6FA3] py-3.5 font-bold hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : live ? "Claim Festival Offer" : "Offer Ended"}
                  </button>
                  {!live && (
                    <p className="text-center text-sm text-white/75">
                      Call us at{" "}
                      <a href={telHref(CONTACT.phonePrimary)} className="underline font-semibold">
                        {CONTACT.phonePrimary}
                      </a>
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
