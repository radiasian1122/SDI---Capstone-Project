import React, { useEffect, useRef, useState } from "react";

export default function BackgroundMedia({
  mp4Src,
  gifSrc,
  posterSrc,
  overlay = true,
  className = "",
  mediaClassName = "",
  children,
}) {
  const videoRef = useRef(null);
  const [useVideo, setUseVideo] = useState(!!mp4Src);

  useEffect(() => {
    if (!mp4Src) return setUseVideo(false);

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefersReduced) {
      setUseVideo(false);
      return;
    }

    const tryPlay = async () => {
      try {
        await videoRef.current?.play();
      } catch {
        setUseVideo(false);
      }
    };
    // attempt autoplay when ready
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("canplay", tryPlay, { once: true });

    return () => v?.removeEventListener("canplay", tryPlay);
  }, [mp4Src]);

  return (
    <div className={`bgmedia ${className}`}>
      {/* Media layer */}
      {useVideo ? (
        <video
          ref={videoRef}
          className={`bgmedia-media ${mediaClassName}`}
          src={mp4Src}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <img
          className={`bgmedia-media ${mediaClassName}`}
          src={gifSrc || posterSrc}
          alt=""
          onError={(e) => {
            if (posterSrc && e.currentTarget.src !== posterSrc) {
              e.currentTarget.src = posterSrc;
            }
          }}
        />
      )}

      {/* Overlay */}
      {overlay === true && (
        <div className="bgmedia-overlay" aria-hidden="true" />
      )}
      {overlay !== true && overlay}

      {/* Foreground slot */}
      <div className="bgmedia-foreground">{children}</div>
    </div>
  );
}
