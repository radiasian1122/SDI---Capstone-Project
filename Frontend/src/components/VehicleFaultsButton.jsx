import { useState, useEffect, useRef } from "react";
import Popover from "./Popover";

export default function VehicleFaultsButton({
  vehicle,
  buttonText = "View Vehicle Faults",
  buttonClassName = "btn btn-secondary btn-pill",
  disabled = false
}) {
  const [openFaults, setOpenFaults] = useState(false);
  const [vehicleFaults, setVehicleFaults] = useState([]);
  const faultsBtnRef = useRef(null);
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

  return (
    <>
      <button
        ref={faultsBtnRef}
        type="button"
        className={buttonClassName}
        onClick={() => setOpenFaults((v) => !v)}
        disabled={disabled || !vehicle}
      >
        {buttonText}
      </button>
      <Popover
        anchorRef={faultsBtnRef}
        open={openFaults}
        onClose={() => setOpenFaults(false)}
      >
        <div className="popover-body bg-white rounded-lg shadow-lg p-4 min-w-[260px] max-w-[350px] border border-gray-200">
          <div className="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
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
      </Popover>
    </>
  );
}