import React from "react";
import VehicleInfoButton from "./VehicleInfoButton";

export default function VehiclePicker({
  availableVehicles,
  value,
  onChange,
  onAdd,
}) {
  const current = availableVehicles.find((v) => String(v.id) === String(value));
  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: "#fff",
          color: "#111827",
          flex: "1 1 260px",
          minWidth: 220,
        }}
      >
        <option value="">Select available vehicle…</option>
        {availableVehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onAdd}
        disabled={!value}
      >
        Add
      </button>
      <VehicleInfoButton vehicle={current} />
    </div>
  );
}
