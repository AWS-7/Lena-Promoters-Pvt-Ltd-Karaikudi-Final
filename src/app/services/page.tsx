"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Building2, FileText, Scale, Hammer, Search, Landmark, Home, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Real Estate Consulting",
    description: "Expert advice on property investment and market trends to help you make informed decisions.",
    features: ["Market Analysis", "Investment Strategy", "Property Valuation"]
  },
  {
    icon: Home,
    title: "Property Exchange",
    description: "Hassle-free property buying and selling services with transparent pricing and documentation.",
    features: ["Buy/Sell Assistance", "Negotiation Support", "Legal Verification"]
  },
  {
    icon: Landmark,
    title: "Bank Loan Assistance",
    description: "Complete support for home and plot loans from leading banks with competitive interest rates.",
    features: ["Loan Processing", "Documentation", "Bank Tie-ups"]
  },
  {
    icon: Hammer,
    title: "Construction Services",
    description: "End-to-end building and renovation services with quality materials and expert supervision.",
    features: ["New Construction", "Renovation", "Material Supply"]
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description: "Legal verification and registration assistance to ensure your property is legally sound.",
    features: ["Title Verification", "Registration", "Legal Compliance"]
  },
  {
    icon: Scale,
    title: "Legal Advisory",
    description: "Property dispute resolution and legal consultation from experienced property lawyers.",
    features: ["Dispute Resolution", "Legal Consultation", "Court Representation"]
  },
  {
    icon: Search,
    title: "Site Investigation",
    description: "Professional land survey and feasibility analysis before property purchase.",
    features: ["Land Survey", "Feasibility Study", "Boundary Marking"]
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1195db] via-[#0E6FA3] to-[#0a5480] text-white pt-32 pb-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold text-sm uppercase tracking-wider px-5 py-2 rounded-full mb-6"
              >
                <Building2 size={18} />
                Professional Services
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Complete Land & Plot Solutions
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                From property consultation to legal documentation — we provide end-to-end services with 18+ years of expertise.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-white text-[#0E6FA3] font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  View Services
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12 border-b">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Happy Customers", value: "1000+" },
                { label: "Years Experience", value: "5+" },
                { label: "Projects Completed", value: "1000+" },
                { label: "Ongoing Project", value: "27+" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#1195db] mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-4">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive real estate services designed to make your property journey smooth and secure.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#1195db] to-[#0E6FA3] rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all"
                  >
                    <service.icon size={32} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle size={14} className="text-[#1195db]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-4">
                  Why Choose Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Trusted by 1000+ Customers Across Tamil Nadu
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  With over 5+ years of experience in real estate, we've built a reputation for trust, transparency, and excellence. Our team of experts ensures every property transaction is smooth and legally secure.
                </p>
                <div className="space-y-4">
                  {[
                    "DTCP Approved Properties Only",
                    "Clear Title Verification",
                    "Transparent Pricing with No Hidden Charges",
                    "Complete Legal Documentation Support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#1195db] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#1195db] to-[#0E6FA3] rounded-3xl p-8 text-white">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Building2, label: "Properties", value: "1000+" },
                      { icon: FileText, label: "Documents", value: "10K+" },
                      { icon: Scale, label: "Legal Cases", value: "200+" },
                      { icon: CheckCircle, label: "Satisfied", value: "1000+" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                        <item.icon size={28} className="mx-auto mb-2" />
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-sm text-white/80">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-[#1195db] to-[#0E6FA3] text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-white/80 mb-8">
                Contact us today for a free consultation and let us help you find your dream property.
              </p>
              <a
                href="tel:+918148748140"
                className="inline-flex items-center gap-3 bg-white text-[#0E6FA3] font-semibold px-10 py-4 rounded-full hover:bg-white/90 transition-colors text-lg"
              >
                Call Us Now
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
