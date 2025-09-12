import React from "react";
import SelectedVehicleRow from "./SelectedVehicleRow";

export default function SelectedVehiclesList({
  selectedVehicleIds,
  vehicles,
  getEligibleDrivers,
  driverByVehicle,
  setDriverByVehicle,
  onRemoveVehicle,
  errors,
}) {
  return (
    <div className="space-y-2">
      {selectedVehicleIds.map((id) => {
        const vehicle = vehicles.find((x) => x.id === id);
        const drivers = getEligibleDrivers(id);
        return (
          <SelectedVehicleRow
            key={id}
            vehicle={vehicle}
            drivers={drivers}
            value={driverByVehicle[id] || ""}
            onChange={(val) => setDriverByVehicle((prev) => ({ ...prev, [id]: Number(val) }))}
            onRemove={() => onRemoveVehicle(id)}
            error={errors?.[`driver_${id}`]}
          />
        );
      })}
    </div>
  );
}

