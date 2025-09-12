import React, { useRef, useState } from "react";
import Popover from "../../../components/Popover";

export default function VehicleInfoButton({ vehicle }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  if (!vehicle)
    return (
      <button className="btn btn-ghost btn-icon" disabled aria-label="Vehicle details">
        i
      </button>
    );
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="btn btn-ghost btn-icon"
        aria-label="Vehicle details"
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body text-sm">
          <div className="grid gap-1">
            <div>
              <strong>Company:</strong> {vehicle.company || vehicle.uic?.slice(4, 5) || "—"}
            </div>
            <div>
              <strong>Vehicle:</strong> {vehicle.bumper_no || "—"}
            </div>
            <div className="flex items-center gap-1">
              <strong>Status:</strong> <span className={`badge state-${vehicle.status}`}>{vehicle.status}</span>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

