import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import BackgroundMedia from "../../components/BackgroundMedia";
import { useFetch } from "../../hooks/useFetch";
import { listVehicles } from "../../api/client";

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
  const [pickerValue, setPickerValue] = useState("");

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
    if (!validate()) return;
    // TODO: POST to API; show toast on success
    console.log("submit", {
      ...form,
      user_id: user?.id,
      vehicle_ids: selectedVehicleIds,
    });
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
                </div>
              )}

              {selectedVehicleIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-muted mb-2">Selected vehicles</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicleIds.map((id) => {
                      const v = allVehicles.find((x) => x.id === id);
                      return (
                        <div key={id} className="badge">
                          {v ? `${v.name} • ${v.type}` : `Vehicle ${id}`}
                          <button
                            type="button"
                            className="ml-2 text-danger"
                            onClick={() => removeVehicle(id)}
                            aria-label={`Remove vehicle ${id}`}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
