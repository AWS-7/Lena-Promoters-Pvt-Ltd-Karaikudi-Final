"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { FAQ as FAQType } from "@/lib/types";

const fallbackFAQs: FAQType[] = [
  {
    id: "1",
    question: "Are your plots DTCP approved?",
    answer: "Yes, all our layouts are fully approved by the Directorate of Town and Country Planning (DTCP). We provide the approval documents for verification before purchase.",
    order: 1,
  },
  {
    id: "2",
    question: "What is the registration process?",
    answer: "We provide end-to-end registration support. Our team prepares all required documents, schedules sub-registrar appointments, and assists throughout the registration process at no extra cost.",
    order: 2,
  },
  {
    id: "3",
    question: "Can I get a bank loan for plot purchase?",
    answer: "Yes, we have tie-ups with SBI, HDFC, ICICI, and other leading banks. We assist with loan documentation and coordination with bank representatives for smooth processing.",
    order: 3,
  },
  {
    id: "4",
    question: "How can I book a site visit?",
    answer: "You can book a site visit by calling our office, sending a WhatsApp message, or filling the contact form on this website. We offer free pickup and drop for site visits within Karaikudi.",
    order: 4,
  },
  {
    id: "5",
    question: "What documents will I receive after purchase?",
    answer: "You will receive the sale deed, DTCP approval copy, layout plan, encumbrance certificate, and all relevant legal documents ensuring clear title ownership.",
    order: 5,
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    supabase
      .from("faq")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setFaqs(data);
        else setFaqs(fallbackFAQs);
      });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-3">
            Find answers to common questions about buying plots with Lena Promoters.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[#0E6FA3] transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
