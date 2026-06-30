"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "-40px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dir = {
    up: { transform: `translate3d(0, ${distance}px, 0)` },
    down: { transform: `translate3d(0, -${distance}px, 0)` },
    left: { transform: `translate3d(${distance}px, 0, 0)` },
    right: { transform: `translate3d(-${distance}px, 0, 0)` },
  };

  return (
    <div
      ref={ref}
      className={className}
      onTransitionEnd={() => {
        if (isVisible) setHasAnimated(true);
      }}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        transform: isVisible ? "translate3d(0, 0, 0)" : dir[direction].transform,
        willChange: hasAnimated ? "auto" : isVisible ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}
