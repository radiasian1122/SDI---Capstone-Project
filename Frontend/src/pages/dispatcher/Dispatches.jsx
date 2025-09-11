// src/pages/dispatcher/Dispatches.jsx
import { useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { listRequests } from "../../api/client";
import Loading from "../../components/Loading";
import SkeletonList from "../../components/SkeletonList";
import EmptyState from "../../components/EmptyState";
import DispatchCard from "../../components/DispatchCard";
import AccessRestrictedCard from "../../components/AccessRestrictedCard";

const FILTERS = ["PENDING", "APPROVED"];
const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Dispatches() {
  const { user, loading: authLoading } = useAuth();
  const [dispatches, setDispatches] = useState([])
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetch(`${api_url}/dispatches`)
    .then(res => res.json())
    .then(data => setDispatches(data))
    .catch(err => console.error(err.message))
  })

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
  const { loading, error, refetch } = useFetch(
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
      ) : dispatches?.length ? (
        <div className="grid gap-3">
          {dispatches.map((dispatch) => {
            if (filter === 'PENDING' && dispatch.approved === false){
              return <DispatchCard key={dispatch.dispatch_id} dispatch={dispatch} />
            }
            else if (filter === 'APPROVED' && dispatch.approved === true){
              return <DispatchCard key={dispatch.dispatch_id} dispatch={dispatch} />
            }
          })}
        </div>
      ) : (
        <EmptyState title={`No ${filter.toLowerCase()} dispatches.`} />
      )}
    </div>
  );
}
