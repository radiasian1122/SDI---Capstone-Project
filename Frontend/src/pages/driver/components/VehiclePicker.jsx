import React from "react";
import VehicleInfoButton from "./VehicleInfoButton";

export default function VehiclePicker({ availableVehicles, value, onChange, onAdd }) {
  const current = availableVehicles.find((v) => String(v.id) === String(value));
  return (
    <div className="flex gap-2 items-center">
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select available vehicle…</option>
        {availableVehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-secondary" onClick={onAdd} disabled={!value}>
        Add
      </button>
      <VehicleInfoButton vehicle={current} />
    </div>
  );
}
