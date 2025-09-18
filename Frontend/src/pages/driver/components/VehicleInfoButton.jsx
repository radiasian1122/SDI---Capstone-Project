import React, { useRef, useState, useEffect } from "react";
import Popover from "../../../components/Popover";

export default function VehicleInfoButton({ vehicle }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [vehicleFaults, setVehicleFaults] = useState([]);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (vehicle) {
      fetch(`${api_url}/faults/${vehicle.id}`)
        .then((res) => res.json())
        .then((data) => {
          setVehicleFaults(data);
        })
        .catch((err) => console.error(err.message));
    } else {
      setVehicleFaults([]);
    }
  }, [vehicle, api_url]);
  if (!vehicle)
    return (
      <button
        className="btn btn-ghost btn-icon"
        disabled
        aria-label="Vehicle details"
      >
        Info
      </button>
    );
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="btn btn-ghost btn-icon"
        aria-label="Vehicle details"
        onClick={() => setOpen((v) => !v)}
      >
        Info
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)} usePortal={true}>
        <div className="popover-body bg-white rounded-lg shadow-lg p-4 min-w-[280px] max-w-[400px] border border-gray-200">
          <div className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
            Vehicle Information
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            {/* Vehicle Details */}
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Vehicle:</span>{" "}
                {vehicle.bumper_no || "—"}
              </div>
              <div>
                <span className="font-medium">Type:</span> {vehicle.type || "—"}
              </div>
              <div>
                <span className="font-medium">Company:</span>{" "}
                {vehicle.company || vehicle.uic?.slice(4, 5) || "—"}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`badge ${vehicle.status === "FMC" ? "state-FMC" : "state-DEADLINED"}`}
                >
                  {vehicle.status || "PENDING"}
                </span>
              </div>
            </div>

            {/* Vehicle Faults Section */}
            <div className="border-t pt-3 mt-3">
              <div className="font-bold text-base mb-2 text-gray-800 flex items-center gap-2">
                <span role="img" aria-label="warning">
                  🚧
                </span>{" "}
                Vehicle Faults
              </div>
              <div className="text-sm text-gray-700">
                {vehicleFaults.length ? (
                  <ul className="space-y-3">
                    {vehicleFaults.map((fault, idx) => (
                      <li
                        key={fault.fault_id || idx}
                        className="bg-red-50 border border-red-200 rounded p-2"
                      >
                        <div className="font-semibold text-red-800 mb-1">
                          Fault #{fault.fault_id}
                        </div>
                        <div className="text-xs space-y-1 text-gray-700">
                          {fault.fault_date && (
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                fault.fault_date
                              ).toLocaleDateString()}
                            </div>
                          )}
                          {fault.fault_code && (
                            <div>
                              <span className="font-medium">Code:</span>{" "}
                              {fault.fault_code}
                            </div>
                          )}
                          {fault.fault_description && (
                            <div>
                              <span className="font-medium">
                                Description:
                              </span>{" "}
                              {fault.fault_description}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-green-700 font-semibold flex items-center gap-1">
                    <span role="img" aria-label="check">
                      ✅
                    </span>{" "}
                    No faults reported
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}
