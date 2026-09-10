"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Fades + rises its children into view once, when scrolled near the viewport.
 * No-ops (renders children immediately visible) when the user prefers reduced
 * motion or IntersectionObserver is unavailable.
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
    // With reduced motion the hiding CSS is disabled, so content is already
    // visible — nothing to observe. Only force it on when IO is missing.
    if (reduced) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability fallback
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

    // Safety net: never leave content hidden if the observer somehow doesn't fire.
    const fallback = window.setTimeout(() => setVisible(true), 3000);

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
