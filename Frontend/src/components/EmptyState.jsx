import React from "react";

export default function EmptyState({ title = "No items to show.", children }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="badge" style={{ marginBottom: 6 }}>
          Empty
        </div>
        <div className="text-muted">{title}</div>
        {children}
      </div>
    </div>
  );
}
