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
  fm5988ByVehicle,
  setFm5988ByVehicle,
}) {
  return (
    <div className="space-y-4">
      {selectedVehicleIds.map((id) => {
        const vehicle = vehicles.find((x) => x.id === id);
        const drivers = getEligibleDrivers(id);
        const fm5988 = fm5988ByVehicle?.[id] || {};
        return (
          <SelectedVehicleRow
            key={id}
            vehicle={vehicle}
            drivers={drivers}
            value={driverByVehicle[id] || ""}
            onChange={(val) => setDriverByVehicle((prev) => ({ ...prev, [id]: Number(val) }))}
            onRemove={() => onRemoveVehicle(id)}
            error={errors?.[`driver_${id}`]}
            fm5988={fm5988}
            onChangeFm5988={(next) => setFm5988ByVehicle((prev) => ({ ...prev, [id]: next }))}
          />
        );
      })}
    </div>
  );
}
