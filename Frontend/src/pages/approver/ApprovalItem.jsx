import React, { useMemo, useRef, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import Popover from "../../components/Popover";
import { getDriverQualTypes } from "../../data/selectors";

export default function ApprovalItem({ row, users, vehicles, driverQuals }) {
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
  const qualsBtnRef = useRef(null);
  const [openQuals, setOpenQuals] = useState(false);

  return (
    <div key={id} className="card">
      <div className="card-body space-y-4">
        {/* Vehicle strip with status */}
        <div className="flex relative items-center justify-end-safe gap-44 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-text/70">Vehicle:</span>
            <strong>{vehicle?.bumper_no || "—"}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-text/70">Company:</span>
            <strong>
              {vehicle?.company || vehicle?.uic?.slice(4, 5) || "—"}
            </strong>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-text/70">Status:</div>
            <StatusBadge status={vehicle?.status || "PENDING"} />
          </div>

          <StatusBadge status={row.approved ? "APPROVED" : "PENDING"} />
        </div>

        {/* Driver + Requester section */}

        <div className="flex relative items-center justify-end-safe gap-26 text-sm">
          {" "}
          <div>
            <strong>Driver:</strong>{" "}
            {driver
              ? `${driver.first_name} ${driver.last_name}`
              : row.driver_id || "—"}
          </div>
          <div>
            <strong>UIC:</strong> {driver?.uic || "—"}
          </div>
          <div className="flex items-center gap-2">
            <button
              ref={qualsBtnRef}
              type="button"
              className="btn btn-secondary btn-pill"
              onClick={() => setOpenQuals((v) => !v)}
              disabled={!driver}
            >
              Driver Qualifications
            </button>
            Driver Qualified on requested Vehicle:
            <span
              className={`badge ${qualified ? "state-FMC" : "state-DEADLINED"}`}
            >
              {qualified ? "Yes" : "No"}
            </span>
            <Popover
              anchorRef={qualsBtnRef}
              open={openQuals}
              onClose={() => setOpenQuals(false)}
            >
              <div className="popover-body">
                <div className="font-semibold mb-1">Driver Qualifications:</div>
                <div className="text-sm">
                  {driverQualTypes.length ? (
                    <code>[{driverQualTypes.join(", ")}]</code>
                  ) : (
                    <em>None</em>
                  )}
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t">
        <div className="mb-2">
          <strong>Requester:</strong>{" "}
          {requestor
            ? `${requestor.first_name} ${requestor.last_name}`
            : row.requestor_id || "—"}
        </div>
        <div className="mt-2 flex gap-2">
          <button className="btn btn-primary">Approve</button>
          <button className="btn btn-danger">Deny</button>
        </div>
      </div>
    </div>
  );
}
