"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Briefcase, Users, FileCheck, HardHat } from "lucide-react";

import { SITE_STATS } from "@/lib/contact";

const stats = [
  { icon: Calendar, label: "Years Exp", value: SITE_STATS.yearsExperience },
  { icon: Briefcase, label: "Projects Completed", value: SITE_STATS.projectsCompleted },
  { icon: Users, label: "Happy Customer", value: SITE_STATS.happyCustomers },
  { icon: FileCheck, label: "Plots Sold", value: SITE_STATS.plotsSold },
  { icon: HardHat, label: "Ongoing Projects", value: SITE_STATS.ongoingProjects },
];

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        setFinished(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.span
      animate={finished ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="inline-block"
    >
      {count.toLocaleString()}+
    </motion.span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-gray-50 py-12 md:py-16 overflow-hidden">
      <div className="container-custom">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-[#e6f2f9] rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <stat.icon size={24} className="text-[#0E6FA3]" />
              </motion.div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={stat.value} inView={inView} />
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
