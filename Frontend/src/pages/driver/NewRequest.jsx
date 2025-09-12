import React, { useMemo, useState, useEffect, useContext, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import BackgroundMedia from "../../components/BackgroundMedia";
import { useFetch } from "../../hooks/useFetch";
import {
  listVehicles,
  listUsers,
  getUserQuals,
  createDispatch,
  listDispatches,
} from "../../api/client";
import { ToastCtx } from "../../components/ToastProvider";
import Popover from "../../components/Popover";

function DriverSelect({ value, onChange, options }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select driver…</option>
        {options.map((u) => (
          <option key={u.dod_id} value={u.dod_id}>
            {u.first_name} {u.last_name} ({u.dod_id})
          </option>
        ))}
      </select>
      <button
        ref={btnRef}
        type="button"
        className="btn btn-ghost btn-icon"
        aria-label="Driver details"
        onClick={() => setOpen((v) => !v)}
        disabled={!value}
      >
        i
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-body text-sm">
          {(() => {
            const u = options.find((o) => String(o.dod_id) === String(value));
            if (!u) return <em>No driver selected</em>;
            return (
              <div>
                <div className="font-semibold mb-1">
                  {u.first_name} {u.last_name}
                </div>
                <div className="text-text/70">DOD: {u.dod_id}</div>
                <div className="text-text/70">UIC: {u.uic || '—'}</div>
              </div>
            );
          })()}
        </div>
      </Popover>
    </div>
  );
}

