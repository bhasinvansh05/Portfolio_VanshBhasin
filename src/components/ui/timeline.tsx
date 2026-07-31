"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

function offsetsEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 0.5) return false;
  }
  return true;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const nodeOffsetsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(-1);
  const heightRef = useRef(0);

  // Beam fill driven via transforms only — never mutates layout height on scroll.
  const progress = useMotionValue(0);
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 0.01], [0, 1]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateMetrics = () => {
      const rows = el.querySelectorAll<HTMLElement>("[data-timeline-item]");

      // Layout offsets only — sticky visual positions must not affect this.
      const offsets = Array.from(rows).map((row) => {
        const paddingTop = parseFloat(getComputedStyle(row).paddingTop) || 0;
        const dot = row.querySelector<HTMLElement>("[data-timeline-dot]");
        const dotCenter = dot ? dot.offsetHeight / 2 : 18;
        return row.offsetTop + paddingTop + dotCenter;
      });

      const nextHeight = offsets.length
        ? offsets[offsets.length - 1]
        : el.offsetHeight;

      if (!offsetsEqual(nodeOffsetsRef.current, offsets)) {
        nodeOffsetsRef.current = offsets;
      }

      if (Math.abs(heightRef.current - nextHeight) >= 0.5) {
        heightRef.current = nextHeight;
        setHeight(nextHeight);
      }
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

  useEffect(() => {
    const el = ref.current;
    if (!el || height <= 0) return;

    let frame = 0;

    const sync = () => {
      frame = 0;
      const parentRect = el.getBoundingClientRect();
      const viewportCentre = window.innerHeight * 0.5;
      const fillTo = viewportCentre - parentRect.top;
      const next = Math.max(0, Math.min(1, fillTo / height));
      progress.set(next);

      const offsets = nodeOffsetsRef.current;
      let nextIndex = -1;
      const fillPx = next * height;
      for (let i = 0; i < offsets.length; i++) {
        if (fillPx >= offsets[i] - 4) nextIndex = i;
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [height, progress]);

  return (
    <div className="w-full font-sans px-2 sm:px-4 md:px-8">
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
                  data-timeline-dot
                  className={cn(
                    // Fixed size — only color/glow change, no layout shift
                    "h-8 sm:h-10 absolute left-2 sm:left-3 w-8 sm:w-10 rounded-full flex items-center justify-center border transition-[background-color,border-color,box-shadow] duration-300",
                    isLit
                      ? "bg-white/10 border-white/50 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
                      : "bg-background/80 border-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full transition-[background-color,box-shadow] duration-300",
                      isLit
                        ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]"
                        : "bg-neutral-600",
                      isCurrent && "animate-pulse"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "hidden md:block text-lg md:pl-20 md:text-3xl lg:text-4xl font-bold transition-colors duration-300",
                    isLit ? "text-neutral-200" : "text-neutral-600"
                  )}
                >
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-14 sm:pl-20 pr-2 sm:pr-4 md:pl-4 w-full min-w-0">
                <h3
                  className={cn(
                    "md:hidden block text-base sm:text-xl mb-3 sm:mb-4 text-left font-bold transition-colors duration-300",
                    isLit ? "text-neutral-200" : "text-neutral-600"
                  )}
                >
                  {item.title}
                </h3>
                <div
                  className={cn(
                    "transition-opacity duration-300",
                    isLit ? "opacity-100" : "opacity-55"
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}

        <div
          style={{ height: height || undefined }}
          className="absolute left-6 sm:left-8 top-0 w-8 sm:w-10 -translate-x-1/2 overflow-hidden pointer-events-none"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
          <motion.div
            style={{
              scaleY,
              opacity,
              transformOrigin: "top",
            }}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-400 will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};
