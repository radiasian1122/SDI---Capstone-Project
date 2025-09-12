// src/pages/dispatcher/Dispatches.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { listRequests } from "../../api/client";
import Loading from "../../components/Loading";
import SkeletonList from "../../components/SkeletonList";
import EmptyState from "../../components/EmptyState";
import RequestCard from "../../components/RequestCard";
import AccessRestrictedCard from "../../components/AccessRestrictedCard";

const FILTERS = ["OUT", "DISPATCHED", "RETURNED"];

export default function Dispatches() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState("OUT");

  // Decide if this user can view the page
  const canView = import.meta.env.DEV || (user && user.role === "DISPATCHER");
  // Enabled flag prevents fetching until we’re allowed
  const enabled = !authLoading && canView;

  // Build params & fetcher unconditionally
  const params = useMemo(() => ({ status: filter }), [filter]);
  const fetcher = useCallback(
    () => listRequests(params),
    [JSON.stringify(params)]
  );

  // Call the hook UNCONDITIONALLY
  const { data, loading, error, refetch } = useFetch(
    fetcher,
    // include both your params AND 'enabled' so the effect re-evaluates when enabled toggles true
    [JSON.stringify(params), enabled],
    { auto: enabled }
  );

  // Early returns AFTER all hooks are declared:
  if (authLoading) return <Loading label="Loading account…" />;
  if (!canView) return <AccessRestrictedCard />;

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
