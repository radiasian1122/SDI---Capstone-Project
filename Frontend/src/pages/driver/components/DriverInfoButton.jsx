import React, { useRef, useState } from "react";
import Popover from "../../../components/Popover";

export default function DriverInfoButton({ value, options }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const u = options.find((o) => String(o.dod_id) === String(value));
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="btn btn-ghost btn-icon"
        aria-label="Driver details"
        onClick={() => setOpen((v) => !v)}
        disabled={!value}
      >
        i
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body text-sm">
          {u ? (
            <div>
              <div className="font-semibold mb-1">
                {u.first_name} {u.last_name}
              </div>
              <div className="text-text/70">DOD: {u.dod_id}</div>
              <div className="text-text/70">UIC: {u.uic || "—"}</div>
            </div>
          ) : (
            <em>No driver selected</em>
          )}
        </div>
      </Popover>
    </>
  );
}

