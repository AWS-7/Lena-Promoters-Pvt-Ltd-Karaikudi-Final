"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, Percent, Calendar, PieChart } from "lucide-react";

function formatCurrency(num: number) {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`;
  return `₹ ${num.toLocaleString("en-IN")}`;
}

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(10);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;

    if (r === 0) {
      const emi = P / n;
      return { emi, totalInterest: 0, totalAmount: P };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    return { emi, totalInterest, totalAmount };
  }, [amount, rate, years]);

  const principalPercent = (amount / totalAmount) * 100;
  const interestPercent = (totalInterest / totalAmount) * 100;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#1195db]/3 rounded-full -translate-y-1/2" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-[#1195db]/10 text-[#1195db] font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Calculator size={14} />
            Plan Your Budget
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">
            Smart EMI Calculator
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Calculate your monthly EMI for plot and home loans instantly. Plan your investment with confidence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
          >
            <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-[#1195db]" />
              Loan Details
            </h3>

            {/* Loan Amount */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-[#1195db]" />
                  Loan Amount
                </span>
                <span className="text-[#1195db] font-bold">{formatCurrency(amount)}</span>
              </label>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-[#1195db] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹ 1 Lakh</span>
                <span>₹ 50 Lakh</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Percent size={14} className="text-[#1195db]" />
                  Interest Rate (p.a.)
                </span>
                <span className="text-[#1195db] font-bold">{rate}%</span>
              </label>
              <input
                type="range"
                min={5}
                max={20}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#1195db] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="mb-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#1195db]" />
                  Loan Tenure
                </span>
                <span className="text-[#1195db] font-bold">{years} Years</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-[#1195db] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* EMI Card */}
            <div className="bg-gradient-to-br from-[#1195db] to-[#0a5480] rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="text-sm font-medium text-white/80 mb-1">Monthly EMI</div>
              <div className="text-3xl md:text-4xl font-black">{formatCurrency(emi)}</div>
              <div className="text-sm text-white/70 mt-1">per month for {years * 12} months</div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Interest</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <PieChart size={18} className="text-[#1195db]" />
                Payment Breakdown
              </h4>

              {/* Bar */}
              <div className="flex h-4 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${principalPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-[#1195db]"
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${interestPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-[#f59e0b]"
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#1195db]" />
                  <span className="text-gray-600">Principal</span>
                  <span className="font-bold text-gray-900">{principalPercent.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#f59e0b]" />
                  <span className="text-gray-600">Interest</span>
                  <span className="font-bold text-gray-900">{interestPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
