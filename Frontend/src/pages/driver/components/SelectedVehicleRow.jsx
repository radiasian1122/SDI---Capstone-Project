import React from "react";
import DriverInfoButton from "./DriverInfoButton";

export default function SelectedVehicleRow({ vehicle, drivers, value, onChange, onRemove, error }) {
  return (
    <div className="card">
      <div className="card-body flex items-center gap-3">
        <div className="badge">{vehicle ? `${vehicle.name} • ${vehicle.type}` : `Vehicle`}</div>
        <div className="flex-1">
          {drivers.length ? (
            <div className="flex items-center gap-2">
              <select
                className="input"
                value={value || ""}
                onChange={(e) => onChange(Number(e.target.value))}
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
            <div className="text-danger text-sm">No qualified drivers available for this vehicle.</div>
          )}
          {error && <p className="error">{error}</p>}
        </div>
        <button type="button" className="btn btn-danger" onClick={onRemove} aria-label={`Remove vehicle`}>
          Remove
        </button>
      </div>
    </div>
  );
}
