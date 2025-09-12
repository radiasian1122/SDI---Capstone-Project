import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { listRequests } from "../../api/client"; // must return { items: [...] }
import { useVehicles, useUsersWithQuals } from "../../hooks/useDomainData";
import Loading from "../../components/Loading";
import SkeletonList from "../../components/SkeletonList";
import EmptyState from "../../components/EmptyState";
import ApprovalItem from "./ApprovalItem";

export default function Approvals() {
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

  const params = useMemo(() => ({ status: "PENDING" }), []);
  const { data, loading } = useFetch(() => listRequests(params), []);
  const { users, userQuals, loading: usersLoading } = useUsersWithQuals();
  const { items: vehicles, loading: vehiclesLoading } = useVehicles();

  const driverQuals = userQuals;

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Dispatches</h1>

      {loading || usersLoading || vehiclesLoading ? (
        <SkeletonList rows={4} />
      ) : data?.items?.length ? (
        <div className="grid gap-3">
          {data.items.map((r) => (
            <ApprovalItem
              key={r.dispatch_id ?? r.id ?? `${r.driver_id}:${r.vehicle_id}`}
              row={r}
              users={users}
              vehicles={vehicles}
              driverQuals={driverQuals}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No pending requests." />
      )}
    </div>
  );
}
