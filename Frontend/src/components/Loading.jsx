import React from "react";

export default function Loading({ label = "Loading…" }) {
  return (
    <div className="cc-page" role="status" aria-live="polite">
      <div className="card">
        <div
          className="card-body"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <div className="cc-spinner" />
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}
