import React, { useMemo, useRef, useState } from "react";
import Popover from "./Popover";

export default function SelectPopover({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  buttonClassName = "btn-secondary",
  disabled = false,
}) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);

  const map = useMemo(() => new Map(options.map((o) => [String(o.value), o])), [options]);
  const label = map.get(String(value))?.label || placeholder;

  const select = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={buttonClassName}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body">
          <div role="listbox" aria-activedescendant={String(value)} style={{ maxHeight: 280 }}>
            {options.length ? (
              options.map((o) => (
                <button
                  key={String(o.value)}
                  role="option"
                  aria-selected={String(value) === String(o.value)}
                  className="btn btn-ghost"
                  style={{ display: "block", width: "100%", textAlign: "left" }}
                  onClick={() => select(o.value)}
                >
                  {o.label}
                </button>
              ))
            ) : (
              <div className="text-sm text-text/70">No options</div>
            )}
          </div>
        </div>
      </Popover>
    </>
  );
}