function VehicleInfoButton({ vehicle }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  if (!vehicle) return (
    <button className="btn btn-ghost btn-icon" disabled aria-label="Vehicle details">i</button>
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
          <div className="grid gap-1">
            <div><strong>Company:</strong> {vehicle.company || (vehicle.uic?.slice(4,5)) || '—'}</div>
            <div><strong>Vehicle:</strong> {vehicle.bumper_no || '—'}</div>
            <div className="flex items-center gap-1"><strong>Status:</strong> <span className={`badge state-${vehicle.status}`}>{vehicle.status}</span></div>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default function NewRequest() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    destination: "",
    purpose: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [driverByVehicle, setDriverByVehicle] = useState({}); // { [vehicleId]: userId }
  const [pickerValue, setPickerValue] = useState("");
  const { showToast } = useContext(ToastCtx) || { showToast: () => {} };

  // Load vehicles inventory
  const { data: vehiclesData, loading: vehiclesLoading } = useFetch(
    () => listVehicles(),
    []
  );

  const allVehicles = vehiclesData?.items || [];
  const availableVehicles = useMemo(
    () =>
      allVehicles.filter(
        (v) => v.status === "FMC" && !selectedVehicleIds.includes(v.id)
      ),
    [allVehicles, selectedVehicleIds]
  );

  // Load current dispatches to treat their drivers as busy (unavailable)
  const dispatchesQuery = useFetch(() => listDispatches(), []);
  const busyDriverIds = useMemo(() => {
    const items = dispatchesQuery.data?.items || [];
    return new Set(items.map((d) => Number(d.driver_id)).filter(Boolean));
  }, [dispatchesQuery.data]);

  // Load users and their quals (to determine driver eligibility)
  const { data: usersData, loading: usersLoading } = useFetch(
    () => listUsers(),
    []
  );
  const users = usersData?.items || [];
  const [userQuals, setUserQuals] = useState({}); // { [userId]: number[] }
  const [qualsLoading, setQualsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadQuals() {
      if (!users.length) return;
      setQualsLoading(true);
      try {
        const entries = await Promise.all(
          users.map(async (u) => {
            try {
              const quals = await getUserQuals(u.dod_id);
              const ids = Array.isArray(quals)
                ? quals.map((q) => q.qual_id).filter((x) => x != null)
                : [];
              return [u.dod_id, ids];
            } catch {
              return [u.dod_id, []];
            }
          })
        );
        if (!cancelled) setUserQuals(Object.fromEntries(entries));
      } finally {
        if (!cancelled) setQualsLoading(false);
      }
    }
    loadQuals();
    return () => {
      cancelled = true;
    };
  }, [users]);

  const eligibleDrivers = (vehicleId) => {
    const vehicle = allVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return [];
    const required = vehicle.qual_id;
    const selectedDriverIds = new Set(
      Object.entries(driverByVehicle)
        .filter(([vid]) => Number(vid) !== vehicleId)
        .map(([, uid]) => Number(uid))
    );
    return users
      .filter((u) => (userQuals[u.dod_id] || []).includes(required))
      .filter((u) => !selectedDriverIds.has(Number(u.dod_id)))
      .filter((u) => !busyDriverIds.has(Number(u.dod_id)));
  };

  if (loading) return <Loading label="Loading account…" />;

  // Client-side validation
  const validate = () => {
    const e = {};
    if (!form.destination) e.destination = "Required";
    if (!form.start_time) e.start_time = "Required";
    if (!form.end_time) e.end_time = "Required";
    if (
      form.start_time &&
      form.end_time &&
      new Date(form.end_time) < new Date(form.start_time)
    ) {
      e.end_time = "End time must be after start time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (k) => (ev) =>
    setForm((f) => ({ ...f, [k]: ev.target.value }));
  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (selectedVehicleIds.length === 0) {
      e.vehicles = "Select at least one vehicle and driver";
    }
    for (const vid of selectedVehicleIds) {
      if (!driverByVehicle[vid]) {
        e[`driver_${vid}`] = "Driver required for this vehicle";
      }
    }
    if (!validate() || Object.keys(e).length) {
      setErrors((prev) => ({ ...prev, ...e }));
      return;
    }

    try {
      // Use a valid requestor id from DB. In dev, the Auth user isn't in DB,
      // so fall back to the first listed user to satisfy FK.
      const fallbackRequestorId =
        (Array.isArray(users) && users[0]?.dod_id) || null;
      const requestor_id = user?.dod_id ?? fallbackRequestorId;
      await Promise.all(
        selectedVehicleIds.map((vid) =>
          createDispatch({
            requestor_id,
            driver_id: driverByVehicle[vid],
            vehicle_id: vid,
          })
        )
      );
      showToast("Request submitted", "success");
      // Reset form
      setSelectedVehicleIds([]);
      setDriverByVehicle({});
      setForm({ destination: "", purpose: "", start_time: "", end_time: "" });
    } catch (err) {
      console.error(err);
      showToast("Failed to submit request", "error");
    }
  };

  const addVehicle = () => {
    const id = Number(pickerValue);
    if (!id) return;
    setSelectedVehicleIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setPickerValue("");
  };

  const removeVehicle = (id) =>
    setSelectedVehicleIds((prev) => prev.filter((x) => x !== id));

  return (
    <BackgroundMedia>
      <div className="card slide-in" style={{ maxWidth: 550, width: "100%" }}>
        <div className="card-body"></div>

        <div className="cc-page space-y-6">
          <h1 className="cc-page-title">New Dispatch Request</h1>

          <form className="space-y-4 max-w-xl" onSubmit={onSubmit} noValidate>
            <div>
              <label className="label required" htmlFor="destination">
                Destination
              </label>
              <input
                id="destination"
                className="input"
                value={form.destination}
                onChange={onChange("destination")}
              />
              {errors.destination && (
                <p className="error">{errors.destination}</p>
              )}
            </div>

            {/* Vehicles picker */}
            <div>
              <label className="label" htmlFor="vehicle-picker">
                Vehicles (select one or more)
              </label>
              {vehiclesLoading ? (
                <div className="text-muted">Loading vehicles…</div>
              ) : (
                <div className="flex gap-2 items-center">
                  <select
                    id="vehicle-picker"
                    className="input"
                    value={pickerValue}
                    onChange={(e) => setPickerValue(e.target.value)}
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
                    onClick={addVehicle}
                    disabled={!pickerValue}
                  >
                    Add
                  </button>
                  <VehicleInfoButton
                    vehicle={availableVehicles.find((v) => String(v.id) === String(pickerValue))}
                  />
                </div>
              )}

              {selectedVehicleIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-muted mb-2">
                    Selected vehicles and drivers
                  </div>
                  <div className="space-y-2">
                    {selectedVehicleIds.map((id) => {
                      const v = allVehicles.find((x) => x.id === id);
                      const eligible = eligibleDrivers(id);
                      return (
                    <div key={id} className="card">
                      <div className="card-body flex items-center gap-3">
                        <div className="badge">
                          {v ? `${v.name} • ${v.type}` : `Vehicle ${id}`}
                        </div>
                        <div className="flex-1">
                          {usersLoading || qualsLoading ? (
                            <div className="text-muted">
                              Loading drivers…
                            </div>
                          ) : eligible.length ? (
                            <DriverSelect
                              value={driverByVehicle[id] || ""}
                              onChange={(val) =>
                                setDriverByVehicle((prev) => ({ ...prev, [id]: Number(val) }))
                              }
                              options={eligible}
                            />
                          ) : (
                            <div className="text-danger text-sm">
                              No qualified drivers available for this
                              vehicle.
                            </div>
                          )}
                          {errors[`driver_${id}`] && (
                            <p className="error">
                              {errors[`driver_${id}`]}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeVehicle(id)}
                          aria-label={`Remove vehicle ${id}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
                  {errors.vehicles && (
                    <p className="error mt-2">{errors.vehicles}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="label" htmlFor="purpose">
                Purpose
              </label>
              <textarea
                id="purpose"
                className="input"
                rows={3}
                value={form.purpose}
                onChange={onChange("purpose")}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label required" htmlFor="start">
                  Start time
                </label>
                <input
                  id="start"
                  type="datetime-local"
                  className="input"
                  value={form.start_time}
                  onChange={onChange("start_time")}
                />
                {errors.start_time && (
                  <p className="error">{errors.start_time}</p>
                )}
              </div>
              <div>
                <label className="label required" htmlFor="end">
                  End time
                </label>
                <input
                  id="end"
                  type="datetime-local"
                  className="input"
                  value={form.end_time}
                  onChange={onChange("end_time")}
                />
                {errors.end_time && <p className="error">{errors.end_time}</p>}
              </div>
            </div>

            {/* Sticky actions */}
            <div className="cc-actionbar">
              <button type="button" className="btn btn-secondary">
                Cancel
              </button>
              <div className="cc-spacer" />
              <button type="submit" className="btn btn-primary">
                Submit Request
              </button>
            </div>
            <div className="cc-sticky-pad" />
          </form>
        </div>
      </div>
    </BackgroundMedia>
  );
}
