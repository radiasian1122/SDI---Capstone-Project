import React from "react";
import StatusBadge from "./StatusBadge";

export default function RequestCard({ item }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <strong>{item.destination}</strong>
          <StatusBadge status={item.status} />
        </div>
        <div className="text-muted text-[13px] mt-1">
          {new Date(item.start_time).toLocaleString()} →{" "}
          {new Date(item.end_time).toLocaleString()}
        </div>
        {item.purpose && <div className="text-[13px] mt-1">{item.purpose}</div>}
      </div>
    </div>
  );
}
