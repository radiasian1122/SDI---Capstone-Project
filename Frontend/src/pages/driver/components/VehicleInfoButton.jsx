import React, { useRef, useState, useEffect } from "react";
import Popover from "../../../components/Popover";

export default function VehicleInfoButton({ vehicle }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [vehicleFaults, setVehicleFaults] = useState([]);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (!vehicle || !open) {
      setVehicleFaults([]);
      return;
    }

    let mounted = true;
    fetch(`${api_url}/faults/${vehicle.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setVehicleFaults(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setVehicleFaults([]);
      });

    return () => {
      mounted = false;
    };
  }, [vehicle, open, api_url]);
  if (!vehicle)
    return (
      <button
        className="btn btn-ghost btn-icon"
        disabled
        aria-label="Vehicle details"
      >
        i
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
        i
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body text-sm">
          <div>
            <div className="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
              <span role="img" aria-label="warning">
                🚧
              </span>{" "}
              Vehicle Faults
            </div>
            <div className="text-sm text-gray-700">
              {vehicleFaults.length ? (
                <ul className="space-y-2">
                  {vehicleFaults.map((fault, idx) => (
                    <li
                      key={fault.fault_id || idx}
                      className="bg-red-50 border border-red-200 rounded p-2"
                    >
                      <div className="font-semibold text-red-800 mb-1">
                        Fault #{fault.fault_id || idx}
                      </div>
                      <div className="text-xs space-y-1 text-gray-700">
                        {fault.fault_date && (
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(fault.fault_date).toLocaleDateString()}
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
                            <span className="font-medium">Description:</span>{" "}
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
      </Popover>
    </>
  );
}
