// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { listRequests } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import SkeletonList from "../components/SkeletonList";
import EmptyState from "../components/EmptyState";
import DevRoleSwitcher from "../components/DevRoleSwitcher";

// Minimal local badge (remove if you already have a shared one)
function StatusBadge({ status }) {
  const s = status || "PENDING";
  return <span className={`badge state-${s}`}>{s}</span>;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  // 1) Wait for auth to resolve (both dev & prod)
  if (authLoading) return <Loading label="Loading account…" />;

  // 2) Resolve a safe role (dev default if needed)
  const role =
    user?.role ??
    (import.meta.env.DEV
      ? localStorage.getItem("dev-role") || "DISPATCHER"
      : null);

  // 3) If no role in prod, show friendly message
  if (!role) {
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Signed out</h3>
            <p className="card-subtitle">
              Please log in to view the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4) Build params now that role is known
  const params = useMemo(() => {
    if (role === "DRIVER") return { mine: true };
    if (role === "APPROVER") return { status: "PENDING" };
    return { status: "OUT" }; // DISPATCHER: show active
  }, [role]);

  // 5) Fetch data; key off params only
  const { data, loading: dataLoading } = useFetch(
    () => listRequests(params),
    [JSON.stringify(params)]
  );

  const firstName = user?.first_name || user?.name || "User";

  return (
    <div className="cc-page space-y-6">
      {/* Dev-only role switcher */}
      {import.meta.env.DEV && <DevRoleSwitcher />}

      <h1 className="cc-page-title">Dashboard</h1>

      {/* Overview card */}
      <div className="card">
        <div className="card-body">
          <p className="card-subtitle">User's role: {role}</p>
          <p className="mt-2">Welcome back, {firstName}.</p>
        </div>
      </div>

      {/* Content */}
      {dataLoading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="grid gap-3">
          {data?.items?.length ? (
            data.items.map((r) => (
              <div key={r.id} className="card">
                <div className="card-body">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>{r.destination}</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {new Date(r.start_time).toLocaleString()} →{" "}
                    {new Date(r.end_time).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13 }}>{r.purpose}</div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No requests match your filters." />
          )}
        </div>
      )}
    </div>
  );
}
