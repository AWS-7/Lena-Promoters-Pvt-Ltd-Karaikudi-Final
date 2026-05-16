"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Maximize, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProjectPlot } from "@/lib/types";

const statusColors: Record<string, string> = {
  available: "bg-green-500",
  sold: "bg-red-500",
  reserved: "bg-amber-500",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  reserved: "Reserved",
};

export default function LayoutMap() {
  const [plots, setPlots] = useState<ProjectPlot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<ProjectPlot | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    supabase
      .from("project_plots")
      .select("*")
      .then(({ data }) => {
        if (data) setPlots(data);
        else {
          // Fallback demo plots
          setPlots([
            { id: "1", layout_id: "1", plot_number: "P-101", x: 10, y: 10, width: 80, height: 60, sqft: 1200, facing: "East", price: "8.5 Lakhs", status: "available" },
            { id: "2", layout_id: "1", plot_number: "P-102", x: 110, y: 10, width: 80, height: 60, sqft: 1200, facing: "East", price: "8.5 Lakhs", status: "sold" },
            { id: "3", layout_id: "1", plot_number: "P-103", x: 210, y: 10, width: 80, height: 60, sqft: 1200, facing: "East", price: "8.5 Lakhs", status: "available" },
            { id: "4", layout_id: "1", plot_number: "P-104", x: 310, y: 10, width: 80, height: 60, sqft: 1200, facing: "East", price: "8.5 Lakhs", status: "reserved" },
            { id: "5", layout_id: "1", plot_number: "P-201", x: 10, y: 90, width: 80, height: 60, sqft: 1500, facing: "North", price: "10.5 Lakhs", status: "available" },
            { id: "6", layout_id: "1", plot_number: "P-202", x: 110, y: 90, width: 80, height: 60, sqft: 1500, facing: "North", price: "10.5 Lakhs", status: "available" },
            { id: "7", layout_id: "1", plot_number: "P-203", x: 210, y: 90, width: 80, height: 60, sqft: 1500, facing: "North", price: "10.5 Lakhs", status: "sold" },
            { id: "8", layout_id: "1", plot_number: "P-204", x: 310, y: 90, width: 80, height: 60, sqft: 1500, facing: "North", price: "10.5 Lakhs", status: "available" },
          ] as any);
        }
      });
  }, []);

  const filteredPlots = filter ? plots.filter((p) => p.status === filter) : plots;
  const counts = {
    available: plots.filter((p) => p.status === "available").length,
    sold: plots.filter((p) => p.status === "sold").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[#0E6FA3] font-semibold text-sm uppercase tracking-wider">Interactive Map</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Plot Layout Map</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Explore available plots interactively. Click on any plot to view details and enquire.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "" ? "bg-[#0E6FA3] text-white" : "bg-white text-gray-600 border hover:border-[#0E6FA3]"
            }`}
          >
            All Plots ({plots.length})
          </button>
          {Object.entries(counts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? "" : status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === status ? "bg-[#0E6FA3] text-white" : "bg-white text-gray-600 border hover:border-[#0E6FA3]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
              {statusLabels[status]} ({count})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-8 overflow-x-auto">
          <div className="relative bg-gray-100 rounded-xl" style={{ minWidth: "400px", minHeight: "200px" }}>
            <svg viewBox="0 0 420 170" className="w-full h-auto">
              <rect x="0" y="0" width="420" height="170" fill="#f3f4f6" rx="8" />
              {/* Road */}
              <rect x="0" y="75" width="420" height="16" fill="#d1d5db" />
              <text x="210" y="87" textAnchor="middle" fill="#6b7280" fontSize="8">Main Road</text>

              {/* Entrance */}
              <rect x="195" y="91" width="30" height="4" fill="#0E6FA3" rx="2" />

              {filteredPlots.map((plot) => (
                <g
                  key={plot.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPlot(plot)}
                >
                  <rect
                    x={plot.x}
                    y={plot.y}
                    width={plot.width}
                    height={plot.height}
                    className={`${statusColors[plot.status]} opacity-80 hover:opacity-100 transition-opacity`}
                    rx="4"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={plot.x + plot.width / 2}
                    y={plot.y + plot.height / 2 - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {plot.plot_number}
                  </text>
                  <text
                    x={plot.x + plot.width / 2}
                    y={plot.y + plot.height / 2 + 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                  >
                    {plot.sqft} sqft
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {selectedPlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl border shadow-sm p-6 max-w-lg mx-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Plot {selectedPlot.plot_number}</h3>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                  selectedPlot.status === "available" ? "bg-green-50 text-green-600" :
                  selectedPlot.status === "sold" ? "bg-red-50 text-red-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {statusLabels[selectedPlot.status]}
                </span>
              </div>
              <button onClick={() => setSelectedPlot(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Area</div>
                <div className="font-semibold text-gray-900">{selectedPlot.sqft} sqft</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Facing</div>
                <div className="font-semibold text-gray-900">{selectedPlot.facing}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Price</div>
                <div className="font-semibold text-[#0E6FA3]">{selectedPlot.price}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-semibold text-gray-900">{statusLabels[selectedPlot.status]}</div>
              </div>
            </div>
            {selectedPlot.image_url && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Plot Image</div>
                <img
                  src={selectedPlot.image_url}
                  alt={`Plot ${selectedPlot.plot_number}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {selectedPlot.status === "available" && (
              <a
                href="#contact"
                onClick={() => setSelectedPlot(null)}
                className="block w-full text-center rounded-lg bg-[#0E6FA3] text-white py-2.5 text-sm font-medium hover:bg-[#0a5480] transition-colors"
              >
                Enquire About This Plot
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
