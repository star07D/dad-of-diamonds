"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Fades + rises its children into view. Content already on screen at mount
 * appears immediately; content further down reveals as it's scrolled to.
 * No-ops (immediately visible) under prefers-reduced-motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  as?: ElementType;
  /** stagger, in ms */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Under reduced motion the hiding CSS is off — content is already visible.
    if (reduced) return;

    // Already within (or above) the viewport: reveal right away.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(el);

    // Safety net: never leave content hidden if the observer doesn't fire.
    const fallback = window.setTimeout(() => setVisible(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={visible ? "" : undefined}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
