import React from "react";

// Usage: <StatusBadge status="PENDING" />
export default function StatusBadge({ status }) {
  const s = (status || "PENDING").toUpperCase();
  return <span className={`badge state-${s}`}>{s}</span>;
}
