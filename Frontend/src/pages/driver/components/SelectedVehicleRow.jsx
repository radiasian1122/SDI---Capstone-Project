import React from "react";
import DriverInfoButton from "./DriverInfoButton";

//TODO Wire in fault endpoint

export default function SelectedVehicleRow({
  vehicle,
  drivers,
  value,
  onChange,
  onRemove,
  error,
  fm5988 = {},
  onChangeFm5988,
}) {
  return (
    <div className="card">
      <div className="card-body space-y-3">
        {/* Top line: Vehicle header + Driver + Remove */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold">
              {vehicle ? `${vehicle.name} • ${vehicle.type}` : `Vehicle`}
            </h3>
          </div>
          <div className="min-w-[260px]">
            <label className="label">Driver</label>
            {drivers.length ? (
              <div className="flex items-center gap-2">
                <select
                  className="input"
                  value={value || ""}
                  onChange={(e) => onChange(Number(e.target.value))}
                  style={{ backgroundColor: "#fff", color: "#111827" }}
                >
                  <option value="">Select driver…</option>
                  {drivers.map((u) => (
                    <option key={u.dod_id} value={u.dod_id}>
                      {u.first_name} {u.last_name} ({u.dod_id})
                    </option>
                  ))}
                </select>
                <DriverInfoButton value={value || ""} options={drivers} />
              </div>
            ) : (
              <div className="text-danger text-sm">No qualified drivers.</div>
            )}
            {error && <p className="error">{error}</p>}
          </div>
          <div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onRemove}
              aria-label={`Remove vehicle`}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Second line: Miles & Hours */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label" htmlFor={`miles-${vehicle?.id}`}>
              4a. Miles
            </label>
            <input
              id={`miles-${vehicle?.id}`}
              type="number"
              className="input"
              value={fm5988.miles ?? ""}
              onChange={(e) =>
                onChangeFm5988?.({
                  ...fm5988,
                  miles: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              style={{ backgroundColor: "#fff", color: "#111827" }}
            />
          </div>
          <div>
            <label className="label" htmlFor={`hours-${vehicle?.id}`}>
              b. Hours
            </label>
            <input
              id={`hours-${vehicle?.id}`}
              type="number"
              className="input"
              value={fm5988.hours ?? ""}
              onChange={(e) =>
                onChangeFm5988?.({
                  ...fm5988,
                  hours: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              style={{ backgroundColor: "#fff", color: "#111827" }}
            />
          </div>
        </div>

        {/* Third line: TM item & Status */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label" htmlFor={`tm-${vehicle?.id}`}>
              TM Item NO. a.
            </label>
            <input
              id={`tm-${vehicle?.id}`}
              className="input"
              value={fm5988.tmItemNoA ?? ""}
              onChange={(e) =>
                onChangeFm5988?.({ ...fm5988, tmItemNoA: e.target.value })
              }
              style={{ backgroundColor: "#fff", color: "#111827" }}
            />
          </div>
          <div>
            <label className="label" htmlFor={`status-${vehicle?.id}`}>
              STATUS b.
            </label>
            <input
              id={`status-${vehicle?.id}`}
              className="input"
              value={fm5988.statusB ?? ""}
              onChange={(e) =>
                onChangeFm5988?.({ ...fm5988, statusB: e.target.value })
              }
              style={{ backgroundColor: "#fff", color: "#111827" }}
            />
          </div>
        </div>

        {/* Deficiencies line (full width) */}
        <div>
          <label className="label" htmlFor={`def-${vehicle?.id}`}>
            DEFICIENCIES AND SHORTCOMINGS c.
          </label>
          <textarea
            id={`def-${vehicle?.id}`}
            className="input"
            rows={3}
            value={fm5988.deficienciesC ?? ""}
            onChange={(e) =>
              onChangeFm5988?.({ ...fm5988, deficienciesC: e.target.value })
            }
            style={{ backgroundColor: "#fff", color: "#111827" }}
          />
        </div>

        {/* Corrective Action line (full width) */}
        <div>
          <label className="label" htmlFor={`corr-${vehicle?.id}`}>
            CORRECTIVE ACTION d.
          </label>
          <textarea
            id={`corr-${vehicle?.id}`}
            className="input"
            rows={3}
            value={fm5988.correctiveActionD ?? ""}
            onChange={(e) =>
              onChangeFm5988?.({ ...fm5988, correctiveActionD: e.target.value })
            }
            style={{ backgroundColor: "#fff", color: "#111827" }}
          />
        </div>

        {/* Initial When Corrected line */}
        <div>
          <label className="label" htmlFor={`init-${vehicle?.id}`}>
            INITIAL WHEN CORRECTED e.
          </label>
          <input
            id={`init-${vehicle?.id}`}
            className="input"
            value={fm5988.initialWhenCorrectedE ?? ""}
            onChange={(e) =>
              onChangeFm5988?.({
                ...fm5988,
                initialWhenCorrectedE: e.target.value,
              })
            }
            style={{ backgroundColor: "#fff", color: "#111827" }}
          />
        </div>
      </div>
    </div>
  );
}
