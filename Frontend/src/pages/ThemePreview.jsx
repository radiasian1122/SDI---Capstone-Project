import ThemeToggle from "../components/ThemeToggle";
import React, { useRef, useState } from "react";
import Popover from "../components/Popover";

// (dev only)

import DevRoleSwitcher from "../components/DevRoleSwitcher";

const SWATCHES = [
  { name: "brand", varName: "--color-brand" },
  { name: "accent", varName: "--color-accent" },
  { name: "success", varName: "--color-success" },
  { name: "warning", varName: "--color-warning" },
  { name: "danger", varName: "--color-danger" },
  { name: "info", varName: "--color-info" },
  { name: "out", varName: "--color-out" },
  { name: "returned", varName: "--color-returned" },
  { name: "maint", varName: "--color-maint" },
  { name: "closed", varName: "--color-closed" },
  { name: "surface", varName: "--color-surface" },
  { name: "surface-muted", varName: "--color-surface-muted" },
  { name: "surface-contrast", varName: "--color-surface-contrast" },
  { name: "border", varName: "--color-border", isBorder: true },
  { name: "text", varName: "--color-text", isText: true },
];
export default function ThemePreview() {
  const statuses = [
    "PENDING",
    "APPROVED",
    "DENIED",
    "DISPATCHED",
    "OUT",
    "RETURNED",
    "MAINTENANCE",
    "CLOSED",
  ];

  return (
    <div className="cc-page space-y-8">
      <div className="flex items-center gap-2">
        <ThemeToggle />{" "}
      </div>

      <header>
        <h1 className="cc-page-title">Convoy Connect — Theme Preview</h1>
        <p className="text-sm text-text/70">Tokens & components QA</p>
      </header>
      <div
        style={{
          background: "var(--color-surface-muted)",
          color: "var(--color-text)",
          padding: 16,
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
        }}
      >
        If you can read this on a light gray panel, tokens are working.
      </div>
      {/* Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SWATCHES.map((s) => {
            const baseStyle = s.isBorder
              ? {
                  background: "var(--color-surface)",
                  border: `2px solid var(${s.varName})`,
                }
              : s.isText
                ? {
                    background: "var(--color-surface)",
                    color: `var(${s.varName})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }
                : { background: `var(${s.varName})` };
            return (
              <div key={s.name} className="card">
                <div className="card-body">
                  <div className="w-full h-12 rounded" style={baseStyle}>
                    {s.isText ? "Aa" : null}
                  </div>
                  <p className="mt-2 text-sm">{s.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">Primary</button>
          <button className="btn-secondary">Secondary</button>
          <button className="btn-ghost">Ghost</button>
          <button className="btn-danger">Danger</button>
          <button className="btn-primary btn-pill">Pill</button>
          <button className="btn-secondary btn-icon" aria-label="icon">
            ☆
          </button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Badges / Status</h2>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <span key={s} className={`state-${s}`}>
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Card title</h3>
              <p className="card-subtitle">Subtitle or helper text</p>
              <p className="mt-2">Body content inside a card.</p>
            </div>
          </div>
          <div className="card" style={{ borderRadius: "var(--radius-2)" }}>
            <div className="card-body">
              <h3 className="card-title">Pill Card</h3>
              <p>Full rounded corners example</p>
            </div>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Forms</h2>
        <form className="space-y-4 max-w-md">
          <div>
            <label htmlFor="dest" className="label required">
              Destination
            </label>
            <input
              id="dest"
              className="input"
              placeholder="e.g., Fort Liberty"
            />
            <p className="help">Example helper text</p>
          </div>
          <div>
            <label htmlFor="purpose" className="label">
              Purpose <span className="text-text/70">(Optional)</span>
            </label>
            <textarea id="purpose" className="input" rows={3}></textarea>
            <p className="error">This field is required</p>
          </div>
          <div className="cc-actionbar">
            <button type="button" className="btn-secondary">
              Cancel
            </button>
            <div className="cc-spacer" />
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </div>
          <div className="cc-sticky-pad" />
        </form>
      </section>

      {/* Tables */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tables</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="th th-sortable">Vehicle</th>
                <th className="th th-sortable">Driver</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="tr tr-striped row-hover">
                  <td className="td px-4 py-2">HMMWV {i}</td>
                  <td className="td px-4 py-2">Driver {i}</td>
                  <td className="td px-4 py-2">
                    <span className="state-PENDING">PENDING</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Toast (example)</h2>
        <div className="toast-wrap">
          <div className="toast">This is a toast notification</div>
        </div>
      </section>

      {/* Popover */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Popover</h2>
        <PopoverDemo />
      </section>
    </div>
  );
}

function PopoverDemo() {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        ref={btnRef}
        className="btn-secondary"
        onClick={() => setOpen((v) => !v)}
      >
        Toggle popover
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body">
          <div className="font-semibold">Example Popover</div>
          <div className="text-sm">
            This positions relative to the trigger and closes on outside click
            or navigation.
          </div>
        </div>
      </Popover>
    </div>
  );
}
