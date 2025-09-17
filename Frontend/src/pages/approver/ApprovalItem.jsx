import { useMemo, useRef, useState, useEffect, useContext, memo } from "react";
import StatusBadge from "../../components/StatusBadge";
import Popover from "../../components/Popover";
import { getDriverQualTypes } from "../../data/selectors";
import { ToastCtx } from "../../components/ToastProvider";

function ApprovalItem({
  row,
  users,
  vehicles,
  driverQuals,
  dispatches,
  setDispatches,
}) {
  const id = row.dispatch_id ?? row.id ?? `${row.driver_id}:${row.vehicle_id}`;
  const driver = useMemo(
    () => users.find((u) => u.dod_id === row.driver_id),
    [users, row.driver_id]
  );
  const requestor = useMemo(
    () => users.find((u) => u.dod_id === row.requestor_id),
    [users, row.requestor_id]
  );
  const vehicle = useMemo(
    () => vehicles.find((v) => v.id === row.vehicle_id),
    [vehicles, row.vehicle_id]
  );
  const qualified = Boolean(
    vehicle &&
      driver &&
      (driverQuals[driver.dod_id] || []).includes(vehicle.qual_id)
  );
  const driverQualTypes = useMemo(
    () =>
      getDriverQualTypes({ driverId: driver?.dod_id, driverQuals, vehicles }),
    [driver?.dod_id, driverQuals, vehicles]
  );

  const { showToast } = useContext(ToastCtx) || { showToast: () => {} };

  const faultsBtnRef = useRef(null);
  const qualsBtnRef = useRef(null);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [openFaults, setOpenFaults] = useState(false);
  const [openQuals, setOpenQuals] = useState(false);
  const [comment, setComment] = useState("");
  const [vehicleFaults, setVehicleFaults] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(() => {
    if (row.approved === true) return "APPROVED";
    // Only treat as DENIED if explicitly denied with comments (not a new dispatch)
    if (row.approved === false && row.comments) return "DENIED";
    return "PENDING";
  });

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

  async function handlePost(value) {
    // Require comments when denying, optional when approving
    if (!value && !comment.trim()) {
      showToast("Comments are required when denying a request", "error");
      return;
    }

    setApprovalStatus(value ? "APPROVED" : "DENIED");
    showToast(`Request ${value ? "approved" : "denied"}`);

    // Update the dispatch data immediately to show new comment
    const updatedDispatches = dispatches.map((dispatch) => {
      if (dispatch.dispatch_id === row.dispatch_id) {
        return {
          ...dispatch,
          approved: value,
          comments: comment || null,
        };
      }
      return dispatch;
    });

    // Only remove from list if approved, keep denied requests visible with updated data
    if (value) {
      const newDispatches = updatedDispatches.filter(
        (data) => data.dispatch_id !== row.dispatch_id
      );
      setTimeout(() => {
        setDispatches(newDispatches);
      }, 2000);
    } else {
      // For denied requests, update the data immediately
      setDispatches(updatedDispatches);
    }

    const post = {
      dispatch_id: row.dispatch_id,
      approved: value,
      comments: comment || null,
    };
    try {
      const res = await fetch(`${api_url}/dispatches`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      } else {
        console.log("request success!");
      }

      const data = await res.json();
      console.log("Server response:", data);

      // Clear the comment input after successful submission
      setComment("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  return (
    <div key={id} className="card">
      <div className="card-body space-y-4">
        {/* Four Column Layout with Horizontal Alignment */}
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1 - Approvers Section */}
          <div className="flex flex-col justify-between h-full">
            {/* Top Section */}
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className="text-base font-bold">Status:</span>
                <StatusBadge status={approvalStatus} />
              </div>

              {/* Requester - Level 1 */}
              <div className="text-base">
                <span className="font-bold">Requester:</span>{" "}
                {requestor
                  ? `${requestor.first_name} ${requestor.last_name}`
                  : row.requestor_id || "—"}
              </div>
            </div>

            {/* Bottom Section - Button Level */}
          </div>

          {/* Column 3 - Driver Section */}
          <div className="flex flex-col justify-between h-full">
            {/* Top Section */}
            <div className="space-y-8">
              {/* Empty div for Status level */}
              <div className="h-6"></div>

              {/* Driver - Level 1 */}
              <div className="text-base py-2">
                <span className="font-bold">Driver:</span>{" "}
                {driver
                  ? `${driver.first_name} ${driver.last_name}`
                  : row.driver_id || "—"}
              </div>


              {/* UIC - Level 2 */}
              <div className="text-base py-2">
                <span className="font-bold">UIC:</span> {driver?.uic || "—"}
              </div>

              {/* Company - Level 2 */}
              <div className="text-base py-2">
                <span className="font-bold">Company:</span>{" "}
                {driver?.uic?.slice(4, 5) || "—"}
              </div>

              {/* Driver Qualified - Level 3 */}
              <div className="flex items-center gap-3 py-2">
                <span className="text-base font-bold">Driver Qualified:</span>
                <span
                  className={`badge ${qualified ? "state-FMC" : "state-DEADLINED"}`}
                >
                  {qualified ? "Qualified" : "Not Qualified"}
                </span>
              </div>

              {/* Empty div for spacing */}
              <div className="h-6"></div>
            </div>

            {/* Bottom Section - Button Level */}
            <button
              ref={qualsBtnRef}
              type="button"
              className="btn btn-secondary btn-pill w-1/2"
              onClick={() => setOpenQuals((v) => !v)}
              disabled={!vehicle}
            >
              View Driver Quals
            </button>
            <Popover
              anchorRef={qualsBtnRef}
              open={openQuals}
              onClose={() => setOpenQuals(false)}
            >
              <div className="popover-body bg-white rounded-lg shadow-lg p-4 min-w-[260px] max-w-[350px] border border-gray-200">
                <div className="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <span role="img" aria-label="medal">
                    🎖️
                  </span>{" "}
                  Driver Qualifications
                </div>
                <div className="text-sm text-gray-700">
                  {driverQualTypes.length ? (
                    <ul className="space-y-2">
                      {driverQualTypes.map((t, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 border border-gray-100 rounded p-2"
                        >
                          <div className="font-medium">{t}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-green-700 font-semibold flex items-center gap-1">
                      <span role="img" aria-label="check">
                        ✅
                      </span>{" "}
                      None
                    </div>
                  )}
                </div>
              </div>
            </Popover>
          </div>

          {/* Column 4 - Vehicle Section */}
          <div className="flex flex-col justify-between h-full">
            {/* Top Section */}
            <div className="space-y-8">
              {/* Empty div for Status level */}
              <div className="h-6"></div>

              {/* Vehicle - Level 1 */}
              <div className="text-base py-2">
                <span className="font-bold">Vehicle:</span>{" "}
                {vehicle?.bumper_no || "—"}
              </div>

              {/* UIC - Level 2 */}
              <div className="text-base py-2">
                <span className="font-bold">UIC:</span> {vehicle?.uic || "—"}
              </div>

              {/* Company - Level 2 */}
              <div className="text-base py-2">
                <span className="font-bold">Company:</span>{" "}
                {vehicle?.uic?.slice(4, 5) || "—"}
              </div>

              {/* Vehicle Status - Level 3 */}
              <div className="flex items-center gap-3 py-2">
                <span className="text-base font-bold">Vehicle Status:</span>
                <StatusBadge status={vehicle?.status || "PENDING"} />
              </div>

              {/* Vehicle Faults - Level 4 */}
              <div className="flex items-center gap-3 py-2">
                <span className="text-base font-bold">Vehicle Faults:</span>
                <span
                  className={`badge ${vehicleFaults.length > 0 ? "state-DEADLINED" : "state-FMC"}`}
                >
                  {vehicleFaults.length > 0 ? "Has Faults" : "No Faults"}
                </span>
              </div>

              {/* Empty div for Comments Input level */}
              <div className="h-20"></div>
            </div>

            {/* Bottom Section - Button Level */}
            <button
              ref={faultsBtnRef}
              type="button"
              className="btn btn-secondary btn-pill w-1/2"
              onClick={() => setOpenFaults((v) => !v)}
              disabled={!vehicle}
            >
              View Vehicle Faults
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
          </div>
          {/* Comments Input Header - aligned with Previous Comments */}
          <div className="text-base font-bold">
            Add comments with approve/deny:
            {/* Comments Input Field */}
            <input
              className="rounded bottom-margin border p-3 bg-white w-full shadow-sm"
              type="text"
              id="comments"
              name="user_name"
              placeholder="Enter comments here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="bottom flex justify-end gap-4 mt-2 margin-top-auto">
              <button
                onClick={() => {
                  handlePost(true);
                }}
                className="btn btn-primary"
                value={true}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handlePost(false);
                }}
                className="btn btn-danger"
                value={false}
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ApprovalItem);
