import React from "react";

export default function SkeletonList({ rows = 3 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div className="skeleton skeleton-line" style={{ width: "40%" }} />
            <div className="skeleton skeleton-line" style={{ width: 80 }} />
          </div>
          <div
            className="skeleton skeleton-line"
            style={{ width: "60%", marginBottom: 6 }}
          />
          <div className="skeleton skeleton-line" style={{ width: "80%" }} />
        </div>
      ))}
    </div>
  );
}
