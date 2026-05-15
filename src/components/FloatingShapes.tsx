"use client";

import { motion } from "framer-motion";

interface FloatingShapesProps {
  count?: number;
  color?: string;
  className?: string;
}

export default function FloatingShapes({ count = 3, color = "#1195db", className = "" }: FloatingShapesProps) {
  // Deterministic pseudo-random values (no Math.random) to avoid SSR hydration mismatch
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 50 + ((i * 37) % 70),
    x: 10 + ((i * 53) % 80),
    y: 15 + ((i * 71) % 70),
    duration: 16 + ((i * 13) % 14),
    delay: i * 2,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full opacity-[0.03]"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: color,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
