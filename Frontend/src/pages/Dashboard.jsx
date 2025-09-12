// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { listRequests } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import SkeletonList from "../components/SkeletonList";
import EmptyState from "../components/EmptyState";
import DevRoleSwitcher from "../components/DevRoleSwitcher";
import BackgroundSlideshow from "../components/BackgroundSlideshow";
import { VehiclesContext } from "../context/VehiclesContext";
import { useContext } from "react";

// Minimal local badge (remove if you already have a shared one)
function StatusBadge({ status }) {
  const s = status || "PENDING";
  return <span className={`badge state-${s}`}>{s}</span>;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { dispatchId } = useContext(VehiclesContext);
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
  const IMAGES = [
    "/media/1.png",
    "/media/2.png",
    "/media/3.png",
    "/media/4.png",
    "/media/5.png",
  ];

  return (
    <div>
      <BackgroundSlideshow
        images={IMAGES}
        intervalMs={6000}
        fadeMs={800}
        dim={0.25}
      />
      <div
        className="cc-page space-y-6"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Dev-only role switcher */}
        {import.meta.env.DEV && <DevRoleSwitcher />}

        {/* Dev-only welcome/role copy (for UI testing)
        {import.meta.env.DEV && (
          <div className="card">
            <div className="card-body flex items-center gap-2">
              <span className="card-subtitle">Welcome back, {firstName}.</span>
              {user?.role && <span className="badge">{user.role}</span>}
            </div>
          </div>
        )} */}

        <h1 className="cc-page-title">Dashboard</h1>

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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
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
    </div>
  );
}
