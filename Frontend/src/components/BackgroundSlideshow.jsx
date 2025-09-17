import React, { useEffect, useMemo, useState } from "react";

export default function BackgroundSlideshow({
  images = [],
  intervalMs = 6000,
  fadeMs = 800,
  dim = 0.25,
}) {
  const urls = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (urls.length <= 1) return; // no need to animate
    const id = setInterval(() => {
      setPrev((p) => (p + 1) % urls.length);
      setIdx((i) => (i + 1) % urls.length);
      setFading(true);
      const t = setTimeout(() => setFading(false), fadeMs);
      return () => clearTimeout(t);
    }, intervalMs);
    return () => clearInterval(id);
  }, [urls.length, intervalMs, fadeMs]);

  if (!urls.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -3,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {[urls[prev] ?? urls[0], urls[idx] ?? urls[0]].map((src, k) => (
        <img
          key={`${src}-${k}-${idx}`}
          src={src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: `opacity ${fadeMs}ms ease-in-out`,
            opacity: k === 0 ? (fading ? 1 : 0) : 1,
            filter: "brightness(0.85)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${dim})`,
        }}
      />
    </div>
  );
}

