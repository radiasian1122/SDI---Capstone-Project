import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Popover({ anchorRef, open, onClose, children, placement = "bottom" }) {
  const popRef = useRef(null);
  const [style, setStyle] = useState({ visibility: "hidden" });

  const computePosition = () => {
    const anchor = anchorRef?.current;
    const pop = popRef.current;
    if (!anchor || !pop) return;
    const a = anchor.getBoundingClientRect();
    const p = pop.getBoundingClientRect();
    const margin = 8;
    let top = placement === "top" ? a.top - p.height - margin : a.bottom + margin;
    let left = Math.min(Math.max(a.left, margin), window.innerWidth - p.width - margin);
    // Flip if overflow bottom
    if (placement === "bottom" && top + p.height > window.innerHeight) {
      top = a.top - p.height - margin;
    }
    // Ensure on-screen vertically
    top = Math.max(margin, Math.min(top, window.innerHeight - p.height - margin));
    setStyle({ top: `${top}px`, left: `${left}px`, visibility: "visible" });
  };

  // Position relative to viewport; recompute on open and content changes
  useLayoutEffect(() => {
    if (!open) return;
    // Next frame to ensure pop content measured
    requestAnimationFrame(computePosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorRef, placement, children]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { passive: true });
      window.removeEventListener("resize", onResize, { passive: true });
      document.removeEventListener("scroll", onScroll, { passive: true, capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside click / ESC / route change-like events
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!popRef.current) return;
      if (popRef.current.contains(e.target)) return;
      if (anchorRef?.current && anchorRef.current.contains(e.target)) return;
      onClose?.();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    const onNav = () => onClose?.();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onNav);
    window.addEventListener("hashchange", onNav);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("hashchange", onNav);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div ref={popRef} className="popover" style={{ position: "fixed", zIndex: 1000, ...style }}>
      {children}
    </div>
  );
}
