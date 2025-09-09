import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";

export default function NewRequest() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    destination: "",
    purpose: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState({});

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
    console.log("submit", { ...form, user_id: user?.id });
  };

  return (
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
          {errors.destination && <p className="error">{errors.destination}</p>}
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
            {errors.start_time && <p className="error">{errors.start_time}</p>}
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
  );
}
