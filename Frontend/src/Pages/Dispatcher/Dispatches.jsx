import React, { useMemo, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useFetch } from "../../Hooks/useFetch";
import { listRequests } from "../../API/client"; // or a dedicated listDispatches()
import Loading from "../../Components/Loading";
import SkeletonList from "../../Components/SkeletonList";
import EmptyState from "../../Components/EmptyState";
import RequestCard from "../../Components/RequestCard";

const FILTERS = ["OUT", "DISPATCHED", "RETURNED"];

export default function Dispatches() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState("OUT");

  if (authLoading) return <Loading label="Loading account…" />;
  if (user && user.role !== "DISPATCHER" && !import.meta.env.DEV) {
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Access restricted</h3>
            <p className="card-subtitle">Dispatcher role required.</p>
          </div>
        </div>
      </div>
    );
  }

  const params = useMemo(() => ({ status: filter }), [filter]);
  const { data, loading } = useFetch(() => listRequests(params), [filter]);

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Dispatches</h1>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`badge ${f === filter ? "state-DISPATCHED" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonList rows={4} />
      ) : data?.items?.length ? (
        <div className="grid gap-3">
          {data.items.map((r) => (
            <RequestCard key={r.id} item={r} />
          ))}
        </div>
      ) : (
        <EmptyState title={`No ${filter.toLowerCase()} dispatches.`} />
      )}
    </div>
  );
}
