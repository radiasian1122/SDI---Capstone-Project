import React, { useMemo } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useFetch } from "../../Hooks/useFetch";
import { listRequests } from "../../API/client"; // must return { items: [...] }
import Loading from "../../Components/Loading";
import SkeletonList from "../../Components/SkeletonList";
import EmptyState from "../../Components/EmptyState";
import RequestCard from "../../Components/RequestCard";

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

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Approvals</h1>

      {loading ? (
        <SkeletonList rows={4} />
      ) : data?.items?.length ? (
        <div className="grid gap-3">
          {data.items.map((r) => (
            <div key={r.id} className="card">
              <div className="card-body">
                <RequestCard item={r} />
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-primary">Approve</button>
                  <button className="btn btn-danger">Deny</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No pending requests." />
      )}
    </div>
  );
}
