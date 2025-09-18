import React, { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import VehicleFaultsButton from "./VehicleFaultsButton";

export default function ReadinessDashboard({ vehicles, vehicleFaults }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const deadlinedVehicles = vehicles.filter((v) => v.deadlined);
    const fmcVehicles = vehicles.filter((v) => !v.deadlined);

    const fmcPercentage =
      totalVehicles > 0
        ? Math.round((fmcVehicles.length / totalVehicles) * 100)
        : 0;
    const deadlinedPercentage =
      totalVehicles > 0
        ? Math.round((deadlinedVehicles.length / totalVehicles) * 100)
        : 0;

    const totalFaults = vehicleFaults.reduce(
      (sum, vf) => sum + vf.faults.length,
      0
    );

    const deadlinedWithFaultCounts = deadlinedVehicles.map((vehicle) => {
      const vehicleFaultData = vehicleFaults.find(
        (vf) => vf.vehicle_id === vehicle.vehicle_id
      );
      const faultCount = vehicleFaultData ? vehicleFaultData.faults.length : 0;
      return { ...vehicle, faultCount };
    });

    const quickWins = deadlinedWithFaultCounts.filter(
      (v) => v.faultCount <= 2
    ).length;
    const restorationPotential = quickWins;

    return {
      totalVehicles,
      fmcCount: fmcVehicles.length,
      deadlinedCount: deadlinedVehicles.length,
      fmcPercentage,
      deadlinedPercentage,
      totalFaults,
      quickWins,
      restorationPotential,
      deadlinedWithFaultCounts,
    };
  }, [vehicles, vehicleFaults]);

  const prioritizedRepairs = useMemo(() => {
    return metrics.deadlinedWithFaultCounts
      .sort((a, b) => {
        if (a.faultCount !== b.faultCount) {
          return a.faultCount - b.faultCount;
        }
        return a.bumper_no.localeCompare(b.bumper_no);
      })
      .slice(0, 10);
  }, [metrics.deadlinedWithFaultCounts]);

  return (
    <div className="card">
      <div className="card-body space-y-6">
        <h2 className="card-title text-xl">Motorpool Readiness Status</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Readiness</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-red-500 rounded-full h-6 relative">
                  <div
                    className="bg-green-600 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium absolute left-0 top-0"
                    style={{ width: `${metrics.fmcPercentage}%` }}
                  >
                    {metrics.fmcPercentage}% FMC
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 ml-2">
                {metrics.fmcCount} / {metrics.totalVehicles}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.fmcCount}
                  </div>
                  <div className="text-sm text-gray-600">FMC Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {metrics.deadlinedCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Deadlined Vehicles
                  </div>
                </div>
              </div>

              {/* Fault Distribution Summary */}
              <div className="text-center">
                <div className="inline-flex gap-6 text-sm">
                  <span>
                    <span className="font-semibold text-green-600">
                      {
                        metrics.deadlinedWithFaultCounts.filter(
                          (v) => v.faultCount === 1
                        ).length
                      }
                    </span>{" "}
                    with 1 fault
                  </span>
                  <span>
                    <span className="font-semibold text-yellow-600">
                      {
                        metrics.deadlinedWithFaultCounts.filter(
                          (v) => v.faultCount === 2
                        ).length
                      }
                    </span>{" "}
                    with 2 faults
                  </span>
                  <span>
                    <span className="font-semibold text-red-600">
                      {
                        metrics.deadlinedWithFaultCounts.filter(
                          (v) => v.faultCount >= 3
                        ).length
                      }
                    </span>{" "}
                    with 3+ faults
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Suggested Priority of Repair
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Vehicles sorted by number of faults.
              </p>

              {prioritizedRepairs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="thead">
                      <tr>
                        <th className="th text-center">Priority</th>
                        <th className="th text-center">Vehicle</th>
                        <th className="th text-center">Company</th>
                        <th className="th text-center">Faults</th>
                        <th className="th text-center">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {prioritizedRepairs.map((vehicle, index) => (
                        <tr key={vehicle.vehicle_id} className="tr tr-striped">
                          <td className="td text-center">{index + 1}.</td>
                          <td className="td text-center font-medium">
                            {vehicle.bumper_no}
                          </td>
                          <td className="td text-center">
                            {vehicle.uic?.slice(4, 5) || "N/A"}
                          </td>
                          <td className="td text-center">
                            <VehicleFaultsButton
                              vehicle={{ id: vehicle.vehicle_id, ...vehicle }}
                              buttonText={`${vehicle.faultCount} fault${vehicle.faultCount !== 1 ? "s" : ""}`}
                              buttonClassName={`badge ${
                                vehicle.faultCount === 1
                                  ? "state-PENDING"
                                  : vehicle.faultCount === 2
                                    ? "state-APPROVED"
                                    : "state-DENIED"
                              }`}
                            />
                          </td>
                          <td className="td text-center">
                            {vehicle.faultCount <= 2 ? (
                              <span className="badge state-PENDING">FMC</span>
                            ) : (
                              <span className="badge state-DENIED">
                                DEADLINED
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No deadlined vehicles found</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show Priority Repairs"}
          </button>
        </div>
      </div>
    </div>
  );
}
