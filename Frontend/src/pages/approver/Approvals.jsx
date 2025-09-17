import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { listRequests } from "../../api/client"; // must return { items: [...] }
import { useVehicles, useUsersWithQuals } from "../../hooks/useDomainData";
import Loading from "../../components/Loading";
import SkeletonList from "../../components/SkeletonList";
import EmptyState from "../../components/EmptyState";
import ApprovalItem from "./ApprovalItem";
import BackgroundSlideshow from "../../components/BackgroundSlideshow.jsx"


export default function Approvals() {

  const IMAGES = [
    "/media/1.png",
    "/media/2.png",
    "/media/3.png",
    "/media/4.png",
    "/media/5.png",
  ];

  const { user, loading: authLoading } = useAuth();
  if (authLoading) return <Loading label="Loading account…" />;

  // Soft guard in case ProtectedRoute isn't enforcing roles (dev)
  if (user && user.role !== "APPROVER" && !import.meta.env.DEV) {
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Access restricted</h3>
            <p className="card-subtitle">Approver role required.</p>
          </div>
        </div>
      </div>
    );
  }
  const [dispatches, setDispatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/dispatches")
      .then((res) => res.json())
      .then((data) => setDispatches(data));
  }, []);

  const params = useMemo(() => ({ status: "PENDING" }), []);
  const { data, loading } = useFetch(() => listRequests(params), []);
  const { users, userQuals, loading: usersLoading } = useUsersWithQuals();
  const { items: vehicles, loading: vehiclesLoading } = useVehicles();

  const driverQuals = userQuals;

  return (
    <div>
      <BackgroundSlideshow
        images={IMAGES}
        intervalMs={6000}
        fadeMs={800}
        dim={0.25}
      />
      <div className="cc-page space-y-6 approval-items-page">
        <h1 className="cc-page-title">Pending Dispatches <span>{`(${dispatches.filter(d => (d.approved !== true) && (d.comments === null)).length})`}</span></h1>

        {loading || usersLoading || vehiclesLoading ? (
          <SkeletonList rows={4} />
        ) : dispatches.filter(d => (d.approved !== true) && (d.comments === null)).length > 0 ? (
          <div className="grid gap-3">
            {dispatches
              .filter(d => (d.approved !== true) && (d.comments === null))
              .sort((a, b) => {
                // Pending requests first (no comments or approved is null/undefined)
                const aPending = !a.comments || a.approved === null || a.approved === undefined;
                const bPending = !b.comments || b.approved === null || b.approved === undefined;

                if (aPending && !bPending) return -1; // a goes first
                if (!aPending && bPending) return 1;  // b goes first
                return 0; // keep original order for same type
              })
              .map((r) => (
                <ApprovalItem
                  key={r.dispatch_id ?? r.id ?? `${r.driver_id}:${r.vehicle_id}`}
                  row={r}
                  users={users}
                  vehicles={vehicles}
                  driverQuals={driverQuals}
                  dispatches={dispatches}
                  setDispatches={setDispatches}
                />
              ))}
          </div>
        ) : (
          <EmptyState title="No pending requests." />
        )}
      </div>
    </div>
  );
}
