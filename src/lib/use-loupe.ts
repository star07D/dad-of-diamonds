"use client";

import { useCallback } from "react";

/**
 * The "jeweler's loupe" effect: a bright focus circle follows the pointer
 * while the edges dim and the image eases in. Spread the returned handlers
 * onto the element that also carries the `.cursor-light` class
 * (see globals.css). Touch pointers are ignored.
 *
 *   const loupe = useLoupe();
 *   <div className="cursor-light" {...loupe}>…</div>
 */
export function useLoupe() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.dataset.active = "";
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    delete e.currentTarget.dataset.active;
  }, []);

  return { onPointerMove, onPointerLeave };
}
