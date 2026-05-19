"use client";

import { motion } from "framer-motion";
import { Gift, Percent, CheckCircle, ArrowRight, Calendar, BadgePercent } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const schemes = [
  {
    id: 1,
    title: "Early Bird Discount",
    tag: "Limited Offer",
    icon: BadgePercent,
    discount: "10% Off",
    description: "Book your plot within 30 days of site visit and get exclusive 10% discount on total plot value.",
    benefits: [
      "10% instant discount",
      "Free site visit",
      "Priority plot selection",
      "Flexible payment options"
    ],
    validTill: "Valid till December 2025",
    cta: "Avail Offer",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    id: 2,
    title: "Referral Rewards",
    tag: "Ongoing",
    icon: Gift,
    discount: "₹10,000",
    description: "Refer your friends or family to buy a plot and earn ₹10,000 cash reward on successful booking.",
    benefits: [
      "₹10,000 per referral",
      "Unlimited referrals",
      "Direct bank transfer",
      "No minimum purchase required"
    ],
    validTill: "Valid throughout the year",
    cta: "Refer Now",
    color: "from-[#1195db] to-[#0E6FA3]",
    bgColor: "bg-[#e6f2f9]",
    iconColor: "text-[#0E6FA3]"
  }
];

export default function SchemesSection() {
  return (
    <section id="schemes" className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#0E6FA3] rounded-full px-4 py-1.5 text-sm font-medium mb-4"
            >
              <Percent size={16} />
              Exclusive Offers
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Special <span className="text-[#0E6FA3]">Schemes</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Take advantage of our exclusive offers and save more on your dream plot investment
            </p>
          </div>
        </ScrollReveal>

        {/* Scheme Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {schemes.map((scheme, index) => (
            <ScrollReveal key={scheme.id} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className={`relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-gray-100`}
              >
                {/* Top Color Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${scheme.color}`} />
                
                {/* Tag Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1.5 ${scheme.bgColor} ${scheme.iconColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                    <Calendar size={12} />
                    {scheme.tag}
                  </span>
                </div>

                <div className="p-6 md:p-8">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 ${scheme.bgColor} rounded-2xl flex items-center justify-center shrink-0`}>
                      <scheme.icon size={28} className={scheme.iconColor} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-gray-500">{scheme.validTill}</p>
                    </div>
                  </div>

                  {/* Discount Highlight */}
                  <div className={`${scheme.bgColor} rounded-xl p-4 mb-6`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                        <span className={`text-lg font-bold ${scheme.iconColor}`}>{scheme.discount}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{scheme.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-8">
                    {scheme.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle size={18} className={`${scheme.iconColor} shrink-0`} />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r ${scheme.color} text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all`}
                  >
                    {scheme.cta}
                    <ArrowRight size={18} />
                  </motion.a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Note */}
        <ScrollReveal delay={0.3}>
          <div className="mt-10 md:mt-12 text-center">
            <p className="text-gray-500 text-sm md:text-base">
              * Terms and conditions apply. Contact us for more details about our schemes.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
