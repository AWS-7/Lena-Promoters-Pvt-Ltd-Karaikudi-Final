"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, Building2, Store, Wrench, Award, Rocket, Flag, Star } from "lucide-react";
import { useRef } from "react";

const milestones = [
  { year: "2009", title: "Lena Mobiles", desc: "The Complete Mobile Care - Founded as a mobile retail and service business.", icon: Store },
  { year: "2010", title: "Videocon Distributor", desc: "Became authorized Videocon distributor under Lena Communications.", icon: Flag },
  { year: "2011", title: "Reliance Distributor", desc: "Expanded as Reliance distributor through Lena Communications.", icon: Flag },
  { year: "2012", title: "G-Five Distributor", desc: "Added G-Five mobile distribution to Lena Communications portfolio.", icon: Flag },
  { year: "2013", title: "Amma Mess", desc: "Diversified into food services with the launch of Amma Mess.", icon: Store },
  { year: "2014", title: "Lena Mobiles Trichy", desc: "Opened Trichy branch expanding mobile retail presence.", icon: MapPin },
  { year: "2015", title: "Branch-2 Opening", desc: "Lena Mobiles opened second branch for wider customer reach.", icon: Building2 },
  { year: "2016", title: "TN Traders Bangalore", desc: "Expanded to Bangalore with TN Traders trading division.", icon: MapPin },
  { year: "2017", title: "Service Center", desc: "Opened Lena Mobiles Service Center for after-sales support.", icon: Wrench },
  { year: "2018", title: "Branch-3 Opening", desc: "Lena Mobiles opened third branch across Tamil Nadu.", icon: Building2 },
  { year: "2019", title: "Branch-4 Opening", desc: "Continued expansion with fourth Lena Mobiles branch.", icon: Building2 },
  { year: "2020", title: "Branch-4 Expansion", desc: "Further strengthened retail presence with additional branch.", icon: Building2 },
  { year: "2021", title: "Lena Promoters", desc: "Ventured into real estate with founding of Lena Promoters.", icon: Building2 },
  { year: "2022", title: "Lena Promoters Pvt Ltd", desc: "Incorporated as private limited company for professional real estate services.", icon: Award },
  { year: "2023", title: "Startup India", desc: "Recognized under Startup India initiative for innovation in real estate.", icon: Rocket },
  { year: "2024", title: "ISO 9001:2015 Certified", desc: "Achieved ISO 9001:2015 certification for quality management standards.", icon: Award },
  { year: "2025", title: "Sivaganga Branch", desc: "Opened new branch at Collector Office Road, Kanjarangal, Sivaganga.", icon: Building2 },
  { year: "2026", title: "Dubai Branch", desc: "Expanded internationally with Dubai office at Business Bay.", icon: MapPin },
];

export default function JourneySection({ showHeader = true }: { showHeader?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven line drawing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothLineHeight = useSpring(lineHeight, { stiffness: 60, damping: 20 });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-[#1195db]/3 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#f59e0b]/3 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container-custom relative">
        {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Flag size={14} />
            Our Legacy
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">
            Journey of LENA GROUP
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            From a small mobile shop to a diversified business conglomerate — our growth story since 2009.
          </p>
        </motion.div>
        )}

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background line (track) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-px" />

          {/* Animated progress line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[#1195db] via-[#f59e0b] to-[#059669] md:-translate-x-px"
            style={{ height: smoothLineHeight }}
          />

          {milestones.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`relative flex items-start md:items-center gap-6 mb-10 last:mb-0
                  ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline dot with pulse animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="absolute left-6 md:left-1/2 w-4 h-4 bg-white border-4 border-[#1195db] rounded-full z-10 md:-translate-x-1/2 mt-1.5 md:mt-0 shadow-md"
                />
                {/* Pulse ring */}
                <motion.div
                  className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full z-10 md:-translate-x-1/2 mt-1.5 md:mt-0"
                  initial={{ scale: 1, opacity: 0.6 }}
                  whileInView={{ scale: 2.5, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ border: "2px solid #1195db" }}
                />

                {/* Spacer for desktop alternating layout */}
                <div className="hidden md:block md:w-1/2" />

                {/* Card */}
                <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#1195db] rounded-lg flex items-center justify-center shadow-md">
                        <item.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1195db] uppercase tracking-wider">
                          {item.year}
                        </span>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed pl-[52px]">
                      {item.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
