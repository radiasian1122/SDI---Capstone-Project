import React, { useMemo, useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import BackgroundMedia from "../../components/BackgroundMedia";
import { useFetch } from "../../hooks/useFetch";
import { createDispatch } from "../../api/client";
import {
  useVehicles,
  useUsersWithQuals,
  useDispatches,
} from "../../hooks/useDomainData";
import { getEligibleDrivers } from "../../data/selectors";
import { ToastCtx } from "../../components/ToastProvider";
import VehiclePicker from "./components/VehiclePicker";
import SelectedVehiclesList from "./components/SelectedVehiclesList";

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
  const { items: allVehicles, loading: vehiclesLoading } = useVehicles();
  const availableVehicles = useMemo(
    () =>
      allVehicles.filter(
        (v) => v.status === "FMC" && !selectedVehicleIds.includes(v.id)
      ),
    [allVehicles, selectedVehicleIds]
  );

  // Load current dispatches to treat their drivers as busy (unavailable)
  const { busySet: busyDriverIds } = useDispatches();

  // Load users and their quals (to determine driver eligibility)
  const { users, userQuals, loading: usersLoading } = useUsersWithQuals();

  const eligibleDrivers = (vehicleId) => {
    const vehicle = allVehicles.find((v) => v.id === vehicleId);
    const selectedIds = Object.entries(driverByVehicle)
      .filter(([vid]) => Number(vid) !== vehicleId)
      .map(([, uid]) => Number(uid));
    return getEligibleDrivers({
      vehicle,
      users,
      userQuals,
      busySet: busyDriverIds,
      selectedDriverIds: selectedIds,
    });
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
                <VehiclePicker
                  availableVehicles={availableVehicles}
                  value={pickerValue}
                  onChange={(val) => setPickerValue(val)}
                  onAdd={addVehicle}
                />
              )}

              {selectedVehicleIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-muted mb-2">
                    Selected vehicles and drivers
                  </div>
                  <SelectedVehiclesList
                    selectedVehicleIds={selectedVehicleIds}
                    vehicles={allVehicles}
                    getEligibleDrivers={eligibleDrivers}
                    driverByVehicle={driverByVehicle}
                    setDriverByVehicle={setDriverByVehicle}
                    onRemoveVehicle={removeVehicle}
                    errors={errors}
                  />
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
