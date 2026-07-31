"use client";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [nodeOffsets, setNodeOffsets] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateMetrics = () => {
      const rows = el.querySelectorAll<HTMLElement>("[data-timeline-item]");
      const parentRect = el.getBoundingClientRect();

      const offsets = Array.from(rows).map((row) => {
        const rowRect = row.getBoundingClientRect();
        const paddingTop = parseFloat(getComputedStyle(row).paddingTop) || 0;
        // Center of the dot within each row (dot is ~32–40px tall)
        return rowRect.top + paddingTop + 18 - parentRect.top;
      });

      setNodeOffsets(offsets);
      setHeight(offsets.length ? offsets[offsets.length - 1] : el.scrollHeight);
    };

    updateMetrics();
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(el);
    window.addEventListener("resize", updateMetrics);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [data.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 30%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height || 1]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  useMotionValueEvent(heightTransform, "change", (currentHeight) => {
    if (!nodeOffsets.length) {
      setActiveIndex(-1);
      return;
    }

    let next = -1;
    for (let i = 0; i < nodeOffsets.length; i++) {
      if (currentHeight >= nodeOffsets[i] - 4) {
        next = i;
      }
    }
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Keep first/last dots in sync at the extremes even if height is slightly off
    if (progress <= 0.01) {
      setActiveIndex(-1);
      return;
    }
    if (progress >= 0.98 && nodeOffsets.length) {
      setActiveIndex(nodeOffsets.length - 1);
    }
  });

  return (
    <div className="w-full font-sans px-2 sm:px-4 md:px-8" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-8 sm:pb-12">
        {data.map((item, index) => {
          const isLit = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={index}
              data-timeline-item
              className="flex justify-start pt-8 sm:pt-12 md:pt-24 md:gap-10"
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-4 sm:top-32 md:top-36 self-start max-w-xs lg:max-w-sm md:w-full">
                <div
                  className={cn(
                    "h-8 sm:h-10 absolute left-2 sm:left-3 w-8 sm:w-10 rounded-full flex items-center justify-center border transition-all duration-500",
                    isLit
                      ? "bg-white/10 border-white/50 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
                      : "bg-background/80 border-white/10 backdrop-blur-sm"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full transition-all duration-500",
                      isLit
                        ? "h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)] scale-110"
                        : "h-2 w-2 sm:h-2.5 sm:w-2.5 bg-neutral-600 scale-100",
                      isCurrent && "animate-pulse"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "hidden md:block text-lg md:pl-20 md:text-3xl lg:text-4xl font-bold transition-colors duration-500",
                    isLit ? "text-neutral-200" : "text-neutral-600"
                  )}
                >
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-14 sm:pl-20 pr-2 sm:pr-4 md:pl-4 w-full min-w-0">
                <h3
                  className={cn(
                    "md:hidden block text-base sm:text-xl mb-3 sm:mb-4 text-left font-bold transition-colors duration-500",
                    isLit ? "text-neutral-200" : "text-neutral-600"
                  )}
                >
                  {item.title}
                </h3>
                <div
                  className={cn(
                    "transition-all duration-500",
                    isLit ? "opacity-100 translate-y-0" : "opacity-55 translate-y-1"
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-6 sm:left-8 top-0 w-8 sm:w-10 -translate-x-1/2 overflow-hidden pointer-events-none"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-400"
          />
        </div>
      </div>
    </div>
  );
};
